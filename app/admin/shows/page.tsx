'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { Show } from '@/lib/supabase'

const empty = { venue: '', city: '', country: '', show_date: '', ticket_url: '', is_sold_out: false }

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

export default function AdminShowsPage() {
    const { token } = useAdminAuth()
    const [shows, setShows] = useState<Show[]>([])
    const [editing, setEditing] = useState<Show | null>(null)
    const [isNew, setIsNew] = useState(false)
    const [form, setForm] = useState(empty)
    const [saving, setSaving] = useState(false)

    async function load() {
        const data = await fetch('/api/shows').then((r) => r.json())
        if (Array.isArray(data)) setShows(data)
    }
    useEffect(() => { if (token) load() }, [token])

    function openNew() { setForm(empty); setIsNew(true); setEditing(null) }
    function openEdit(s: Show) { setForm({ venue: s.venue, city: s.city, country: s.country, show_date: s.show_date, ticket_url: s.ticket_url, is_sold_out: s.is_sold_out }); setEditing(s); setIsNew(false) }
    function closeModal() { setEditing(null); setIsNew(false) }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault(); setSaving(true)
        const method = isNew ? 'POST' : 'PUT'
        const body = isNew ? form : { id: editing!.id, ...form }
        await fetch('/api/admin/shows', { method, headers: { 'Content-Type': 'application/json', 'x-admin-token': token! }, body: JSON.stringify(body) })
        setSaving(false); closeModal(); load()
    }
    async function handleDelete(id: string) {
        if (!confirm('Delete this show?')) return
        await fetch('/api/admin/shows', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-token': token! }, body: JSON.stringify({ id }) })
        load()
    }

    return (
        <AdminShell>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: 'white' }}>🎤 Shows</h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '6px' }}>Schedule and manage tour dates</p>
                </div>
                <button onClick={openNew} style={{ padding: '11px 24px', background: 'linear-gradient(135deg,#9333ea,#e040fb)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>+ Add Show</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {shows.map((s) => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: 'white', fontSize: '15px' }}>{s.venue}</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{s.city}, {s.country} · {new Date(s.show_date).toLocaleDateString()}</div>
                        </div>
                        {s.is_sold_out && <span style={{ fontSize: '11px', padding: '3px 10px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '6px', color: '#f43f5e' }}>SOLD OUT</span>}
                        <button onClick={() => openEdit(s)} style={{ padding: '7px 18px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '13px', cursor: 'pointer', marginRight: '6px' }}>Edit</button>
                        <button onClick={() => handleDelete(s.id)} style={{ padding: '7px 18px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: '8px', color: '#f43f5e', fontSize: '13px', cursor: 'pointer' }}>Delete</button>
                    </div>
                ))}
                {shows.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '40px' }}>No shows yet.</p>}
            </div>
            {(isNew || editing) && (
                <Modal title={isNew ? 'New Show' : 'Edit Show'} onClose={closeModal}>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div><label style={labelStyle()}>Venue</label><input type="text" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required style={inputStyle()} /></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div><label style={labelStyle()}>City</label><input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required style={inputStyle()} /></div>
                            <div><label style={labelStyle()}>Country</label><input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required style={inputStyle()} /></div>
                        </div>
                        <div><label style={labelStyle()}>Date & Time</label><input type="datetime-local" value={form.show_date} onChange={(e) => setForm({ ...form, show_date: e.target.value })} required style={inputStyle()} /></div>
                        <div><label style={labelStyle()}>Ticket URL</label><input type="url" value={form.ticket_url} onChange={(e) => setForm({ ...form, ticket_url: e.target.value })} style={inputStyle()} /></div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                            <input type="checkbox" checked={form.is_sold_out} onChange={(e) => setForm({ ...form, is_sold_out: e.target.checked })} />
                            Mark as Sold Out
                        </label>
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
