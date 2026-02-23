import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthGate from './components/AuthGate'
import Sidebar from './components/Sidebar'
import AboutEditor from './components/AboutEditor'
import ResumeManager from './components/ResumeManager'
import ExperienceManager from './components/ExperienceManager'
import ProjectManager from './components/ProjectManager'
import BlogManager from './components/BlogManager'
import ExportPanel from './components/ExportPanel'
import styles from './AdminApp.module.css'

const AdminApp = () => {
  return (
    <AuthGate>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.content}>
          <Routes>
            <Route path="about" element={<AboutEditor />} />
            <Route path="resume" element={<ResumeManager />} />
            <Route path="experience" element={<ExperienceManager />} />
            <Route path="projects" element={<ProjectManager />} />
            <Route path="blogs" element={<BlogManager />} />
            <Route path="export" element={<ExportPanel />} />
            <Route path="*" element={<Navigate to="about" replace />} />
          </Routes>
        </main>
      </div>
    </AuthGate>
  )
}

export default AdminApp
