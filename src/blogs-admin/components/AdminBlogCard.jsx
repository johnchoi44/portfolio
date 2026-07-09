import React from 'react'
import { Link } from 'react-router-dom'
import { formatBlogDate } from '../../utils/formatDate'
import styles from './AdminBlogCard.module.css'

const AdminBlogCard = ({ blog, index, total, onReorder, onTogglePublish, onDelete }) => {
  return (
    <div className={styles.card}>
      <div className={styles.reorderButtons}>
        <button
          className={styles.arrowBtn}
          onClick={() => onReorder(index, -1)}
          disabled={index === 0}
          title="Move up"
        >
          &uarr;
        </button>
        <button
          className={styles.arrowBtn}
          onClick={() => onReorder(index, 1)}
          disabled={index === total - 1}
          title="Move down"
        >
          &darr;
        </button>
      </div>

      <Link to={`/blogs-admin/${blog.slug}`} className={styles.cardLink}>
        {blog.image_src && (
          <div className={styles.imageWrapper}>
            <img src={blog.image_src} alt={blog.title} className={styles.image} />
          </div>
        )}
        <div className={styles.body}>
          <div className={styles.meta}>
            <span className={styles.date}>{formatBlogDate(blog.date)}</span>
            <span className={blog.published ? styles.badgePublished : styles.badgeDraft}>
              {blog.published ? 'Published' : 'Draft'}
            </span>
            <span className={styles.views} title="Views">👁 {blog.view_count ?? 0}</span>
          </div>
          <h3 className={styles.title}>{blog.title || 'Untitled'}</h3>
          {blog.excerpt && <p className={styles.excerpt}>{blog.excerpt}</p>}
        </div>
      </Link>

      <div className={styles.actionBar}>
        <Link to={`/blogs-admin/${blog.slug}`} className={styles.editBtn}>Edit</Link>
        <button
          className={styles.publishBtn}
          onClick={() => onTogglePublish(blog)}
        >
          {blog.published ? 'Unpublish' : 'Publish'}
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(blog.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default AdminBlogCard
