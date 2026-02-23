import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthGate from '../admin/components/AuthGate'
import AdminBlogList from './components/AdminBlogList'
import AdminBlogEditor from './components/AdminBlogEditor'
import styles from './BlogsAdminApp.module.css'

const BlogsAdminApp = () => {
  return (
    <AuthGate>
      <div className={styles.shell}>
        <Routes>
          <Route index element={<AdminBlogList />} />
          <Route path=":slug" element={<AdminBlogEditor />} />
        </Routes>
      </div>
    </AuthGate>
  )
}

export default BlogsAdminApp
