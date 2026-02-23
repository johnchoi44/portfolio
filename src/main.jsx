import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import "@fontsource/outfit"
import "@fontsource/roboto"

const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))
const BlogsAdminApp = lazy(() => import('./blogs-admin/BlogsAdminApp.jsx'))
const BlogList = lazy(() => import('./components/Blogs/BlogList.jsx'))
const BlogPost = lazy(() => import('./components/Blogs/BlogPost.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/admin/*" element={
          <Suspense fallback={<div style={{ color: '#fff', padding: '2rem' }}>Loading admin...</div>}>
            <AdminApp />
          </Suspense>
        } />
        <Route path="/blogs-admin/*" element={
          <Suspense fallback={<div style={{ color: '#fff', padding: '2rem' }}>Loading...</div>}>
            <BlogsAdminApp />
          </Suspense>
        } />
        <Route path="/blogs" element={
          <Suspense fallback={<div style={{ color: '#fff', padding: '2rem' }}>Loading...</div>}>
            <BlogList />
          </Suspense>
        } />
        <Route path="/blogs/:slug" element={
          <Suspense fallback={<div style={{ color: '#fff', padding: '2rem' }}>Loading...</div>}>
            <BlogPost />
          </Suspense>
        } />
        <Route path="/*" element={<App />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
