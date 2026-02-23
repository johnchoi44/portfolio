import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../admin/lib/supabaseClient'
import AdminBlogCard from './AdminBlogCard'
import styles from './AdminBlogList.module.css'

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      setMessage({ type: 'error', text: 'Failed to load: ' + error.message })
    } else {
      setBlogs(data)
    }
    setLoading(false)
  }

  const handleAddNew = async () => {
    const slug = `untitled-${Date.now()}`
    const { data, error } = await supabase
      .from('blogs')
      .insert({
        title: '',
        slug,
        date: '',
        excerpt: '',
        content: '',
        image_src: '',
        published: false,
        sort_order: blogs.length,
      })
      .select()
      .single()

    if (error) {
      setMessage({ type: 'error', text: 'Failed to create: ' + error.message })
      return
    }

    navigate(`/blogs-admin/${data.slug}`)
  }

  const handleReorder = async (index, direction) => {
    const swapIndex = index + direction
    if (swapIndex < 0 || swapIndex >= blogs.length) return

    const updated = [...blogs]
    const tempOrder = updated[index].sort_order
    updated[index].sort_order = updated[swapIndex].sort_order
    updated[swapIndex].sort_order = tempOrder;

    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]]
    setBlogs(updated)

    await Promise.all([
      supabase.from('blogs').update({ sort_order: updated[index].sort_order }).eq('id', updated[index].id),
      supabase.from('blogs').update({ sort_order: updated[swapIndex].sort_order }).eq('id', updated[swapIndex].id),
    ])
  }

  const handleTogglePublish = async (blog) => {
    const newPublished = !blog.published
    const { error } = await supabase
      .from('blogs')
      .update({ published: newPublished })
      .eq('id', blog.id)

    if (error) {
      setMessage({ type: 'error', text: 'Update failed: ' + error.message })
      return
    }

    setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, published: newPublished } : b))
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return

    const { error } = await supabase.from('blogs').delete().eq('id', id)
    if (error) {
      setMessage({ type: 'error', text: 'Delete failed: ' + error.message })
    } else {
      setBlogs(prev => prev.filter(b => b.id !== id))
      setMessage({ type: 'success', text: 'Deleted' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Loading...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>Blog Manager</h1>
          <p className={styles.subtitle}>{blogs.length} post{blogs.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={styles.addBtn} onClick={handleAddNew}>+ Add New Post</button>
      </header>

      {message && (
        <p className={message.type === 'error' ? styles.error : styles.success}>
          {message.text}
        </p>
      )}

      {blogs.length === 0 ? (
        <p className={styles.empty}>No blog posts yet. Create your first one!</p>
      ) : (
        <div className={styles.grid}>
          {blogs.map((blog, index) => (
            <AdminBlogCard
              key={blog.id}
              blog={blog}
              index={index}
              total={blogs.length}
              onReorder={handleReorder}
              onTogglePublish={handleTogglePublish}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminBlogList
