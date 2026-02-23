import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '../../admin/lib/supabaseClient'
import EditorPanel from './EditorPanel'
import styles from './AdminBlogEditor.module.css'

const AdminBlogEditor = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // null | 'saved' | 'error'
  const [panelOpen, setPanelOpen] = useState(true)
  const [dirty, setDirty] = useState(false)
  const originalFormRef = useRef(null)

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        navigate('/blogs-admin', { replace: true })
        return
      }

      setBlog(data)
      const formData = {
        title: data.title || '',
        slug: data.slug || '',
        date: data.date || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        image_src: data.image_src || '',
        published: data.published ?? false,
      }
      setForm(formData)
      originalFormRef.current = formData
      setLoading(false)
    }
    fetchBlog()
  }, [slug, navigate])

  const handleFormChange = useCallback((newForm) => {
    setForm(newForm)
    setDirty(true)
    setSaveStatus(null)
  }, [])

  const handleSave = useCallback(async () => {
    if (!form || !blog) return
    setSaving(true)

    const payload = { ...form }
    const { error } = await supabase
      .from('blogs')
      .update(payload)
      .eq('id', blog.id)

    if (error) {
      setSaveStatus('error')
      setSaving(false)
      return
    }

    // If slug changed, navigate to new URL
    if (form.slug !== slug) {
      setBlog(prev => ({ ...prev, ...payload }))
      originalFormRef.current = { ...form }
      setDirty(false)
      setSaving(false)
      setSaveStatus('saved')
      navigate(`/blogs-admin/${form.slug}`, { replace: true })
      return
    }

    setBlog(prev => ({ ...prev, ...payload }))
    originalFormRef.current = { ...form }
    setDirty(false)
    setSaving(false)
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus(null), 3000)
  }, [form, blog, slug, navigate])

  const handlePublish = useCallback(async () => {
    if (!form || !blog) return
    const newPublished = !form.published
    const updatedForm = { ...form, published: newPublished }
    setForm(updatedForm)

    const { error } = await supabase
      .from('blogs')
      .update({ published: newPublished })
      .eq('id', blog.id)

    if (!error) {
      setBlog(prev => ({ ...prev, published: newPublished }))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }, [form, blog])

  const handleDelete = useCallback(async () => {
    if (!blog || !confirm('Delete this blog post?')) return

    const { error } = await supabase.from('blogs').delete().eq('id', blog.id)
    if (!error) {
      navigate('/blogs-admin', { replace: true })
    }
  }, [blog, navigate])

  // Keyboard shortcut: Cmd/Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  // Warn before navigating away with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (dirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [dirty])

  if (loading || !form) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Loading...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <Link to="/blogs-admin" className={styles.backLink}>&larr; All Posts</Link>

        <div className={styles.toolbarCenter}>
          {saveStatus === 'saved' && <span className={styles.statusSaved}>Saved</span>}
          {saveStatus === 'error' && <span className={styles.statusError}>Save failed</span>}
          {dirty && !saveStatus && <span className={styles.statusDirty}>Unsaved changes</span>}
        </div>

        <div className={styles.toolbarActions}>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            className={`${styles.publishBtn} ${form.published ? styles.publishBtnActive : ''}`}
            onClick={handlePublish}
          >
            {form.published ? 'Unpublish' : 'Publish'}
          </button>
          <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {/* Main content area */}
      <div className={styles.main}>
        {/* Live preview */}
        <div className={`${styles.preview} ${panelOpen ? styles.previewWithPanel : ''}`}>
          <article className={styles.article}>
            <header className={styles.articleHeader}>
              <span className={styles.date}>{form.date || 'No date'}</span>
              <h1 className={styles.title}>{form.title || 'Untitled'}</h1>
            </header>
            {form.image_src && (
              <img src={form.image_src} alt={form.title} className={styles.heroImage} />
            )}
            <div className={styles.content}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {form.content || '*Start writing...*'}
              </ReactMarkdown>
            </div>
          </article>
        </div>

        {/* Editor panel */}
        {panelOpen && (
          <div className={styles.editorPane}>
            <EditorPanel
              form={form}
              onChange={handleFormChange}
              onClose={() => setPanelOpen(false)}
            />
          </div>
        )}
      </div>

      {/* FAB to toggle editor */}
      {!panelOpen && (
        <button
          className={styles.fab}
          onClick={() => setPanelOpen(true)}
          title="Open editor"
        >
          Edit
        </button>
      )}
    </div>
  )
}

export default AdminBlogEditor
