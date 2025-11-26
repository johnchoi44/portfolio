import React, { useState } from 'react';

import styles from "./Hero.module.css";

import { heroImage,
white2,
white4,
white5,
white6,
white7,
white8,
resume,
email,
github,
linkedin } from '../../assets'

import { generateAndDownloadResume } from '../../utils/resumeAPI';
import { getProjects } from '../../utils';
import PopUp from '../Projects/PopUp';

const Hero = ({ onToggleAbout }) => {
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showProjectPopup, setShowProjectPopup] = useState(false);

  const projects = getProjects();
  const resumeGeneratorProject = projects.find(p => p.title === 'Resume Generator');

  const handleGenerateResume = async () => {
    if (!keywords.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await generateAndDownloadResume(null, keywords.trim());
      setSuccess(true);
      setKeywords('');
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.slider} style={{"--quantity": 6}}>
          {/* <div className={styles.item} style={{"--position": 1}}><img src={getImageUrl("hero/white1.png")} alt="keyword1" /></div> */}
          <div className={styles.item} style={{"--position": 1}}><img src={white2} alt="keyword2" /></div>
          <div className={styles.item} style={{"--position": 2}}><img src={white7} alt="keyword3" /></div>
          <div className={styles.item} style={{"--position": 3}}><img src={white4} alt="keyword4" /></div>
          <div className={styles.item} style={{"--position": 4}}><img src={white5} alt="keyword5" /></div>
          <div className={styles.item} style={{"--position": 5}}><img src={white6} alt="keyword6" /></div>
          <div className={styles.item} style={{"--position": 6}}><img src={white8} alt="keyword6" /></div>
        </div>
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>John Choi</h1>
        <div className={styles.heroImgWrapper}>
          <img
            src={heroImage}
            alt="Hero image of me"
            className={styles.heroImg}
          />
        </div>
        <div className={styles.socialButtons}>
          <a
            href="mailto:psuybc5222@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.circleButton}
          ><img src={email} alt="email Logo" className={styles.logoImg} />
          </a>
          <a
            href="https://github.com/johnchoi44"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.circleButton}
          ><img src={github} alt="Github Logo" className={styles.logoImg} />
          </a>
          <a
            href="https://linkedin.com/in/choi-yongjun"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.circleButton}
          ><img src={linkedin} alt="Linkedin Logo" className={styles.logoImg} />
          </a>
        </div>
        <div className={styles.resumeSection}>
          <div className={styles.labelRow}>
            <p className={styles.keywordLabel}>Generate a tailored resume with keywords:</p>
            <div className={styles.infoIcon}>
              ⓘ
              <div className={styles.tooltip}>
                <p>Want to learn more about me? Enter keywords relevant to your needs, and I'll generate a professionally formatted resume tailored to highlight my matching skills and experience.</p>
                <button onClick={() => setShowProjectPopup(true)}>
                  Learn more →
                </button>
              </div>
            </div>
          </div>
          <div className={styles.keywordInputGroup}>
            <input
              type="text"
              className={styles.keywordInput}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateResume()}
              placeholder="e.g., Golf, Guitar, Basketball"
              disabled={loading}
            />
            <button
              className={styles.generateBtn}
              onClick={handleGenerateResume}
              disabled={loading || !keywords.trim()}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          {error && <p className={styles.errorMsg}>{error}</p>}
          {success && <p className={styles.successMsg}>✓ Resume downloaded!</p>}
        </div>

        <div className={styles.navButtons}>
          <a href={resume} target="_blank" className={styles.navButton}>Résumé</a>
          <a href="#about" onClick={onToggleAbout} className={styles.navButton}>About Me</a>
          <a href="#experience" className={styles.navButton}>Experience</a>
          <a href="#projects" className={styles.navButton}>Project</a>
        </div>
      </div>

      {showProjectPopup && resumeGeneratorProject && (
        <PopUp project={resumeGeneratorProject} onClose={() => setShowProjectPopup(false)} />
      )}
    </section>
  );
};

export default Hero;
