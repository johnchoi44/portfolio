import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import "@fontsource/outfit"
import "@fontsource/roboto"

const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/admin/*" element={
          <Suspense fallback={<div style={{ color: '#fff', padding: '2rem' }}>Loading admin...</div>}>
            <AdminApp />
          </Suspense>
        } />
        <Route path="/*" element={<App />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
