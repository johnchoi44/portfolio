import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiUser, FiFileText, FiBriefcase, FiFolder, FiEdit, FiDownload, FiLogOut } from 'react-icons/fi'
import { logout } from './AuthGate'
import styles from './Sidebar.module.css'

const links = [
  { to: '/admin/about', label: 'About', icon: FiUser },
  { to: '/admin/resume', label: 'Resume', icon: FiFileText },
  { to: '/admin/experience', label: 'Experience', icon: FiBriefcase },
  { to: '/admin/projects', label: 'Projects', icon: FiFolder },
  { to: '/blogs-admin', label: 'Blogs', icon: FiEdit },
  { to: '/admin/export', label: 'Export', icon: FiDownload },
]

const Sidebar = () => {
  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Admin Panel</h2>
      <nav className={styles.nav}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button className={styles.logout} onClick={handleLogout}>
        <FiLogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  )
}

export default Sidebar
