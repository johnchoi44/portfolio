import {
  getHistoryData,
  getProjectsData,
  getBlogsData,
  getHeroSettingsData,
} from './exportUtils'

// These endpoints are served only by the local Vite dev server
// (see vite-plugin-local-cms.js). They do not exist in the deployed build,
// which is why repo publishing is available only under `npm run dev`.
export const isRepoSyncAvailable = import.meta.env.DEV

const password = () => import.meta.env.VITE_ADMIN_PASSWORD

const post = async (url, payload) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

// Pull the current data straight from Supabase and return the exact JSON
// shapes that live in src/data/*.json.
export const collectAllData = async () => {
  const [history, projects, blogs, heroSettings] = await Promise.all([
    getHistoryData(),
    getProjectsData(),
    getBlogsData(),
    getHeroSettingsData(),
  ])
  return {
    'history.json': history,
    'projects.json': projects,
    'blogs.json': blogs,
    'heroSettings.json': heroSettings,
  }
}

// Write all data files into the repo's src/data/ on disk.
export const saveToRepo = async () => {
  const files = await collectAllData()
  return post('/__cms/save', { password: password(), files })
}

// Commit src/data and run `npm run deploy`.
export const deployRepo = async () => post('/__cms/deploy', { password: password() })
