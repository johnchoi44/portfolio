import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBlogs } from '../../utils'
import BlogCard from './BlogCard'
import styles from './BlogList.module.css'

const BlogList = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    getBlogs().then(setBlogs)
  }, [])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.backLink}>&larr; Back to Home</Link>
        <h1 className={styles.heading}>Blog</h1>
        <p className={styles.subtitle}>Thoughts on AI engineering, projects, and the journey.</p>
      </header>

      {blogs.length === 0 ? (
        <p className={styles.empty}>No blog posts yet. Stay tuned!</p>
      ) : (
        <div className={styles.grid}>
          {blogs.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogList
