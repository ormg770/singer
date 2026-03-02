'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import ImageUploader from '../components/ImageUploader'

export default function AdminAboutPage() {
    const { token } = useAdminAuth()
    const [settings, setSettings] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        if (!token) return
        fetch('/api/admin/settings', { headers: { 'x-admin-token': token } })
            .then((r) => r.json())
            .then((data) => { setSettings(data); setLoading(false) })
    }, [token])

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': token! },
            body: JSON.stringify(settings),
        })
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    function update(key: string, value: string) {
        setSettings((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <AdminShell>
            <div style={{ maxWidth: 720 }}>
                <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: 'white', marginBottom: '8px' }}>
                    📝 Biography
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '36px' }}>
                    Edit the artist biography text and statistics shown in the About section.
                </p>

                {loading ? (
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
                ) : (
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Biography Title
                            </label>
                            <input
                                type="text"
                                value={settings.bio_title ?? 'A Voice That Commands the Dark'}
                                onChange={(e) => update('bio_title', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px',
                                    color: 'white',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Floating Badge Text (Under Photo)
                            </label>
                            <input
                                type="text"
                                value={settings.bio_badge_text ?? 'Since 2019'}
                                onChange={(e) => update('bio_badge_text', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px',
                                    color: 'white',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div>
                            <ImageUploader
                                label="Biography Image"
                                value={settings.bio_image ?? ''}
                                onChange={(url) => update('bio_image', url)}
                                token={token!}
                                folder="about"
                                hint="Portrait (3:4) recommended"
                            />
                        </div>

                        {[
                            { key: 'bio_text', label: 'Biography — First Paragraph', rows: 5 },
                            { key: 'bio_text_2', label: 'Biography — Second Paragraph', rows: 5 },
                        ].map((f) => (
                            <div key={f.key}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '12px',
                                        color: 'rgba(255,255,255,0.45)',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        marginBottom: '8px',
                                    }}
                                >
                                    {f.label}
                                </label>
                                <textarea
                                    rows={f.rows}
                                    value={settings[f.key] ?? ''}
                                    onChange={(e) => update(f.key, e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '10px',
                                        color: 'white',
                                        fontSize: '14px',
                                        lineHeight: 1.7,
                                        resize: 'vertical',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        fontFamily: 'inherit',
                                        transition: 'border-color 0.3s',
                                    }}
                                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(147,51,234,0.6)')}
                                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                                />
                            </div>
                        ))}

                        {/* Stats */}
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                                Statistics
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                {[
                                    { key: 'stat_releases', label: 'Releases' },
                                    { key: 'stat_streams', label: 'Streams' },
                                    { key: 'stat_countries', label: 'Countries Toured' },
                                ].map((s) => (
                                    <div key={s.key}>
                                        <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: '6px' }}>
                                            {s.label}
                                        </label>
                                        <input
                                            type="text"
                                            value={settings[s.key] ?? ''}
                                            onChange={(e) => update(s.key, e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                background: 'rgba(255,255,255,0.06)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '10px',
                                                color: 'white',
                                                fontSize: '14px',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                                Social Media Links
                            </label>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>Leave a link blank to hide that button from the public site.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                {[
                                    { key: 'social_spotify', label: 'Spotify URL', icon: '🎵' },
                                    { key: 'social_instagram', label: 'Instagram URL', icon: '📸' },
                                    { key: 'social_tiktok', label: 'TikTok URL', icon: '🎬' },
                                    { key: 'social_youtube', label: 'YouTube URL', icon: '▶️' },
                                ].map((s) => (
                                    <div key={s.key}>
                                        <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: '6px' }}>
                                            {s.icon} {s.label}
                                        </label>
                                        <input
                                            type="url"
                                            placeholder={`https://...`}
                                            value={settings[s.key] ?? ''}
                                            onChange={(e) => update(s.key, e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                background: 'rgba(255,255,255,0.06)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '10px',
                                                color: 'white',
                                                fontSize: '14px',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    padding: '12px 28px',
                                    background: 'linear-gradient(135deg, #9333ea, #e040fb)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: saving ? 'wait' : 'pointer',
                                    opacity: saving ? 0.7 : 1,
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            {saved && <span style={{ color: '#1db954', fontSize: '14px' }}>✓ Saved!</span>}
                        </div>
                    </form>
                )}
            </div>
        </AdminShell>
    )
}
