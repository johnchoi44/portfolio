import React, { useState } from 'react';

import styles from "./Hero.module.css";
// import { getImageUrl } from '../../utils';

import { heroImage,
white1,
white2,
white3,
white4,
white5,
white6,
white7,
white8,
resume,
email,
github,
linkedin } from '../../assets'

import ResumeGenerator from '../ResumeGenerator/ResumeGenerator';

const Hero = ({ onToggleAbout }) => {
  const [showResumeModal, setShowResumeModal] = useState(false);
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
        <div className={styles.navButtons}>
          <a href={resume} target="_blank" className={styles.navButton}>Résumé</a>
          <button onClick={() => setShowResumeModal(true)} className={styles.navButton}>Generate Resume</button>
          <a href="#about" onClick={onToggleAbout} className={styles.navButton}>About Me</a>
          <a href="#experience" className={styles.navButton}>Experience</a>
          <a href="#projects" className={styles.navButton}>Project</a>
        </div>
      </div>

      {showResumeModal && (
        <ResumeGenerator onClose={() => setShowResumeModal(false)} />
      )}
    </section>
  );
};

export default Hero;
