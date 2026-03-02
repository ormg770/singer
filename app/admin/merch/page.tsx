'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { Merch } from '@/lib/supabase'
import ImageUploader from '../components/ImageUploader'

const empty = { name: '', price: '', image_url: '', badge: '', store_url: '', sort_order: 0 }

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

export default function AdminMerchPage() {
    const { token } = useAdminAuth()
    const [items, setItems] = useState<Merch[]>([])
    const [editing, setEditing] = useState<Merch | null>(null)
    const [isNew, setIsNew] = useState(false)
    const [form, setForm] = useState(empty)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState<Record<string, string | boolean>>({})
    const [savingSettings, setSavingSettings] = useState(false)

    async function load() {
        if (!token) return
        try {
            const [merchRes, settingsRes] = await Promise.all([
                fetch('/api/admin/merch', { headers: { 'x-admin-token': token } }),
                fetch('/api/settings')
            ])
            const merchData = await merchRes.json()
            const settingsData = await settingsRes.json()

            if (Array.isArray(merchData)) setItems(merchData)

            if (settingsData && typeof settingsData === 'object' && !Array.isArray(settingsData)) {
                setSettings(settingsData)
            } else if (Array.isArray(settingsData)) {
                const map: Record<string, string | boolean> = {}
                settingsData.forEach((item: any) => {
                    if (item.key) {
                        map[item.key] = item.value === 'true' ? true : item.value === 'false' ? false : item.value
                    }
                })
                setSettings(map)
            }
        } catch (err) {
            console.error('Error loading data:', err)
        }
    }
    useEffect(() => { load() }, [token])

    function updateSetting(key: string, value: string | boolean) {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    async function handleSaveSettings() {
        setSavingSettings(true)
        try {
            // The API expects a flat Record<string, string> so we convert booleans to strings
            const formattedSettings: Record<string, string> = {}
            for (const key in settings) {
                formattedSettings[key] = String(settings[key])
            }

            // The settings API uses PUT
            await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': token! },
                body: JSON.stringify(formattedSettings)
            })
            alert('Settings saved successfully!')
        } catch (err) {
            console.error('Failed to save settings:', err)
            alert('Failed to save settings')
        }
        setSavingSettings(false)
    }

    function openNew() { setForm(empty); setIsNew(true); setEditing(null) }
    function openEdit(item: Merch) { setForm({ name: item.name, price: item.price, image_url: item.image_url, badge: item.badge, store_url: item.store_url, sort_order: item.sort_order }); setEditing(item); setIsNew(false) }
    function closeModal() { setEditing(null); setIsNew(false) }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault(); setSaving(true)
        const method = isNew ? 'POST' : 'PUT'
        const body = isNew ? form : { id: editing!.id, ...form }
        await fetch('/api/admin/merch', { method, headers: { 'Content-Type': 'application/json', 'x-admin-token': token! }, body: JSON.stringify(body) })
        setSaving(false); closeModal(); load()
    }
    async function handleDelete(id: string) {
        if (!confirm('Delete this item?')) return
        await fetch('/api/admin/merch', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-token': token! }, body: JSON.stringify({ id }) })
        load()
    }

    return (
        <AdminShell>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: 'white' }}>🛍️ Merch</h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '6px' }}>Manage store settings and merchandise items</p>
                </div>
                <button onClick={openNew} style={{ padding: '11px 24px', background: 'linear-gradient(135deg,#9333ea,#e040fb)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>+ Add Item</button>
            </div>

            {/* General Settings */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', color: 'white', marginBottom: '20px', fontWeight: 500 }}>Section Settings</h2>

                <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                        <div>
                            <div style={{ color: 'white', fontWeight: 600, fontSize: '15px' }}>Coming Soon Mode</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>Toggle this to hide all merch items and show the 'Coming Soon' message.</div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
                            <input
                                type="checkbox"
                                checked={!!settings.merch_coming_soon}
                                onChange={(e) => updateSetting('merch_coming_soon', e.target.checked)}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: settings.merch_coming_soon ? '#9333ea' : 'rgba(255,255,255,0.1)',
                                transition: '.4s', borderRadius: '34px'
                            }}>
                                <span style={{
                                    position: 'absolute', content: '""', height: '20px', width: '20px', left: '4px', bottom: '4px',
                                    backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                                    transform: settings.merch_coming_soon ? 'translateX(22px)' : 'translateX(0)'
                                }} />
                            </span>
                        </label>
                    </div>

                    <div><label style={labelStyle()}>Section Title</label><input type="text" value={String(settings.merch_title ?? 'Wear the *Music*')} onChange={(e) => updateSetting('merch_title', e.target.value)} style={inputStyle()} /></div>

                    <div><label style={labelStyle()}>Description</label><textarea rows={3} value={String(settings.merch_desc ?? "Official merchandise coming soon. Limited drops inspired by each era.")} onChange={(e) => updateSetting('merch_desc', e.target.value)} style={{ ...inputStyle(), resize: 'vertical' }} /></div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div><label style={labelStyle()}>Button Text</label><input type="text" value={String(settings.merch_btn_text ?? 'Join for Early Access')} onChange={(e) => updateSetting('merch_btn_text', e.target.value)} style={inputStyle()} /></div>
                        <div><label style={labelStyle()}>Button Store URL</label><input type="url" value={String(settings.merch_store_url ?? 'https://store.example.com')} onChange={(e) => updateSetting('merch_store_url', e.target.value)} style={inputStyle()} /></div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleSaveSettings}
                        disabled={savingSettings}
                        style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                    >
                        {savingSettings ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>

            <h2 style={{ fontSize: '18px', color: 'white', marginBottom: '16px', fontWeight: 500 }}>Merchandise Items</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }}>
                        <img src={item.image_url} alt={item.name} style={{ width: 52, height: 52, borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: 'white', fontSize: '15px' }}>{item.name}</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{item.price} {item.badge && `· ${item.badge}`}</div>
                        </div>
                        <button onClick={() => openEdit(item)} style={{ padding: '7px 18px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '13px', cursor: 'pointer', marginRight: '6px' }}>Edit</button>
                        <button onClick={() => handleDelete(item.id)} style={{ padding: '7px 18px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: '8px', color: '#f43f5e', fontSize: '13px', cursor: 'pointer' }}>Delete</button>
                    </div>
                ))}
                {items.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '40px' }}>No merch items yet.</p>}
            </div>

            {(isNew || editing) && (
                <Modal title={isNew ? 'Add Merch Item' : 'Edit Item'} onClose={closeModal}>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div><label style={labelStyle()}>Product Name</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle()} /></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div><label style={labelStyle()}>Price</label><input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="$35" style={inputStyle()} /></div>
                            <div><label style={labelStyle()}>Badge</label><input type="text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="New / Limited" style={inputStyle()} /></div>
                        </div>
                        <div>
                            <ImageUploader
                                label="Product Image"
                                value={form.image_url}
                                onChange={(url) => setForm({ ...form, image_url: url })}
                                token={token!}
                                folder="merch"
                                hint="Square (1:1), transparent background preferred"
                            />
                        </div>
                        <div><label style={labelStyle()}>Store URL</label><input type="url" value={form.store_url} onChange={(e) => setForm({ ...form, store_url: e.target.value })} style={inputStyle()} /></div>
                        <div><label style={labelStyle()}>Sort Order</label><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} style={inputStyle()} /></div>
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
