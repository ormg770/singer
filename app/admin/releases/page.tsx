'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { Release } from '@/lib/supabase'
import ImageUploader from '../components/ImageUploader'

const empty: Omit<Release, 'id'> = {
    title: '',
    type: 'single',
    cover_url: '',
    release_date: '',
    spotify_url: '',
    apple_music_url: JSON.stringify({ platform: 'apple_music', url: '' }),
    tagline: '',
    badge: ''
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 999,
                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#12111a', border: '1px solid rgba(147,51,234,0.25)',
                    borderRadius: '20px', padding: '36px', width: '100%', maxWidth: 560,
                    maxHeight: '90vh', overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, color: 'white', marginBottom: '24px', fontSize: '1.5rem' }}>{title}</h2>
                {children}
            </div>
        </div>
    )
}

function inputStyle(): React.CSSProperties {
    return {
        width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
        color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    }
}

function labelStyle(): React.CSSProperties {
    return {
        display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px',
    }
}

export default function AdminReleasesPage() {
    const { token } = useAdminAuth()
    const [releases, setReleases] = useState<Release[]>([])
    const [editing, setEditing] = useState<Release | null>(null)
    const [isNew, setIsNew] = useState(false)
    const [form, setForm] = useState<Omit<Release, 'id'>>(empty)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState<Record<string, string>>({})
    const [savingSettings, setSavingSettings] = useState(false)

    // Helper to safely parse platform info from apple_music_url
    function getPlatformData(str: string | null) {
        if (!str) return { platform: 'apple_music', url: '' }
        try {
            const parsed = JSON.parse(str)
            if (parsed && typeof parsed === 'object') return parsed
        } catch {
            return { platform: 'apple_music', url: str }
        }
        return { platform: 'apple_music', url: '' }
    }

    async function load() {
        const data = await fetch('/api/releases').then((r) => r.json())
        if (Array.isArray(data)) setReleases(data)

        const sData = await fetch('/api/settings').then((r) => r.json())
        if (sData && typeof sData === 'object' && !Array.isArray(sData)) {
            setSettings(sData)
        }
    }

    useEffect(() => { if (token) load() }, [token])

    function openNew() { setForm(empty); setIsNew(true); setEditing(null) }
    function openEdit(r: Release) { setForm({ title: r.title, type: r.type, cover_url: r.cover_url, release_date: r.release_date, spotify_url: r.spotify_url, apple_music_url: r.apple_music_url, tagline: r.tagline || '', badge: r.badge || '' }); setEditing(r); setIsNew(false) }
    function closeModal() { setEditing(null); setIsNew(false) }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        if (isNew) {
            await fetch('/api/admin/releases', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': token! }, body: JSON.stringify(form) })
        } else {
            await fetch('/api/admin/releases', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': token! }, body: JSON.stringify({ id: editing!.id, ...form }) })
        }
        setSaving(false)
        closeModal()
        load()
    }

    async function handleSaveSettings(e: React.FormEvent) {
        e.preventDefault()
        setSavingSettings(true)
        await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': token! },
            body: JSON.stringify(settings)
        })
        setSavingSettings(false)
        load()
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this release?')) return
        await fetch('/api/admin/releases', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-token': token! }, body: JSON.stringify({ id }) })
        load()
    }

    return (
        <AdminShell>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: 'white' }}>🎵 Releases</h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '6px' }}>Manage albums, singles, and EPs</p>
                </div>
                <button onClick={openNew} style={{ padding: '11px 24px', background: 'linear-gradient(135deg,#9333ea,#e040fb)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                    + Add Release
                </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '16px', fontWeight: 500 }}>Global Section Settings</h2>
                <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
                    <div>
                        <label style={labelStyle()}>Section Title</label>
                        <input type="text" value={settings.music_title || ''} onChange={(e) => setSettings({ ...settings, music_title: e.target.value })} placeholder="The Music" style={inputStyle()} />
                    </div>
                    <div>
                        <label style={labelStyle()}>Section Description</label>
                        <textarea value={settings.music_desc || ''} onChange={(e) => setSettings({ ...settings, music_desc: e.target.value })} placeholder="From debut singles to full-length albums..." style={{ ...inputStyle(), minHeight: '80px', resize: 'vertical' }} />
                    </div>
                    <button type="submit" disabled={savingSettings} style={{ alignSelf: 'flex-start', padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '13px' }}>
                        {savingSettings ? 'Saving...' : 'Save Settings'}
                    </button>
                </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {releases.map((r) => (
                    <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }}>
                        {r.cover_url && <img src={r.cover_url} alt={r.title} style={{ width: 52, height: 52, borderRadius: '8px', objectFit: 'cover' }} />}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: 'white', fontSize: '15px' }}>{r.title}</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                                {r.type.toUpperCase()} · {r.release_date}
                            </div>
                        </div>
                        <button onClick={() => openEdit(r)} style={{ padding: '7px 18px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '13px', cursor: 'pointer', marginRight: '6px' }}>Edit</button>
                        <button onClick={() => handleDelete(r.id)} style={{ padding: '7px 18px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: '8px', color: '#f43f5e', fontSize: '13px', cursor: 'pointer' }}>Delete</button>
                    </div>
                ))}
                {releases.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '40px' }}>No releases yet. Click "+ Add Release" to get started.</p>}
            </div>

            {(isNew || editing) && (() => {
                const platformData = getPlatformData(form.apple_music_url)
                return (
                    <Modal title={isNew ? 'New Release' : 'Edit Release'} onClose={closeModal}>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {([
                                { key: 'title', label: 'Title', type: 'text', required: true },
                                { key: 'cover_url', label: 'Cover Image', type: 'image', hint: 'Square (1:1), min 800x800px' },
                                { key: 'release_date', label: 'Release Date', type: 'date', required: false },
                                { key: 'tagline', label: 'Tagline (Editorial Description)', type: 'text', required: false, placeholder: 'e.g. An intimate reflection on distance...' },
                                { key: 'badge', label: 'Custom Badge', type: 'text', required: false, placeholder: 'e.g. SINGLE • 2025' },
                                { key: 'spotify_url', label: 'Spotify URL', type: 'url', required: false },
                            ] as const).map((f) => (
                                <div key={f.key}>
                                    {f.type === 'image' ? (
                                        <ImageUploader
                                            label={f.label}
                                            value={form.cover_url}
                                            onChange={(url) => setForm({ ...form, cover_url: url })}
                                            token={token!}
                                            folder="releases"
                                            hint={f.hint}
                                        />
                                    ) : (
                                        <>
                                            <label style={labelStyle()}>{f.label}</label>
                                            <input type={f.type} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={(f as any).placeholder} required={f.required} style={inputStyle()} />
                                        </>
                                    )}
                                </div>
                            ))}

                            <div>
                                <label style={labelStyle()}>Secondary Platform</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <select
                                        value={platformData.platform}
                                        onChange={(e) => setForm({ ...form, apple_music_url: JSON.stringify({ ...platformData, platform: e.target.value }) })}
                                        style={{ ...inputStyle(), appearance: 'auto', flex: 1 }}
                                    >
                                        <option value="apple_music" style={{ color: '#000' }}>Apple Music</option>
                                        <option value="amazon" style={{ color: '#000' }}>Amazon Music</option>
                                        <option value="youtube" style={{ color: '#000' }}>YouTube Music</option>
                                        <option value="deezer" style={{ color: '#000' }}>Deezer</option>
                                        <option value="soundcloud" style={{ color: '#000' }}>Soundcloud</option>
                                    </select>
                                    <input
                                        type="url"
                                        value={platformData.url}
                                        onChange={(e) => setForm({ ...form, apple_music_url: JSON.stringify({ ...platformData, url: e.target.value }) })}
                                        placeholder="Platform URL"
                                        style={{ ...inputStyle(), flex: 3 }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle()}>Type</label>
                                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Release['type'] })} style={{ ...inputStyle(), appearance: 'auto' }}>
                                    <option value="single" style={{ color: '#000' }}>Single</option>
                                    <option value="ep" style={{ color: '#000' }}>EP</option>
                                    <option value="album" style={{ color: '#000' }}>Album</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                                <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#9333ea,#e040fb)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                                <button type="button" onClick={closeModal} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </Modal>
                )
            })()}
        </AdminShell>
    )
}
