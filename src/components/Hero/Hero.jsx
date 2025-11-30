import React, { useState, useEffect, useRef } from 'react';

import styles from "./Hero.module.css";

import { heroImage,
resume,
email,
github,
linkedin } from '../../assets'

import { generateAndDownloadResume } from '../../utils/resumeAPI';
import { getProjects, getKeywords } from '../../utils';

const Hero = ({ onToggleAbout, onOpenProject }) => {
  const [keywordInput, setKeywordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Orbit state
  const [activeKeyword, setActiveKeyword] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  // Dev settings state
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const settingsRef = useRef(null);
  const heroImgRef = useRef(null);
  const defaultSettings = {
    orbit1: { speed: 20, yPosition: 20, radius: 239, imageSize: 80, reverse: false, tilt: 9 },
    orbit2: { speed: 45, yPosition: 50, radius: 240, imageSize: 90, reverse: false, tilt: 9 },
    orbit3: { speed: 55, yPosition: 80, radius: 300, imageSize: 80, reverse: false, tilt: 9 },
    global: { perspective: 1000, corona: true }
  };
  const [orbitSettings, setOrbitSettings] = useState(defaultSettings);

  const projects = getProjects();
  const resumeGeneratorProject = projects.find(p => p.title === 'Resume Generator');

  // Load keywords data and group by orbit
  const keywordsData = getKeywords();
  const orbit1Keywords = keywordsData.filter(k => k.orbit === 1);
  const orbit2Keywords = keywordsData.filter(k => k.orbit === 2);
  const orbit3Keywords = keywordsData.filter(k => k.orbit === 3);

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setActiveKeyword(null);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setActiveKeyword(null);
      }
    };

    if (activeKeyword) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeKeyword]);

  // Handle click outside to close settings panel
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target) &&
        heroImgRef.current &&
        !heroImgRef.current.contains(e.target)
      ) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  const handleKeywordClick = (keyword, e) => {
    e.stopPropagation();
    if (activeKeyword?.id === keyword.id) {
      setActiveKeyword(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const tooltipWidth = 280; // max-width from CSS
      const tooltipHeight = 100; // approximate height
      const padding = 16; // minimum distance from edges

      // Calculate x position, clamped to viewport
      let x = rect.left + rect.width / 2;
      const minX = tooltipWidth / 2 + padding;
      const maxX = window.innerWidth - tooltipWidth / 2 - padding;
      x = Math.max(minX, Math.min(maxX, x));

      // Check if tooltip should flip below (not enough room above)
      const shouldFlipBelow = rect.top < tooltipHeight + padding;
      const y = shouldFlipBelow ? rect.bottom + 10 : rect.top - 10;

      setTooltipPosition({ x, y, flipped: shouldFlipBelow });
      setActiveKeyword(keyword);
    }
  };

  const handleGenerateResume = async () => {
    if (!keywordInput.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await generateAndDownloadResume(null, keywordInput.trim());
      setSuccess(true);
      setKeywordInput('');
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update orbit setting helper
  const updateOrbitSetting = (orbit, key, value) => {
    setOrbitSettings(prev => ({
      ...prev,
      [orbit]: { ...prev[orbit], [key]: value }
    }));
  };

  // Copy settings to clipboard
  const copySettings = () => {
    const settingsText = JSON.stringify(orbitSettings, null, 2);
    navigator.clipboard.writeText(settingsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset to default settings
  const resetSettings = () => {
    setOrbitSettings(defaultSettings);
  };

  // CSS variables for dynamic orbit settings
  const bannerStyle = {
    '--orbit1-speed': `${orbitSettings.orbit1.speed}s`,
    '--orbit1-y': `${orbitSettings.orbit1.yPosition}%`,
    '--orbit1-radius': `${orbitSettings.orbit1.radius}px`,
    '--orbit1-size': `${orbitSettings.orbit1.imageSize}px`,
    '--orbit1-direction': orbitSettings.orbit1.reverse ? 'reverse' : 'normal',
    '--orbit1-tilt': `${orbitSettings.orbit1.tilt}deg`,
    '--orbit2-speed': `${orbitSettings.orbit2.speed}s`,
    '--orbit2-y': `${orbitSettings.orbit2.yPosition}%`,
    '--orbit2-radius': `${orbitSettings.orbit2.radius}px`,
    '--orbit2-size': `${orbitSettings.orbit2.imageSize}px`,
    '--orbit2-direction': orbitSettings.orbit2.reverse ? 'reverse' : 'normal',
    '--orbit2-tilt': `${orbitSettings.orbit2.tilt}deg`,
    '--orbit3-speed': `${orbitSettings.orbit3.speed}s`,
    '--orbit3-y': `${orbitSettings.orbit3.yPosition}%`,
    '--orbit3-radius': `${orbitSettings.orbit3.radius}px`,
    '--orbit3-size': `${orbitSettings.orbit3.imageSize}px`,
    '--orbit3-direction': orbitSettings.orbit3.reverse ? 'reverse' : 'normal',
    '--orbit3-tilt': `${orbitSettings.orbit3.tilt}deg`,
    '--perspective': `${orbitSettings.global.perspective}px`
  };

  // Helper to render orbit items
  const renderOrbitItems = (keywords, orbitClass) => (
    <div
      className={`${styles.slider} ${styles[orbitClass]} ${activeKeyword ? styles.paused : ''}`}
      style={{ "--quantity": keywords.length }}
    >
      {keywords.map((keyword, index) => (
        <div
          key={keyword.id}
          className={`${styles.item} ${activeKeyword?.id === keyword.id ? styles.active : ''}`}
          style={{ "--position": index + 1 }}
          onClick={(e) => handleKeywordClick(keyword, e)}
        >
          <img src={keyword.imageSrc} alt={keyword.id} />
        </div>
      ))}
    </div>
  );
  return (
    <section className={styles.container}>
      <div className={styles.banner} style={bannerStyle}>
        {/* Hero image at center of 3D space */}
        <div
          ref={heroImgRef}
          className={styles.heroImgWrapper}
          style={{
            ...(orbitSettings.global.corona ? {} : { boxShadow: 'none' }),
            ...(import.meta.env.DEV ? { cursor: 'pointer' } : {})
          }}
          onClick={import.meta.env.DEV ? () => setShowSettings(!showSettings) : undefined}
        >
          <img
            src={heroImage}
            alt="Hero image of me"
            className={styles.heroImg}
            style={import.meta.env.DEV ? { cursor: 'pointer' } : {}}
            onClick={import.meta.env.DEV ? () => setShowSettings(!showSettings) : undefined}
          />
        </div>

        {/* Three orbital rings with different speeds */}
        {orbit1Keywords.length > 0 && renderOrbitItems(orbit1Keywords, 'orbit1')}
        {orbit2Keywords.length > 0 && renderOrbitItems(orbit2Keywords, 'orbit2')}
        {orbit3Keywords.length > 0 && renderOrbitItems(orbit3Keywords, 'orbit3')}
      </div>

      {/* Tooltip for clicked keyword */}
      {activeKeyword && (
        <div
          ref={tooltipRef}
          className={`${styles.keywordTooltip} ${tooltipPosition.flipped ? styles.flipped : ''}`}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: tooltipPosition.flipped ? 'translate(-50%, 0)' : 'translate(-50%, -100%)'
          }}
        >
          <p>{activeKeyword.description}</p>
          <a href={activeKeyword.projectLink}>View related project →</a>
        </div>
      )}
      <div className={styles.content}>
        <h1 className={styles.title}>John Choi</h1>
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
                <button onClick={() => onOpenProject(resumeGeneratorProject)}>
                  Learn more →
                </button>
              </div>
            </div>
          </div>
          <div className={styles.keywordInputGroup}>
            <input
              type="text"
              className={styles.keywordInput}
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateResume()}
              placeholder="e.g., Golf, Guitar, Basketball"
              disabled={loading}
            />
            <button
              className={styles.generateBtn}
              onClick={handleGenerateResume}
              disabled={loading || !keywordInput.trim()}
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

      {/* Dev-only Settings Panel */}
      {import.meta.env.DEV && showSettings && (
            <div ref={settingsRef} className={styles.settingsPanel}>
              <h3>Orbit Settings</h3>

              <div className={styles.settingsGroup}>
                <h4>Global</h4>
                <div className={styles.settingRow}>
                  <label>Perspective</label>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="100"
                    value={orbitSettings.global.perspective}
                    onChange={(e) => setOrbitSettings(prev => ({
                      ...prev,
                      global: { ...prev.global, perspective: Number(e.target.value) }
                    }))}
                  />
                  <span>{orbitSettings.global.perspective}px</span>
                </div>
                <div className={styles.settingRow}>
                  <label>Corona</label>
                  <input
                    type="checkbox"
                    checked={orbitSettings.global.corona}
                    onChange={(e) => setOrbitSettings(prev => ({
                      ...prev,
                      global: { ...prev.global, corona: e.target.checked }
                    }))}
                  />
                  <span>{orbitSettings.global.corona ? 'On' : 'Off'}</span>
                </div>
              </div>

              {['orbit1', 'orbit2', 'orbit3'].map((orbit, idx) => (
                <div key={orbit} className={styles.settingsGroup}>
                  <h4>Orbit {idx + 1}</h4>
                  <div className={styles.settingRow}>
                    <label>Size</label>
                    <input
                      type="range"
                      min="40"
                      max="150"
                      value={orbitSettings[orbit].imageSize}
                      onChange={(e) => updateOrbitSetting(orbit, 'imageSize', Number(e.target.value))}
                    />
                    <span>{orbitSettings[orbit].imageSize}px</span>
                  </div>
                  <div className={styles.settingRow}>
                    <label>Speed</label>
                    <input
                      type="range"
                      min="10"
                      max="120"
                      value={orbitSettings[orbit].speed}
                      onChange={(e) => updateOrbitSetting(orbit, 'speed', Number(e.target.value))}
                    />
                    <span>{orbitSettings[orbit].speed}s</span>
                  </div>
                  <div className={styles.settingRow}>
                    <label>Y Position</label>
                    <input
                      type="range"
                      min="-50"
                      max="150"
                      value={orbitSettings[orbit].yPosition}
                      onChange={(e) => updateOrbitSetting(orbit, 'yPosition', Number(e.target.value))}
                    />
                    <span>{orbitSettings[orbit].yPosition}%</span>
                  </div>
                  <div className={styles.settingRow}>
                    <label>Radius</label>
                    <input
                      type="range"
                      min="100"
                      max="500"
                      value={orbitSettings[orbit].radius}
                      onChange={(e) => updateOrbitSetting(orbit, 'radius', Number(e.target.value))}
                    />
                    <span>{orbitSettings[orbit].radius}px</span>
                  </div>
                  <div className={styles.settingRow}>
                    <label>Tilt</label>
                    <input
                      type="range"
                      min="0"
                      max="45"
                      value={orbitSettings[orbit].tilt}
                      onChange={(e) => updateOrbitSetting(orbit, 'tilt', Number(e.target.value))}
                    />
                    <span>{orbitSettings[orbit].tilt}°</span>
                  </div>
                  <div className={styles.settingRow}>
                    <label>Reverse</label>
                    <input
                      type="checkbox"
                      checked={orbitSettings[orbit].reverse}
                      onChange={(e) => updateOrbitSetting(orbit, 'reverse', e.target.checked)}
                    />
                    <span>{orbitSettings[orbit].reverse ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              ))}

              <button
                className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                onClick={copySettings}
              >
                {copied ? '✓ Copied!' : 'Copy Settings'}
              </button>
              <button
                className={styles.resetBtn}
                onClick={resetSettings}
              >
                Reset to Default
              </button>
            </div>
      )}
    </section>
  );
};

export default Hero;
