import React, { useRef, useLayoutEffect } from 'react'
import ImageUploader from '../../admin/components/ImageUploader'
import styles from './EditorPanel.module.css'

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const EditorPanel = ({ form, onChange, onClose }) => {
  const contentRef = useRef(null)
  // Selection to restore after a programmatic content update (controlled textarea).
  const pendingSelection = useRef(null)

  useLayoutEffect(() => {
    if (pendingSelection.current && contentRef.current) {
      const { start, end } = pendingSelection.current
      contentRef.current.focus()
      contentRef.current.setSelectionRange(start, end)
      pendingSelection.current = null
    }
  })

  const updateField = (key, value) => {
    const next = { ...form, [key]: value }
    if (key === 'title' && (form.slug === '' || form.slug === slugify(form.title))) {
      next.slug = slugify(value)
    }
    onChange(next)
  }

  // Insert a markdown link at the cursor, using any selected text as the label.
  const insertLink = () => {
    const textarea = contentRef.current
    const value = form.content || ''
    const start = textarea ? textarea.selectionStart : value.length
    const end = textarea ? textarea.selectionEnd : value.length
    const selected = value.slice(start, end)

    const label = selected || 'link text'
    const url = 'https://'
    const snippet = `[${label}](${url})`
    const nextContent = value.slice(0, start) + snippet + value.slice(end)

    // Select the "https://" portion so the user can immediately type the URL.
    const urlStart = start + 1 + label.length + 2
    pendingSelection.current = { start: urlStart, end: urlStart + url.length }

    updateField('content', nextContent)
  }

  const handleContentKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      insertLink()
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Editor</h3>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
      </div>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.label}>Title</span>
          <input
            type="text"
            className={styles.input}
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Post title"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Slug</span>
          <input
            type="text"
            className={styles.input}
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            placeholder="url-friendly-slug"
          />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>Date</span>
            <input
              type="date"
              className={styles.input}
              value={form.date || ''}
              onChange={(e) => updateField('date', e.target.value)}
            />
          </label>

          <label className={styles.toggleField}>
            <span className={styles.label}>Published</span>
            <button
              type="button"
              className={`${styles.toggle} ${form.published ? styles.toggleOn : ''}`}
              onClick={() => updateField('published', !form.published)}
            >
              <span className={styles.toggleThumb} />
            </button>
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Excerpt</span>
          <textarea
            className={styles.textarea}
            value={form.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            rows={2}
            placeholder="Short summary for the blog card"
          />
        </label>

        <label className={styles.field + ' ' + styles.contentField}>
          <div className={styles.contentLabelRow}>
            <span className={styles.label}>Content (Markdown)</span>
            <div className={styles.toolbar}>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={insertLink}
                title="Insert link (⌘K / Ctrl+K)"
              >
                🔗 Link
              </button>
            </div>
          </div>
          <textarea
            ref={contentRef}
            className={styles.contentEditor}
            value={form.content}
            onChange={(e) => updateField('content', e.target.value)}
            onKeyDown={handleContentKeyDown}
            placeholder="Write your blog post in markdown..."
          />
        </label>

        <div className={styles.field}>
          <span className={styles.label}>Thumbnail Image</span>
          <ImageUploader
            folder="blogs"
            value={form.image_src}
            onChange={(url) => updateField('image_src', url)}
          />
        </div>
      </div>
    </div>
  )
}

export default EditorPanel
