import React, { useState } from 'react'
import { exportHistory, exportProjects, exportBlogs, exportHeroSettings, getAboutText, downloadResume } from '../lib/exportUtils'
import { isRepoSyncAvailable, saveToRepo, deployRepo } from '../lib/repoSync'
import styles from './ExportPanel.module.css'

const ExportPanel = () => {
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState('')
  const [publishLog, setPublishLog] = useState('')

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleExport = async (fn, label) => {
    setLoading(label)
    try {
      await fn()
      showMessage('success', `${label} exported!`)
    } catch (err) {
      showMessage('error', `Failed: ${err.message}`)
    }
    setLoading('')
  }

  const handleSaveToRepo = async () => {
    setLoading('save')
    setPublishLog('')
    try {
      const res = await saveToRepo()
      setPublishLog(`Wrote:\n${res.written.join('\n')}`)
      showMessage('success', 'Data saved to repo (src/data/). Commit & deploy when ready.')
    } catch (err) {
      showMessage('error', `Save failed: ${err.message}`)
    }
    setLoading('')
  }

  const handleSaveAndDeploy = async () => {
    if (!window.confirm('This will save data to the repo, commit src/data, and run `npm run deploy` to publish the live site. Continue?')) return
    setLoading('deploy')
    setPublishLog('')
    try {
      const saveRes = await saveToRepo()
      setPublishLog(`Wrote:\n${saveRes.written.join('\n')}\n\nDeploying…`)
      const res = await deployRepo()
      const out = (res.steps || [])
        .map(s => `$ ${s.cmd}\n${[s.stdout, s.stderr, s.note].filter(Boolean).join('\n')}`)
        .join('\n\n')
      setPublishLog(out)
      showMessage('success', 'Saved, committed, and deployed to GitHub Pages!')
    } catch (err) {
      setPublishLog(prev => `${prev}\n\nERROR: ${err.message}\n${err.stderr || ''}`)
      showMessage('error', `Deploy failed: ${err.message}`)
    }
    setLoading('')
  }

  const handleCopyAbout = async () => {
    setLoading('About')
    try {
      const text = await getAboutText()
      await navigator.clipboard.writeText(text)
      showMessage('success', 'About text copied to clipboard!')
    } catch (err) {
      showMessage('error', `Failed: ${err.message}`)
    }
    setLoading('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.heading}>Publish to Repo</h2>
        {isRepoSyncAvailable ? (
          <>
            <p className={styles.description}>
              Pulls the latest data from Supabase and writes it straight into{' '}
              <code>src/data/</code> on disk — no manual download needed.{' '}
              <strong>Save &amp; Deploy</strong> also commits and runs{' '}
              <code>npm run deploy</code>.
            </p>
            <div className={styles.buttons}>
              <button
                className={styles.publishBtn}
                onClick={handleSaveAndDeploy}
                disabled={!!loading}
              >
                {loading === 'deploy' ? 'Deploying…' : 'Save & Deploy'}
              </button>
              <button
                className={`${styles.publishBtn} ${styles.secondary}`}
                onClick={handleSaveToRepo}
                disabled={!!loading}
              >
                {loading === 'save' ? 'Saving…' : 'Save to Repo (no deploy)'}
              </button>
            </div>
            {publishLog && <pre className={styles.log}>{publishLog}</pre>}
          </>
        ) : (
          <p className={styles.notice}>
            Repo publishing is available only when running the admin panel locally
            via <code>npm run dev</code>. On the deployed site, use the manual
            downloads below.
          </p>
        )}
      </div>

      <h2 className={styles.heading}>Export Data (manual)</h2>
      <p className={styles.description}>
        Download JSON files to update the public site. Replace the corresponding files in <code>src/data/</code>.
      </p>

      <div className={styles.buttons}>
        <button
          className={styles.exportBtn}
          onClick={() => handleExport(exportHistory, 'history.json')}
          disabled={!!loading}
        >
          {loading === 'history.json' ? 'Exporting...' : 'Download history.json'}
        </button>

        <button
          className={styles.exportBtn}
          onClick={() => handleExport(exportProjects, 'projects.json')}
          disabled={!!loading}
        >
          {loading === 'projects.json' ? 'Exporting...' : 'Download projects.json'}
        </button>

        <button
          className={styles.exportBtn}
          onClick={() => handleExport(exportBlogs, 'blogs.json')}
          disabled={!!loading}
        >
          {loading === 'blogs.json' ? 'Exporting...' : 'Download blogs.json'}
        </button>

        <button
          className={styles.exportBtn}
          onClick={() => handleExport(exportHeroSettings, 'heroSettings.json')}
          disabled={!!loading}
        >
          {loading === 'heroSettings.json' ? 'Exporting...' : 'Download heroSettings.json'}
        </button>

        <button
          className={styles.exportBtn}
          onClick={handleCopyAbout}
          disabled={!!loading}
        >
          {loading === 'About' ? 'Copying...' : 'Copy About Me Text'}
        </button>

        <button
          className={styles.exportBtn}
          onClick={() => handleExport(downloadResume, 'Resume')}
          disabled={!!loading}
        >
          {loading === 'Resume' ? 'Opening...' : 'Download Resume'}
        </button>
      </div>

      {message && (
        <p className={message.type === 'error' ? styles.error : styles.success}>
          {message.text}
        </p>
      )}
    </div>
  )
}

export default ExportPanel
