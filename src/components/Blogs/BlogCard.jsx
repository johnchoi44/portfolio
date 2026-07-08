import React from 'react'
import { Link } from 'react-router-dom'
import { formatBlogDate } from '../../utils/formatDate'
import styles from './BlogCard.module.css'

const BlogCard = ({ blog }) => {
  return (
    <Link to={`/blogs/${blog.slug}`} className={styles.card}>
      {blog.imageSrc && (
        <div className={styles.imageWrapper}>
          <img src={blog.imageSrc} alt={blog.title} className={styles.image} />
        </div>
      )}
      <div className={styles.body}>
        <span className={styles.date}>{formatBlogDate(blog.date)}</span>
        <h3 className={styles.title}>{blog.title}</h3>
        <p className={styles.excerpt}>{blog.excerpt}</p>
      </div>
    </Link>
  )
}

export default BlogCard
