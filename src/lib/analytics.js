import ReactGA from 'react-ga4'

let gaId = null
let initialized = false

export function isAnalyticsConfigured() {
  return Boolean(gaId)
}

export function initAnalytics(measurementId) {
  if (!measurementId || initialized) return

  gaId = measurementId
  ReactGA.initialize(gaId)
  initialized = true
}

export function trackPageView(path) {
  if (!gaId || !initialized) return

  ReactGA.send({
    hitType: 'pageview',
    page: path,
  })
}

export function trackFeelingsInteraction(interactionType) {
  if (!gaId || !initialized) return

  ReactGA.event({
    category: 'Feelings',
    action: 'feelings_interaction',
    label: interactionType,
  })
}
