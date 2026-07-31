import ReactGA from 'react-ga4'

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

let initialized = false

export function isAnalyticsConfigured() {
  return Boolean(GA_ID)
}

export function initAnalytics() {
  if (!GA_ID || initialized) return

  ReactGA.initialize(GA_ID)
  initialized = true
}

export function trackPageView(path) {
  if (!GA_ID || !initialized) return

  ReactGA.send({
    hitType: 'pageview',
    page: path,
  })
}
