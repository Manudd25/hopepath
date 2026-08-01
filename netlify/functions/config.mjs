const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=300',
}

function buildPublicConfig() {
  const firebase = {
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
  }

  const firebaseReady = Boolean(
    firebase.apiKey && firebase.projectId && firebase.appId
  )

  return {
    firebase: firebaseReady ? firebase : null,
    gaMeasurementId: process.env.GA_MEASUREMENT_ID || null,
    seedFirestore: process.env.SEED_FIRESTORE === 'true',
  }
}

export default async (request) => {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: JSON_HEADERS,
    })
  }

  return new Response(JSON.stringify(buildPublicConfig()), {
    status: 200,
    headers: JSON_HEADERS,
  })
}

export { buildPublicConfig }
