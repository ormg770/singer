'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { Video } from '@/lib/supabase'
import ImageUploader from '../components/ImageUploader'

const empty = { title: '', youtube_id: '', thumbnail_url: '', type: 'music_video' }

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

export default function AdminVideosPage() {
    const { token } = useAdminAuth()
    const [videos, setVideos] = useState<Video[]>([])
    const [editing, setEditing] = useState<Video | null>(null)
    const [isNew, setIsNew] = useState(false)
    const [form, setForm] = useState(empty)
    const [saving, setSaving] = useState(false)

    async function load() {
        const data = await fetch('/api/videos', { cache: 'no-store' }).then((r) => r.json())
        if (Array.isArray(data)) setVideos(data)
    }

    useEffect(() => { if (token) load() }, [token])

    function openNew() { setForm(empty); setIsNew(true); setEditing(null) }
    function openEdit(v: Video) { setForm({ title: v.title, youtube_id: v.youtube_id, thumbnail_url: v.thumbnail_url, type: v.type }); setEditing(v); setIsNew(false) }
    function closeModal() { setEditing(null); setIsNew(false) }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        const method = isNew ? 'POST' : 'PUT'
        const body = isNew ? form : { id: editing!.id, ...form }
        await fetch('/api/admin/videos', { method, headers: { 'Content-Type': 'application/json', 'x-admin-token': token! }, body: JSON.stringify(body) })
        setSaving(false); closeModal(); load()
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this video?')) return
        await fetch('/api/admin/videos', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-token': token! }, body: JSON.stringify({ id }) })
        load()
    }

    return (
        <AdminShell>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: 'white' }}>🎬 Videos</h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '6px' }}>Manage YouTube videos</p>
                </div>
                <button onClick={openNew} style={{ padding: '11px 24px', background: 'linear-gradient(135deg,#9333ea,#e040fb)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>+ Add Video</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {videos.map((v) => (
                    <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }}>
                        <img src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`} alt={v.title} style={{ width: 80, height: 45, borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: 'white', fontSize: '15px' }}>{v.title}</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{v.type} · youtube.com/watch?v={v.youtube_id}</div>
                        </div>
                        <button onClick={() => openEdit(v)} style={{ padding: '7px 18px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '13px', cursor: 'pointer', marginRight: '6px' }}>Edit</button>
                        <button onClick={() => handleDelete(v.id)} style={{ padding: '7px 18px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: '8px', color: '#f43f5e', fontSize: '13px', cursor: 'pointer' }}>Delete</button>
                    </div>
                ))}
                {videos.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '40px' }}>No videos yet.</p>}
            </div>

            {(isNew || editing) && (
                <Modal title={isNew ? 'New Video' : 'Edit Video'} onClose={closeModal}>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div><label style={labelStyle()}>Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={inputStyle()} /></div>
                        <div>
                            <label style={labelStyle()}>YouTube Video ID</label>
                            <input type="text" value={form.youtube_id} onChange={(e) => setForm({ ...form, youtube_id: e.target.value })} placeholder="e.g. dQw4w9WgXcQ" required style={inputStyle()} />
                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>The part after ?v= in the YouTube URL</p>
                        </div>
                        <div>
                            <ImageUploader
                                label="Custom Thumbnail URL (optional)"
                                value={form.thumbnail_url}
                                onChange={(url) => setForm({ ...form, thumbnail_url: url })}
                                token={token!}
                                folder="videos"
                                hint="Widescreen (16:9), min 1280x720px"
                            />
                        </div>
                        <div>
                            <label style={labelStyle()}>Type</label>
                            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ ...inputStyle(), appearance: 'auto' }}>
                                <option value="music_video" style={{ color: '#000' }}>Music Video</option>
                                <option value="lyric_video" style={{ color: '#000' }}>Lyric Video</option>
                                <option value="live" style={{ color: '#000' }}>Live Performance</option>
                                <option value="interview" style={{ color: '#000' }}>Interview</option>
                            </select>
                        </div>
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
