import { useState } from 'react'

import styles from './App.module.css'
import Hero from './components/Hero/Hero.jsx'
import About from './components/About/About.jsx'
import Experience from './components/Experience/Experience.jsx'
import Projects from './components/Projects/Projects.jsx'
import PopUp from './components/Projects/PopUp.jsx'

function App() {
  const [aboutVisible, setAboutVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <div className={styles.App}>
      <Hero onToggleAbout={() => setAboutVisible((visible) => !visible)} onOpenProject={setSelectedProject} />
      {aboutVisible && <About />}
      <div className={styles.refined}>
        <Experience />
        <Projects setSelectedProject={setSelectedProject} />
        {selectedProject && (
          <PopUp key={selectedProject.title} project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </div>
    </div>
  )
}

export default App
