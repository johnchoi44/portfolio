import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import ExperienceForm from './ExperienceForm'
import styles from './ExperienceManager.module.css'

const ExperienceManager = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = list, 'new' = add, id = edit
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      setMessage({ type: 'error', text: 'Failed to load: ' + error.message })
    } else {
      setItems(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience entry?')) return

    const { error } = await supabase.from('experience').delete().eq('id', id)
    if (error) {
      setMessage({ type: 'error', text: 'Delete failed: ' + error.message })
    } else {
      setItems(items.filter(item => item.id !== id))
      setMessage({ type: 'success', text: 'Deleted' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleReorder = async (index, direction) => {
    const swapIndex = index + direction
    if (swapIndex < 0 || swapIndex >= items.length) return

    const updated = [...items]
    const tempOrder = updated[index].sort_order
    updated[index].sort_order = updated[swapIndex].sort_order
    updated[swapIndex].sort_order = tempOrder;

    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]]

    setItems(updated)

    await Promise.all([
      supabase.from('experience').update({ sort_order: updated[index].sort_order }).eq('id', updated[index].id),
      supabase.from('experience').update({ sort_order: updated[swapIndex].sort_order }).eq('id', updated[swapIndex].id),
    ])
  }

  const handleSaved = () => {
    setEditing(null)
    fetchItems()
  }

  if (editing !== null) {
    const item = editing === 'new' ? null : items.find(i => i.id === editing)
    return (
      <ExperienceForm
        item={item}
        nextSortOrder={items.length}
        onSaved={handleSaved}
        onCancel={() => setEditing(null)}
      />
    )
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Experience</h2>
        <button className={styles.addBtn} onClick={() => setEditing('new')}>+ Add New</button>
      </div>

      {message && (
        <p className={message.type === 'error' ? styles.error : styles.success}>
          {message.text}
        </p>
      )}

      <div className={styles.list}>
        {items.map((item, index) => (
          <div key={item.id} className={styles.row}>
            <div className={styles.arrows}>
              <button onClick={() => handleReorder(index, -1)} disabled={index === 0}>↑</button>
              <button onClick={() => handleReorder(index, 1)} disabled={index === items.length - 1}>↓</button>
            </div>
            <div className={styles.info}>
              <strong>{item.role}</strong>
              <span className={styles.org}>{item.organisation}</span>
              <span className={styles.dates}>{item.start_date} – {item.end_date}</span>
            </div>
            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => setEditing(item.id)}>Edit</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className={styles.empty}>No experience entries yet.</p>}
      </div>
    </div>
  )
}

export default ExperienceManager
