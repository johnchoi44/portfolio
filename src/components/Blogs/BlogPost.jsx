import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getBlogs, formatBlogDate } from '../../utils'
import styles from './BlogPost.module.css'

const BlogPost = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlogs().then((blogs) => {
      setBlog(blogs.find((b) => b.slug === slug))
      setLoading(false)
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
