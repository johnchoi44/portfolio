import React, { useState } from 'react'
import { exportHistory, exportProjects, exportBlogs, getAboutText, downloadResume } from '../lib/exportUtils'
import styles from './ExportPanel.module.css'

const ExportPanel = () => {
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState('')

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
      <h2 className={styles.heading}>Export Data</h2>
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
