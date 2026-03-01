'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import ImageUploader from '../components/ImageUploader'

export default function AdminHeroPage() {
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

    const fields = [
        { key: 'hero_bg_image', label: 'Background Image', type: 'image', hint: 'Widescreen (16:9), min 1920x1080px' },
        { key: 'hero_title', label: 'Artist Name / Title', placeholder: 'Diana Mae' },
        { key: 'hero_tagline', label: 'Tagline', placeholder: 'Singer · Songwriter · Performer' },
        { key: 'hero_cta_primary_label', label: 'Primary Button Label', placeholder: 'Listen Now' },
        { key: 'hero_cta_primary_href', label: 'Primary Button Link', placeholder: '#music' },
        { key: 'hero_cta_secondary_label', label: 'Secondary Button Label', placeholder: 'View Tour Dates' },
        { key: 'hero_cta_secondary_href', label: 'Secondary Button Link', placeholder: '#shows' },
    ]

    return (
        <AdminShell>
            <div style={{ maxWidth: 680 }}>
                <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: 'white', marginBottom: '8px' }}>
                    🌟 Hero Section
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '36px' }}>
                    Edit the main headline, tagline, and call-to-action buttons visible on the home page.
                </p>

                {loading ? (
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
                ) : (
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {fields.map((f) => (
                            <div key={f.key}>
                                {f.type === 'image' ? (
                                    <ImageUploader
                                        label={f.label}
                                        value={settings[f.key] ?? ''}
                                        onChange={(url) => update(f.key, url)}
                                        token={token!}
                                        folder="hero"
                                        hint={f.hint}
                                    />
                                ) : (
                                    <>
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
                                        <input
                                            type="text"
                                            value={settings[f.key] ?? ''}
                                            onChange={(e) => update(f.key, e.target.value)}
                                            placeholder={f.placeholder}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                background: 'rgba(255,255,255,0.06)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '10px',
                                                color: 'white',
                                                fontSize: '15px',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.3s',
                                            }}
                                            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(147,51,234,0.6)')}
                                            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                                        />
                                    </>
                                )}
                            </div>
                        ))}

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingTop: '8px' }}>
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
                            {saved && (
                                <span style={{ color: '#1db954', fontSize: '14px' }}>✓ Saved successfully!</span>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </AdminShell>
    )
}
