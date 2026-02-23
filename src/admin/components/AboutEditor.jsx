import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import styles from './AboutEditor.module.css'

const AboutEditor = () => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      setMessage({ type: 'error', text: 'Failed to load about content' })
    } else {
      setContent(data.content)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    const { data: existing } = await supabase.from('about').select('id').limit(1).single()

    const { error } = await supabase
      .from('about')
      .update({ content })
      .eq('id', existing.id)

    if (error) {
      setMessage({ type: 'error', text: 'Failed to save: ' + error.message })
    } else {
      setMessage({ type: 'success', text: 'Saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    }
    setSaving(false)
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>About Me</h2>
      <textarea
        className={styles.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
      />
      <div className={styles.actions}>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        {message && (
          <span className={message.type === 'error' ? styles.error : styles.success}>
            {message.text}
          </span>
        )}
      </div>
    </div>
  )
}

export default AboutEditor
