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
  const [resumeDemoRequest, setResumeDemoRequest] = useState(0)

  const showResumeDemo = () => {
    setSelectedProject(null)
    setResumeDemoRequest((request) => request + 1)
  }

  return (
    <div className={styles.App}>
      <Hero onToggleAbout={() => setAboutVisible((visible) => !visible)} aboutVisible={aboutVisible} onOpenProject={setSelectedProject} resumeDemoRequest={resumeDemoRequest} />
      <div className={styles.refined}>
        {aboutVisible && <About />}
        <Experience />
        <Projects setSelectedProject={setSelectedProject} />
        {selectedProject && (
          <PopUp key={selectedProject.title} project={selectedProject} onClose={() => setSelectedProject(null)}
            onViewDemo={selectedProject.title === 'Resume Generator' ? showResumeDemo : undefined} />
        )}
      </div>
    </div>
  )
}

export default App
