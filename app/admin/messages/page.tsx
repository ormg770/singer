'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import { useAdminAuth } from '../../hooks/useAdminAuth'

type Message = {
    id: number
    name: string
    email: string
    subject: string
    message: string
    created_at: string
}

export default function AdminMessagesPage() {
    const { token } = useAdminAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)

    const fetchMessages = async () => {
        if (!token) return
        setLoading(true)
        try {
            const res = await fetch('/api/admin/messages', {
                headers: { 'x-admin-token': token },
            })
            if (res.ok) {
                const data = await res.json()
                setMessages(data)
            }
        } catch (err) {
            console.error('Failed to load messages', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [token])

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this message?')) return

        try {
            const res = await fetch(`/api/admin/messages?id=${id}`, {
                method: 'DELETE',
                headers: { 'x-admin-token': token! },
            })
            if (res.ok) {
                setMessages((prev) => prev.filter((m) => m.id !== id))
            } else {
                alert('Failed to delete message.')
            }
        } catch (err) {
            console.error('Failed to delete message', err)
        }
    }

    return (
        <AdminShell>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '2rem',
                            fontWeight: 400,
                            color: 'white',
                        }}
                    >
                        📬 Inbox
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '6px' }}>
                        Messages from the Let&apos;s Connect form.
                    </p>
                </div>
                <div>
                    <button
                        onClick={fetchMessages}
                        disabled={loading}
                        className="btn-outline"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {loading && messages.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading messages...</p>
            ) : messages.length === 0 ? (
                <div style={{ padding: '64px 0', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
                    <p style={{ color: 'white', fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>Your inbox is empty</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>No new messages from fans right now.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '16px',
                                padding: '24px',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', margin: 0 }}>{msg.name}</h3>
                                        <span style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(147,51,234,0.15)', color: '#e040fb', borderRadius: '12px', letterSpacing: '0.05em' }}>
                                            {msg.subject || 'General'}
                                        </span>
                                    </div>
                                    <a href={`mailto:${msg.email}`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
                                        {msg.email}
                                    </a>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                                        {new Date(msg.created_at).toLocaleString()}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#f43f5e',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            opacity: 0.7,
                                            padding: 0
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div style={{
                                background: 'rgba(0,0,0,0.2)',
                                padding: '16px',
                                borderRadius: '8px',
                                color: 'rgba(255,255,255,0.85)',
                                fontSize: '14px',
                                lineHeight: 1.6,
                                whiteSpace: 'pre-wrap'
                            }}>
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminShell>
    )
}
