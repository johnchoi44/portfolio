import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import styles from './ResumeManager.module.css'

const BUCKET = 'portfolio-assets'
const RESUME_PATH = 'resume/resume.pdf'

const ResumeManager = () => {
  const [fileUrl, setFileUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    checkExisting()
  }, [])

  const checkExisting = async () => {
    const { data } = await supabase.storage.from(BUCKET).list('resume', { search: 'resume.pdf' })
    if (data && data.length > 0) {
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(RESUME_PATH)
      setFileUrl(urlData.publicUrl)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Only PDF files are allowed' })
      return
    }

    setUploading(true)
    setMessage(null)

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(RESUME_PATH, file, { upsert: true })

    if (error) {
      setMessage({ type: 'error', text: 'Upload failed: ' + error.message })
    } else {
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(RESUME_PATH)
      setFileUrl(urlData.publicUrl)
      setMessage({ type: 'success', text: 'Resume uploaded!' })
      setTimeout(() => setMessage(null), 3000)
    }
    setUploading(false)
    e.target.value = ''
  }

  const handleDelete = async () => {
    if (!confirm('Delete the resume?')) return

    const { error } = await supabase.storage.from(BUCKET).remove([RESUME_PATH])
    if (error) {
      setMessage({ type: 'error', text: 'Delete failed: ' + error.message })
    } else {
      setFileUrl(null)
      setMessage({ type: 'success', text: 'Resume deleted' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Resume</h2>

      <div className={styles.uploadArea}>
        <label className={styles.uploadBtn}>
          {uploading ? 'Uploading...' : 'Upload PDF'}
          <input type="file" accept=".pdf" onChange={handleUpload} hidden disabled={uploading} />
        </label>
      </div>

      {fileUrl && (
        <div className={styles.current}>
          <p className={styles.label}>Current resume:</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
            View resume.pdf
          </a>
          <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
        </div>
      )}

      {message && (
        <p className={message.type === 'error' ? styles.error : styles.success}>
          {message.text}
        </p>
      )}
    </div>
  )
}

export default ResumeManager
