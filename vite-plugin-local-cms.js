import { writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

// Files the admin panel is allowed to write, mapped to their destination.
// This allowlist is the guard against path traversal — anything not listed here is rejected.
const ALLOWED_FILES = new Set([
  'history.json',
  'projects.json',
  'blogs.json',
  'heroSettings.json',
])

const DATA_DIR = 'src/data'

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 5_000_000) reject(new Error('Payload too large'))
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

const sendJson = (res, status, payload) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

/**
 * Dev-only "local CMS" backend.
 *
 * Adds two endpoints to the Vite dev server so the admin panel can write the
 * portfolio's source-of-truth JSON straight into the repo (and optionally
 * redeploy), instead of downloading files by hand.
 *
 * Because it lives in `configureServer`, it exists ONLY under `npm run dev` —
 * it is never part of the production bundle. The admin password is checked
 * here, server-side, so it is never trusted from the client alone.
 */
export default function localCms() {
  return {
    name: 'local-cms',
    apply: 'serve',
    configureServer(server) {
      const root = server.config.root
      const password = server.config.env.VITE_ADMIN_PASSWORD

      const authorize = (req, res, body) => {
        if (!password) {
          sendJson(res, 500, { error: 'VITE_ADMIN_PASSWORD is not set in .env' })
          return false
        }
        if (body?.password !== password) {
          sendJson(res, 401, { error: 'Incorrect admin password' })
          return false
        }
        return true
      }

      // POST /__cms/save  { password, files: { "blogs.json": <json>, ... } }
      server.middlewares.use('/__cms/save', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        try {
          const body = await readBody(req)
          if (!authorize(req, res, body)) return

          const files = body.files || {}
          const written = []
          for (const [name, content] of Object.entries(files)) {
            if (!ALLOWED_FILES.has(name)) {
              return sendJson(res, 400, { error: `File not allowed: ${name}` })
            }
            const dest = resolve(root, DATA_DIR, name)
            // Defense-in-depth: ensure the resolved path stays inside src/data.
            if (!dest.startsWith(resolve(root, DATA_DIR) + '/')) {
              return sendJson(res, 400, { error: `Invalid path: ${name}` })
            }
            await writeFile(dest, JSON.stringify(content, null, 2) + '\n', 'utf8')
            written.push(join(DATA_DIR, name))
          }
          sendJson(res, 200, { ok: true, written })
        } catch (err) {
          sendJson(res, 400, { error: err.message })
        }
      })

      // POST /__cms/deploy  { password }
      // Commits src/data changes and runs `npm run deploy`.
      server.middlewares.use('/__cms/deploy', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        try {
          const body = await readBody(req)
          if (!authorize(req, res, body)) return

          const steps = []
          const run = async (cmd) => {
            const { stdout, stderr } = await execAsync(cmd, {
              cwd: root,
              maxBuffer: 20_000_000,
              timeout: 300_000,
            })
            steps.push({ cmd, stdout: stdout.trim(), stderr: stderr.trim() })
          }

          // Commit source changes (no-op if nothing changed), then deploy.
          await run('git add src/data')
          try {
            await run('git commit -m "Update portfolio data via admin panel"')
          } catch (e) {
            // "nothing to commit" exits non-zero — treat as fine.
            steps.push({ cmd: 'git commit', note: 'nothing to commit', detail: e.message })
          }
          await run('npm run deploy')

          sendJson(res, 200, { ok: true, steps })
        } catch (err) {
          sendJson(res, 500, { error: err.message, stdout: err.stdout, stderr: err.stderr })
        }
      })
    },
  }
}
