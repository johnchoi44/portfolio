import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ImageUploader from './ImageUploader'
import styles from './ProjectForm.module.css'

const ProjectForm = ({ item, nextSortOrder, onSaved, onCancel }) => {
  const [form, setForm] = useState({
    title: item?.title || '',
    description: item?.description || '',
    skills: item?.skills || [],
    demo: item?.demo || '',
    source: item?.source || '',
    youtube_link: item?.youtube_link || '',
    image_src: item?.image_src || '',
    screenshots: item?.screenshots || [],
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.skills.includes(tag)) {
      updateField('skills', [...form.skills, tag])
    }
    setTagInput('')
  }

  const removeTag = (index) => {
    updateField('skills', form.skills.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const payload = { ...form }

    if (item) {
      const { error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', item.id)

      if (error) {
        setMessage({ type: 'error', text: 'Save failed: ' + error.message })
        setSaving(false)
        return
      }
    } else {
      payload.sort_order = nextSortOrder
      const { error } = await supabase.from('projects').insert(payload)
      if (error) {
        setMessage({ type: 'error', text: 'Save failed: ' + error.message })
        setSaving(false)
        return
      }
    }

    setSaving(false)
    onSaved()
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{item ? 'Edit Project' : 'Add Project'}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          <span>Title</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />
        </label>
        <label className={styles.field}>
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            required
          />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>Demo URL</span>
            <input
              type="text"
              value={form.demo}
              onChange={(e) => updateField('demo', e.target.value)}
              placeholder="https://..."
            />
          </label>
          <label className={styles.field}>
            <span>Source URL</span>
            <input
              type="text"
              value={form.source}
              onChange={(e) => updateField('source', e.target.value)}
              placeholder="https://github.com/..."
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>YouTube Embed URL</span>
          <input
            type="text"
            value={form.youtube_link}
            onChange={(e) => updateField('youtube_link', e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
          />
        </label>

        <div className={styles.field}>
          <span>Skills</span>
          <div className={styles.tagInput}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="e.g., #React.js - press Enter"
            />
            <button type="button" className={styles.addTagBtn} onClick={addTag}>Add</button>
          </div>
          <div className={styles.tags}>
            {form.skills.map((tag, i) => (
              <span key={i} className={styles.tag}>
                {tag}
                <button type="button" onClick={() => removeTag(i)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <span>Thumbnail Image</span>
          <ImageUploader
            folder="projects"
            value={form.image_src}
            onChange={(url) => updateField('image_src', url)}
          />
        </div>

        <div className={styles.field}>
          <span>Screenshots</span>
          <ImageUploader
            folder="projects/screenshots"
            value={form.screenshots}
            onChange={(urls) => updateField('screenshots', urls)}
            multiple
          />
        </div>

        {message && (
          <p className={message.type === 'error' ? styles.error : styles.success}>
            {message.text}
          </p>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default ProjectForm
