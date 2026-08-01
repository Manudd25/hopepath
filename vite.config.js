import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {
  isHopeAssistantConfigured,
  runHopeAssistant,
} from './netlify/lib/hopeAssistantCore.mjs'
import { getDailyPrayer, isValidDateKey } from './netlify/lib/dailyPrayerCore.mjs'

function buildPublicConfigFromEnv(env) {
  const firebase = {
    apiKey: env.FIREBASE_API_KEY || '',
    authDomain: env.FIREBASE_AUTH_DOMAIN || '',
    projectId: env.FIREBASE_PROJECT_ID || '',
    storageBucket: env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: env.FIREBASE_APP_ID || '',
  }

  const firebaseReady = Boolean(
    firebase.apiKey && firebase.projectId && firebase.appId
  )

  return {
    firebase: firebaseReady ? firebase : null,
    gaMeasurementId: env.GA_MEASUREMENT_ID || null,
    seedFirestore: env.SEED_FIRESTORE === 'true',
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

function devFunctionsPlugin(env) {
  return {
    name: 'hopepath-dev-functions',
    configureServer(server) {
      server.middlewares.use('/.netlify/functions/config', (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(buildPublicConfigFromEnv(env)))
      })

      server.middlewares.use('/.netlify/functions/hope-assistant', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!isHopeAssistantConfigured(env)) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error:
                'Hope Assistant is not configured. Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to .env',
            })
          )
          return
        }

        try {
          const payload = await readJsonBody(req)
          const reply = await runHopeAssistant({
            message: payload.message,
            history: payload.history || [],
            env,
          })
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ reply }))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error:
                err.message ||
                'Unable to reach Hope Assistant right now. Please try again shortly.',
            })
          )
        }
      })

      server.middlewares.use('/.netlify/functions/daily-prayer', async (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        const url = new URL(req.url, 'http://localhost')
        const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10)

        if (!isValidDateKey(date)) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Invalid date' }))
          return
        }

        try {
          const prayer = await getDailyPrayer(date, env)
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(prayer))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), devFunctionsPlugin(env)],
  }
})
