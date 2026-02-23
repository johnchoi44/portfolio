import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ImageUploader from './ImageUploader'
import styles from './ExperienceForm.module.css'

const ExperienceForm = ({ item, nextSortOrder, onSaved, onCancel }) => {
  const [form, setForm] = useState({
    role: item?.role || '',
    organisation: item?.organisation || '',
    start_date: item?.start_date || '',
    end_date: item?.end_date || '',
    experiences: item?.experiences || [],
    image_src: item?.image_src || '',
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.experiences.includes(tag)) {
      updateField('experiences', [...form.experiences, tag])
    }
    setTagInput('')
  }

  const removeTag = (index) => {
    updateField('experiences', form.experiences.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const payload = { ...form }

    if (item) {
      const { error } = await supabase
        .from('experience')
        .update(payload)
        .eq('id', item.id)

      if (error) {
        setMessage({ type: 'error', text: 'Save failed: ' + error.message })
        setSaving(false)
        return
      }
    } else {
      payload.sort_order = nextSortOrder
      const { error } = await supabase.from('experience').insert(payload)
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
      <h2 className={styles.heading}>{item ? 'Edit Experience' : 'Add Experience'}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          <span>Role</span>
          <input
            type="text"
            value={form.role}
            onChange={(e) => updateField('role', e.target.value)}
            required
          />
        </label>
        <label className={styles.field}>
          <span>Organisation</span>
          <input
            type="text"
            value={form.organisation}
            onChange={(e) => updateField('organisation', e.target.value)}
            required
          />
        </label>
        <div className={styles.row}>
          <label className={styles.field}>
            <span>Start Date</span>
            <input
              type="text"
              value={form.start_date}
              onChange={(e) => updateField('start_date', e.target.value)}
              placeholder="e.g., Jan 2024"
              required
            />
          </label>
          <label className={styles.field}>
            <span>End Date</span>
            <input
              type="text"
              value={form.end_date}
              onChange={(e) => updateField('end_date', e.target.value)}
              placeholder="e.g., Present"
              required
            />
          </label>
        </div>

        <div className={styles.field}>
          <span>Skills / Experiences</span>
          <div className={styles.tagInput}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="Type and press Enter"
            />
            <button type="button" className={styles.addTagBtn} onClick={addTag}>Add</button>
          </div>
          <div className={styles.tags}>
            {form.experiences.map((tag, i) => (
              <span key={i} className={styles.tag}>
                {tag}
                <button type="button" onClick={() => removeTag(i)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <span>Image</span>
          <ImageUploader
            folder="experience"
            value={form.image_src}
            onChange={(url) => updateField('image_src', url)}
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

export default ExperienceForm
