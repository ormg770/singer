'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { Release } from '@/lib/supabase'
import ImageUploader from '../components/ImageUploader'

type PlatformLink = { platform: string; url: string }

const PLATFORMS = [
    { value: 'spotify', label: 'Spotify', color: '#1db954' },
    { value: 'apple_music', label: 'Apple Music', color: '#fc3c4a' },
    { value: 'amazon', label: 'Amazon Music', color: '#00A8E1' },
    { value: 'youtube', label: 'YouTube Music', color: '#FF0000' },
    { value: 'tidal', label: 'Tidal', color: '#FFFFFF' },
    { value: 'soundcloud', label: 'SoundCloud', color: '#FF5500' },
    { value: 'deezer', label: 'Deezer', color: '#A238FF' },
]

type ReleaseForm = {
    title: string
    type: string
    cover_url: string
    release_date: string
    tagline: string
    badge: string
    platform_links: PlatformLink[]
}

const emptyForm: ReleaseForm = {
    title: '',
    type: 'single',
    cover_url: '',
    release_date: '',
    tagline: '',
    badge: '',
    platform_links: [{ platform: 'spotify', url: '' }],
}

function parsePlatformLinks(release: Release): PlatformLink[] {
    // Try new platform_links field
    if (release.platform_links) {
        try {
            const links = typeof release.platform_links === 'string'
                ? JSON.parse(release.platform_links)
                : release.platform_links
            if (Array.isArray(links) && links.length > 0) return links
        } catch { /* fall through */ }
    }
    // Legacy fallback
    const result: PlatformLink[] = []
    if (release.spotify_url) result.push({ platform: 'spotify', url: release.spotify_url })
    if (release.apple_music_url) {
        try {
            const parsed = JSON.parse(release.apple_music_url)
            if (parsed?.url) result.push({ platform: parsed.platform || 'apple_music', url: parsed.url })
        } catch {
            result.push({ platform: 'apple_music', url: release.apple_music_url })
        }
    }
    return result.length > 0 ? result : [{ platform: 'spotify', url: '' }]
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
    const [form, setForm] = useState<ReleaseForm>(emptyForm)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState<Record<string, string>>({})
    const [savingSettings, setSavingSettings] = useState(false)

    async function load() {
        const data = await fetch('/api/releases').then((r) => r.json())
        if (Array.isArray(data)) setReleases(data)

        const sData = await fetch('/api/settings').then((r) => r.json())
        if (sData && typeof sData === 'object' && !Array.isArray(sData)) {
            setSettings(sData)
        }
    }

    useEffect(() => { if (token) load() }, [token])

    function openNew() { setForm(emptyForm); setIsNew(true); setEditing(null) }
    function openEdit(r: Release) {
        setForm({
            title: r.title,
            type: r.type,
            cover_url: r.cover_url,
            release_date: r.release_date,
            tagline: r.tagline || '',
            badge: r.badge || '',
            platform_links: parsePlatformLinks(r),
        })
        setEditing(r)
        setIsNew(false)
    }
    function closeModal() { setEditing(null); setIsNew(false) }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        // Build the body with platform_links as JSON and also keep legacy fields for backwards compat
        const validLinks = form.platform_links.filter(l => l.url.trim() !== '')
        const spotifyLink = validLinks.find(l => l.platform === 'spotify')
        const secondaryLink = validLinks.find(l => l.platform !== 'spotify')

        const body = {
            title: form.title,
            type: form.type,
            cover_url: form.cover_url,
            release_date: form.release_date,
            tagline: form.tagline,
            badge: form.badge,
            platform_links: validLinks,
            // Keep legacy fields in sync
            spotify_url: spotifyLink?.url || '',
            apple_music_url: secondaryLink ? JSON.stringify({ platform: secondaryLink.platform, url: secondaryLink.url }) : JSON.stringify({ platform: 'apple_music', url: '' }),
        }

        if (isNew) {
            await fetch('/api/admin/releases', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': token! }, body: JSON.stringify(body) })
        } else {
            await fetch('/api/admin/releases', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': token! }, body: JSON.stringify({ id: editing!.id, ...body }) })
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

    // Platform links management
    function addPlatformLink() {
        const usedPlatforms = form.platform_links.map(l => l.platform)
        const available = PLATFORMS.find(p => !usedPlatforms.includes(p.value))
        if (!available) return
        setForm({ ...form, platform_links: [...form.platform_links, { platform: available.value, url: '' }] })
    }

    function updatePlatformLink(index: number, field: 'platform' | 'url', value: string) {
        const updated = [...form.platform_links]
        updated[index] = { ...updated[index], [field]: value }
        setForm({ ...form, platform_links: updated })
    }

    function removePlatformLink(index: number) {
        const updated = form.platform_links.filter((_, i) => i !== index)
        setForm({ ...form, platform_links: updated })
    }

    const usedPlatforms = form.platform_links.map(l => l.platform)

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
                {releases.map((r) => {
                    const links = parsePlatformLinks(r)
                    const platformNames = links.filter(l => l.url).map(l => {
                        const p = PLATFORMS.find(pl => pl.value === l.platform)
                        return p ? p.label : l.platform
                    })
                    return (
                        <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }}>
                            {r.cover_url && <img src={r.cover_url} alt={r.title} style={{ width: 52, height: 52, borderRadius: '8px', objectFit: 'cover' }} />}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: 'white', fontSize: '15px' }}>{r.title}</div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                                    {r.type.toUpperCase()} · {r.release_date}
                                    {platformNames.length > 0 && (
                                        <span style={{ marginLeft: '8px', color: 'rgba(255,255,255,0.25)' }}>
                                            · {platformNames.join(', ')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button onClick={() => openEdit(r)} style={{ padding: '7px 18px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '13px', cursor: 'pointer', marginRight: '6px' }}>Edit</button>
                            <button onClick={() => handleDelete(r.id)} style={{ padding: '7px 18px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: '8px', color: '#f43f5e', fontSize: '13px', cursor: 'pointer' }}>Delete</button>
                        </div>
                    )
                })}
                {releases.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '40px' }}>No releases yet. Click &quot;+ Add Release&quot; to get started.</p>}
            </div>

            {(isNew || editing) && (
                <Modal title={isNew ? 'New Release' : 'Edit Release'} onClose={closeModal}>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Basic fields */}
                        <div>
                            <label style={labelStyle()}>Title</label>
                            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={inputStyle()} />
                        </div>
                        <div>
                            <ImageUploader
                                label="Cover Image"
                                value={form.cover_url}
                                onChange={(url) => setForm({ ...form, cover_url: url })}
                                token={token!}
                                folder="releases"
                                hint="Square (1:1), min 800x800px"
                            />
                        </div>
                        <div>
                            <label style={labelStyle()}>Release Date</label>
                            <input type="date" value={form.release_date} onChange={(e) => setForm({ ...form, release_date: e.target.value })} style={inputStyle()} />
                        </div>
                        <div>
                            <label style={labelStyle()}>Tagline (Editorial Description)</label>
                            <input type="text" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="e.g. An intimate reflection on distance..." style={inputStyle()} />
                        </div>
                        <div>
                            <label style={labelStyle()}>Custom Badge</label>
                            <input type="text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. SINGLE • 2025" style={inputStyle()} />
                        </div>
                        <div>
                            <label style={labelStyle()}>Type</label>
                            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ ...inputStyle(), appearance: 'auto' }}>
                                <option value="single" style={{ color: '#000' }}>Single</option>
                                <option value="ep" style={{ color: '#000' }}>EP</option>
                                <option value="album" style={{ color: '#000' }}>Album</option>
                            </select>
                        </div>

                        {/* Platform Links Section */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '14px',
                            padding: '20px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <label style={{ ...labelStyle(), marginBottom: 0 }}>
                                    🎧 Platform Links
                                </label>
                                {usedPlatforms.length < PLATFORMS.length && (
                                    <button
                                        type="button"
                                        onClick={addPlatformLink}
                                        style={{
                                            padding: '5px 14px',
                                            background: 'rgba(147,51,234,0.2)',
                                            border: '1px solid rgba(147,51,234,0.3)',
                                            borderRadius: '8px',
                                            color: '#c084fc',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        + Add Platform
                                    </button>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {form.platform_links.map((link, index) => {
                                    const pConfig = PLATFORMS.find(p => p.value === link.platform)
                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                gap: '8px',
                                                alignItems: 'center',
                                                padding: '10px 12px',
                                                background: 'rgba(255,255,255,0.03)',
                                                borderRadius: '10px',
                                                border: `1px solid ${pConfig ? pConfig.color + '22' : 'rgba(255,255,255,0.06)'}`,
                                            }}
                                        >
                                            {/* Color indicator dot */}
                                            <div style={{
                                                width: 8, height: 8, borderRadius: '50%',
                                                background: pConfig?.color || '#888',
                                                flexShrink: 0,
                                            }} />
                                            <select
                                                value={link.platform}
                                                onChange={(e) => updatePlatformLink(index, 'platform', e.target.value)}
                                                style={{ ...inputStyle(), flex: 1, appearance: 'auto', padding: '8px 10px', fontSize: '13px' }}
                                            >
                                                {PLATFORMS.map(p => (
                                                    <option
                                                        key={p.value}
                                                        value={p.value}
                                                        disabled={usedPlatforms.includes(p.value) && p.value !== link.platform}
                                                        style={{ color: '#000' }}
                                                    >
                                                        {p.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => updatePlatformLink(index, 'url', e.target.value)}
                                                placeholder="https://..."
                                                style={{ ...inputStyle(), flex: 3, padding: '8px 10px', fontSize: '13px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePlatformLink(index)}
                                                style={{
                                                    width: 32, height: 32, borderRadius: '8px',
                                                    background: 'rgba(244,63,94,0.1)',
                                                    border: '1px solid rgba(244,63,94,0.2)',
                                                    color: '#f43f5e', fontSize: '16px',
                                                    cursor: 'pointer', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0, transition: 'all 0.2s',
                                                }}
                                                title="Remove platform"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            {form.platform_links.length === 0 && (
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textAlign: 'center', padding: '12px 0' }}>
                                    No platforms added. Click &quot;+ Add Platform&quot; to get started.
                                </p>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                            <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#9333ea,#e040fb)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" onClick={closeModal} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminShell>
    )
}
