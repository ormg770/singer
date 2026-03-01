'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { GalleryItem } from '@/lib/supabase'
import ImageUploader from '../components/ImageUploader'

const empty = { image_url: '', caption: '', category: 'promo', sort_order: 0 }

function inputStyle(): React.CSSProperties {
    return { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }
}
function labelStyle(): React.CSSProperties {
    return { display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }
}
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={onClose}>
            <div style={{ background: '#12111a', border: '1px solid rgba(147,51,234,0.25)', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, color: 'white', marginBottom: '24px', fontSize: '1.5rem' }}>{title}</h2>
                {children}
            </div>
        </div>
    )
}

export default function AdminGalleryPage() {
    const { token } = useAdminAuth()
    const [items, setItems] = useState<GalleryItem[]>([])
    const [editing, setEditing] = useState<GalleryItem | null>(null)
    const [isNew, setIsNew] = useState(false)
    const [form, setForm] = useState(empty)
    const [saving, setSaving] = useState(false)

    async function load() {
        const data = await fetch('/api/gallery').then((r) => r.json())
        if (Array.isArray(data)) setItems(data)
    }
    useEffect(() => { if (token) load() }, [token])

    function openNew() { setForm(empty); setIsNew(true); setEditing(null) }
    function openEdit(item: GalleryItem) { setForm({ image_url: item.image_url, caption: item.caption, category: item.category, sort_order: item.sort_order }); setEditing(item); setIsNew(false) }
    function closeModal() { setEditing(null); setIsNew(false) }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault(); setSaving(true)
        const method = isNew ? 'POST' : 'PUT'
        const body = isNew ? form : { id: editing!.id, ...form }
        await fetch('/api/admin/gallery', { method, headers: { 'Content-Type': 'application/json', 'x-admin-token': token! }, body: JSON.stringify(body) })
        setSaving(false); closeModal(); load()
    }
    async function handleDelete(id: string) {
        if (!confirm('Delete this photo?')) return
        await fetch('/api/admin/gallery', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-token': token! }, body: JSON.stringify({ id }) })
        load()
    }

    return (
        <AdminShell>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: 'white' }}>🖼️ Gallery</h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '6px' }}>Manage photos ({items.length} photos)</p>
                </div>
                <button onClick={openNew} style={{ padding: '11px 24px', background: 'linear-gradient(135deg,#9333ea,#e040fb)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>+ Add Photo</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                {items.map((item) => (
                    <div key={item.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
                        <img src={item.image_url} alt={item.caption} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                        <div style={{ padding: '12px' }}>
                            <div style={{ fontSize: '13px', color: 'white', fontWeight: 500, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.caption || '—'}</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '12px' }}>{item.category}</div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => openEdit(item)} style={{ flex: 1, padding: '6px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: '6px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '7px', color: '#f43f5e', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>No photos yet.</p>}
            </div>

            {(isNew || editing) && (
                <Modal title={isNew ? 'Add Photo' : 'Edit Photo'} onClose={closeModal}>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <ImageUploader
                                label="Image"
                                value={form.image_url}
                                onChange={(url) => setForm({ ...form, image_url: url })}
                                token={token!}
                                folder="gallery"
                                hint="High resolution (min 1200px wide/tall)"
                            />
                        </div>
                        <div><label style={labelStyle()}>Caption</label><input type="text" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} style={inputStyle()} /></div>
                        <div>
                            <label style={labelStyle()}>Category</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle(), appearance: 'auto' }}>
                                <option value="promo" style={{ color: '#000' }}>Promo</option>
                                <option value="live" style={{ color: '#000' }}>Live</option>
                                <option value="studio" style={{ color: '#000' }}>Studio</option>
                            </select>
                        </div>
                        <div><label style={labelStyle()}>Sort Order (lower = first)</label><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} style={inputStyle()} /></div>
                        <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                            <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#9333ea,#e040fb)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : 'Save'}</button>
                            <button type="button" onClick={closeModal} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminShell>
    )
}
