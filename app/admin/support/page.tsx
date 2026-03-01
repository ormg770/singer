'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function AdminSupportPage() {
    const { token } = useAdminAuth()
    const [settings, setSettings] = useState<Record<string, string>>({})
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) return
        fetch('/api/admin/settings', {
            headers: { 'x-admin-token': token },
        })
            .then((r) => r.json())
            .then((data) => {
                const map: Record<string, string> = {}
                if (Array.isArray(data)) {
                    data.forEach((d) => (map[d.key] = d.value))
                }
                setSettings(map)
                setLoading(false)
            })
    }, [token])

    const update = (key: string, value: string) => {
        setSettings((s) => ({ ...s, [key]: value }))
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        const updates = Object.entries(settings).map(([key, value]) => ({ key, value }))
        await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-token': token!,
            },
            body: JSON.stringify({ updates }),
        })
        setSaving(false)
        alert('Support settings saved!')
    }

    return (
        <AdminShell>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '32px',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '2rem',
                            fontWeight: 400,
                            color: 'white',
                        }}
                    >
                        💖 Support Form
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '6px' }}>
                        Configure the donation module content
                    </p>
                </div>
            </div>

            <div
                style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '20px',
                    padding: '32px',
                    maxWidth: 600,
                }}
            >
                {loading ? (
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
                ) : (
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Support Title
                            </label>
                            <input
                                type="text"
                                value={settings.support_title ?? 'Fuel the <em>Music</em>'}
                                onChange={(e) => update('support_title', e.target.value)}
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
                                Description Paragraph
                            </label>
                            <textarea
                                rows={4}
                                value={settings.support_desc ?? 'Creating music takes love, time, and resources. If Diana\'s voice has moved you, consider buying her a coffee — every sip fuels a new song.'}
                                onChange={(e) => update('support_desc', e.target.value)}
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
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Inner Card Subtitle
                            </label>
                            <input
                                type="text"
                                value={settings.support_card_title ?? 'Buy Diana a <em>Coffee</em>'}
                                onChange={(e) => update('support_card_title', e.target.value)}
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
                                Inner Card Text
                            </label>
                            <textarea
                                rows={3}
                                value={settings.support_card_text ?? 'Each coffee goes directly toward studio time, new recordings, and keeping the music flowing. Thank you for making this possible. 🙏'}
                                onChange={(e) => update('support_card_text', e.target.value)}
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
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                    Button Text
                                </label>
                                <input
                                    type="text"
                                    value={settings.support_btn_text ?? 'Support on Ko-fi'}
                                    onChange={(e) => update('support_btn_text', e.target.value)}
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
                            <div style={{ width: '120px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                    Icon / Emoji
                                </label>
                                <input
                                    type="text"
                                    value={settings.support_icon ?? '☕'}
                                    onChange={(e) => update('support_icon', e.target.value)}
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
                                        textAlign: 'center'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Button URL (Ko-fi, Patreon, etc.)
                            </label>
                            <input
                                type="url"
                                value={settings.support_url ?? 'https://ko-fi.com/dianamaeofficial'}
                                onChange={(e) => update('support_url', e.target.value)}
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


                        <div style={{ marginTop: '16px' }}>
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    padding: '14px 28px',
                                    background: 'linear-gradient(135deg, #FF5E5B, #ff7043)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    opacity: saving ? 0.7 : 1,
                                    width: '100%',
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Support Config'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminShell>
    )
}
