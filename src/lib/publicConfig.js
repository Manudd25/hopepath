const CONFIG_URL = '/.netlify/functions/config'

let cachedConfig = null
let configPromise = null

export async function loadPublicConfig() {
  if (cachedConfig) return cachedConfig

  if (!configPromise) {
    configPromise = fetch(CONFIG_URL)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Could not load site configuration.')
        }
        return res.json()
      })
      .then((data) => {
        cachedConfig = data
        return data
      })
      .finally(() => {
        configPromise = null
      })
  }

  return configPromise
}
