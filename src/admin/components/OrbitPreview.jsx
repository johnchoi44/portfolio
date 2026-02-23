import React from 'react'
import heroStyles from '../../components/Hero/Hero.module.css'
import { heroImage } from '../../assets'
import { getKeywords } from '../../utils'

const OrbitPreview = ({ settings }) => {
  const keywordsData = getKeywords()
  const orbit1Keywords = keywordsData.filter(k => k.orbit === 1)
  const orbit2Keywords = keywordsData.filter(k => k.orbit === 2)
  const orbit3Keywords = keywordsData.filter(k => k.orbit === 3)

  const bannerStyle = {
    '--orbit1-speed': `${settings.orbit1.speed}s`,
    '--orbit1-y': `${settings.orbit1.yPosition}%`,
    '--orbit1-radius': `${settings.orbit1.radius}px`,
    '--orbit1-size': `${settings.orbit1.imageSize}px`,
    '--orbit1-direction': settings.orbit1.reverse ? 'reverse' : 'normal',
    '--orbit1-tilt': `${settings.orbit1.tilt}deg`,
    '--orbit2-speed': `${settings.orbit2.speed}s`,
    '--orbit2-y': `${settings.orbit2.yPosition}%`,
    '--orbit2-radius': `${settings.orbit2.radius}px`,
    '--orbit2-size': `${settings.orbit2.imageSize}px`,
    '--orbit2-direction': settings.orbit2.reverse ? 'reverse' : 'normal',
    '--orbit2-tilt': `${settings.orbit2.tilt}deg`,
    '--orbit3-speed': `${settings.orbit3.speed}s`,
    '--orbit3-y': `${settings.orbit3.yPosition}%`,
    '--orbit3-radius': `${settings.orbit3.radius}px`,
    '--orbit3-size': `${settings.orbit3.imageSize}px`,
    '--orbit3-direction': settings.orbit3.reverse ? 'reverse' : 'normal',
    '--orbit3-tilt': `${settings.orbit3.tilt}deg`,
    '--perspective': `${settings.global.perspective}px`
  }

  const renderOrbitItems = (keywords, orbitClass) => (
    <div
      className={`${heroStyles.slider} ${heroStyles[orbitClass]}`}
      style={{ '--quantity': keywords.length }}
    >
      {keywords.map((keyword, index) => (
        <div
          key={keyword.id}
          className={heroStyles.item}
          style={{ '--position': index + 1 }}
        >
          <img src={keyword.imageSrc} alt={keyword.id} />
        </div>
      ))}
    </div>
  )

  return (
    <div style={{
      background: '#0a192f',
      borderRadius: '12px',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ transform: 'scale(0.7)', transformOrigin: 'center center' }}>
        <div className={heroStyles.banner} style={bannerStyle}>
          <div
            className={heroStyles.heroImgWrapper}
            style={settings.global.corona ? {} : { boxShadow: 'none' }}
          >
            <img
              src={heroImage}
              alt="Hero preview"
              className={heroStyles.heroImg}
            />
          </div>
          {orbit1Keywords.length > 0 && renderOrbitItems(orbit1Keywords, 'orbit1')}
          {orbit2Keywords.length > 0 && renderOrbitItems(orbit2Keywords, 'orbit2')}
          {orbit3Keywords.length > 0 && renderOrbitItems(orbit3Keywords, 'orbit3')}
        </div>
      </div>
    </div>
  )
}

export default OrbitPreview
