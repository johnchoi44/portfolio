import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '../lib/supabaseClient'
import ImageUploader from './ImageUploader'
import styles from './BlogForm.module.css'

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const BlogForm = ({ item, nextSortOrder, onSaved, onCancel }) => {
  const [form, setForm] = useState({
    title: item?.title || '',
    slug: item?.slug || '',
    date: item?.date || '',
    excerpt: item?.excerpt || '',
    content: item?.content || '',
    image_src: item?.image_src || '',
    published: item?.published ?? false,
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const updateField = (key, value) => {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      // Auto-generate slug from title if slug hasn't been manually edited
      if (key === 'title' && (prev.slug === '' || prev.slug === slugify(prev.title))) {
        next.slug = slugify(value)
      }
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const payload = { ...form }

    if (item) {
      const { error } = await supabase
        .from('blogs')
        .update(payload)
        .eq('id', item.id)

      if (error) {
        setMessage({ type: 'error', text: 'Save failed: ' + error.message })
        setSaving(false)
        return
      }
    } else {
      payload.sort_order = nextSortOrder
      const { error } = await supabase.from('blogs').insert(payload)
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
      <h2 className={styles.heading}>{item ? 'Edit Blog Post' : 'Add Blog Post'}</h2>
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
          <span>Slug</span>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            required
          />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>Date</span>
            <input
              type="text"
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
              placeholder="e.g., Feb 2026"
              required
            />
          </label>
          <label className={`${styles.field} ${styles.checkboxField}`}>
            <span>Published</span>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => updateField('published', e.target.checked)}
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>Excerpt</span>
          <textarea
            value={form.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            rows={2}
            placeholder="Short summary for the blog card"
          />
        </label>

        <div className={styles.field}>
          <div className={styles.contentHeader}>
            <span>Content (Markdown)</span>
            <button
              type="button"
              className={styles.previewToggle}
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
          <div className={styles.editorWrapper}>
            {showPreview ? (
              <div className={styles.preview}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {form.content || '*Nothing to preview*'}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={form.content}
                onChange={(e) => updateField('content', e.target.value)}
                rows={16}
                placeholder="Write your blog post in markdown..."
                className={styles.contentEditor}
              />
            )}
          </div>
        </div>

        <div className={styles.field}>
          <span>Thumbnail Image</span>
          <ImageUploader
            folder="blogs"
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

export default BlogForm
