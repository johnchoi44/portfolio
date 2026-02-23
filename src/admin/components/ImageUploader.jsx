import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import styles from './ImageUploader.module.css'

const BUCKET = 'portfolio-assets'

const ImageUploader = ({ folder, value, onChange, multiple = false }) => {
  const [uploading, setUploading] = useState(false)

  const getPublicUrl = (path) => {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploading(true)
    const urls = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
      const path = `${folder}/${filename}`

      const { error } = await supabase.storage.from(BUCKET).upload(path, file)
      if (!error) {
        urls.push(getPublicUrl(path))
      }
    }

    if (multiple) {
      onChange([...(value || []), ...urls])
    } else {
      onChange(urls[0] || value)
    }

    setUploading(false)
    e.target.value = ''
  }

  const handleRemove = async (url, index) => {
    // Extract the path from the URL
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/object\/public\/portfolio-assets\/(.+)/)
    if (pathMatch) {
      await supabase.storage.from(BUCKET).remove([pathMatch[1]])
    }

    if (multiple) {
      const updated = [...value]
      updated.splice(index, 1)
      onChange(updated)
    } else {
      onChange('')
    }
  }

  const images = multiple ? (value || []) : (value ? [value] : [])

  return (
    <div className={styles.container}>
      <label className={styles.uploadBtn}>
        {uploading ? 'Uploading...' : multiple ? 'Add Images' : 'Upload Image'}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleUpload}
          hidden
          disabled={uploading}
        />
      </label>

      {images.length > 0 && (
        <div className={styles.previews}>
          {images.map((url, i) => (
            <div key={i} className={styles.preview}>
              <img src={url} alt={`Upload ${i + 1}`} />
              <button
                className={styles.removeBtn}
                onClick={() => handleRemove(url, i)}
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUploader
