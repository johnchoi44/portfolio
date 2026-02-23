import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import OrbitPreview from './OrbitPreview'
import styles from './SolarSystemEditor.module.css'

const DEFAULT_SETTINGS = {
  orbit1: { speed: 20, yPosition: 20, radius: 239, imageSize: 80, reverse: false, tilt: 9 },
  orbit2: { speed: 45, yPosition: 50, radius: 240, imageSize: 90, reverse: false, tilt: 9 },
  orbit3: { speed: 55, yPosition: 80, radius: 300, imageSize: 80, reverse: false, tilt: 9 },
  global: { perspective: 1000, corona: true }
}

const ORBIT_SLIDERS = [
  { key: 'speed', label: 'Speed', min: 10, max: 120, unit: 's' },
  { key: 'yPosition', label: 'Y Position', min: -50, max: 150, unit: '%' },
  { key: 'radius', label: 'Radius', min: 100, max: 500, unit: 'px' },
  { key: 'imageSize', label: 'Image Size', min: 40, max: 150, unit: 'px' },
  { key: 'tilt', label: 'Tilt', min: 0, max: 45, unit: 'deg' },
]

const SolarSystemEditor = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('hero_settings')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      setMessage({ type: 'error', text: 'Failed to load hero settings' })
    } else {
      setSettings(data.settings)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    const { data: existing } = await supabase.from('hero_settings').select('id').limit(1).single()

    const { error } = await supabase
      .from('hero_settings')
      .update({ settings, updated_at: new Date().toISOString() })
      .eq('id', existing.id)

    if (error) {
      setMessage({ type: 'error', text: 'Failed to save: ' + error.message })
    } else {
      setMessage({ type: 'success', text: 'Saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    }
    setSaving(false)
  }

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  const updateOrbitSetting = (orbit, key, value) => {
    setSettings(prev => ({
      ...prev,
      [orbit]: { ...prev[orbit], [key]: value }
    }))
  }

  const updateGlobalSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      global: { ...prev.global, [key]: value }
    }))
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Solar System Settings</h2>
      <p className={styles.description}>
        Configure the orbital keyword rings in the Hero section.
      </p>

      <div className={styles.editorLayout}>
        <div className={styles.controlsPanel}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Global</h3>
            <div className={styles.field}>
              <label>Perspective</label>
              <div className={styles.sliderRow}>
                <input type="range" min="200" max="2000" step="100"
                  value={settings.global.perspective}
                  onChange={(e) => updateGlobalSetting('perspective', Number(e.target.value))} />
                <span className={styles.value}>{settings.global.perspective}px</span>
              </div>
            </div>
            <div className={styles.field}>
              <label>Corona Glow</label>
              <div className={styles.checkboxRow}>
                <input type="checkbox" checked={settings.global.corona}
                  onChange={(e) => updateGlobalSetting('corona', e.target.checked)} />
                <span>{settings.global.corona ? 'On' : 'Off'}</span>
              </div>
            </div>
          </div>

          {['orbit1', 'orbit2', 'orbit3'].map((orbit, idx) => (
            <div key={orbit} className={styles.section}>
              <h3 className={styles.sectionTitle}>Orbit {idx + 1}</h3>
              {ORBIT_SLIDERS.map(({ key, label, min, max, unit }) => (
                <div key={key} className={styles.field}>
                  <label>{label}</label>
                  <div className={styles.sliderRow}>
                    <input type="range" min={min} max={max}
                      value={settings[orbit][key]}
                      onChange={(e) => updateOrbitSetting(orbit, key, Number(e.target.value))} />
                    <span className={styles.value}>{settings[orbit][key]}{unit}</span>
                  </div>
                </div>
              ))}
              <div className={styles.field}>
                <label>Reverse</label>
                <div className={styles.checkboxRow}>
                  <input type="checkbox" checked={settings[orbit].reverse}
                    onChange={(e) => updateOrbitSetting(orbit, 'reverse', e.target.checked)} />
                  <span>{settings[orbit].reverse ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          ))}

          <div className={styles.actions}>
            <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button className={styles.resetBtn} onClick={handleReset}>
              Reset to Defaults
            </button>
            {message && (
              <span className={message.type === 'error' ? styles.error : styles.success}>
                {message.text}
              </span>
            )}
          </div>
        </div>

        <div className={styles.previewPanel}>
          <h3 className={styles.sectionTitle}>Live Preview</h3>
          <div className={styles.previewWrapper}>
            <OrbitPreview settings={settings} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolarSystemEditor
