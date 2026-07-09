import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getBlogs, formatBlogDate } from '../../utils'
import { supabase } from '../../admin/lib/supabaseClient'
import styles from './BlogPost.module.css'

const recordView = (slug) => {
  const key = `blog_viewed_${slug}`
  if (sessionStorage.getItem(key)) return
  sessionStorage.setItem(key, 'true')
  supabase
    .rpc('increment_blog_view', { blog_slug: slug })
    .then(({ error }) => {
      // Fire-and-forget: a failed count must never affect rendering.
      if (error) sessionStorage.removeItem(key)
    })
}

const BlogPost = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlogs().then((blogs) => {
      const found = blogs.find((b) => b.slug === slug)
      setBlog(found)
      setLoading(false)
      if (found) recordView(slug)
    })
  }, [slug])

  if (loading) return null

  if (!blog) {
    return (
      <div className={styles.container}>
        <Link to="/blogs" className={styles.backLink}>&larr; Back to Blog</Link>
        <h1 className={styles.title}>Post not found</h1>
        <p className={styles.notFound}>The blog post you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Link to="/blogs" className={styles.backLink}>&larr; Back to Blog</Link>
      <article className={styles.article}>
        <header className={styles.header}>
          <span className={styles.date}>{formatBlogDate(blog.date)}</span>
          <h1 className={styles.title}>{blog.title}</h1>
        </header>
        {blog.imageSrc && (
          <img src={blog.imageSrc} alt={blog.title} className={styles.heroImage} />
        )}
        <div className={styles.content}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}

export default BlogPost
