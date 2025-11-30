import { useState } from 'react'

import styles from './App.module.css'
import Navbar from './components/NavBar/Navbar.jsx'
import Hero from './components/Hero/Hero.jsx'
import About from './components/About/About.jsx'
import Experience from './components/Experience/Experience.jsx'
import Projects from './components/Projects/Projects.jsx'
import Contact from './components/Contact/Contact.jsx'
import PopUp from './components/Projects/PopUp.jsx'

function App() {
  const [aboutVisible, setAboutVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const toggleAboutSection = () => {
    setAboutVisible((prev) => !prev)
  }

  return (
    <div className={styles.App}>
      <Hero onToggleAbout={toggleAboutSection} onOpenProject={setSelectedProject} />
      {aboutVisible && <About />}
      <Experience />
      <Projects selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
      {selectedProject && (
        <PopUp project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  )
}

export default App
