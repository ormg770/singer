'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import { useAdminAuth } from '../../hooks/useAdminAuth'

type Subscriber = {
    id: string
    name: string
    email: string
    subscribed_at: string
}

export default function AdminFansPage() {
    const { token } = useAdminAuth()
    const [subscribers, setSubscribers] = useState<Subscriber[]>([])
    const [loading, setLoading] = useState(true)

    const fetchSubscribers = async () => {
        if (!token) return
        setLoading(true)
        try {
            const res = await fetch('/api/admin/fans', {
                headers: { 'x-admin-token': token },
                cache: 'no-store',
            })
            if (res.ok) {
                const data = await res.json()
                setSubscribers(data)
            }
        } catch (err) {
            console.error('Failed to load subscribers', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubscribers()
    }, [token])

    const handleExportCSV = () => {
        if (subscribers.length === 0) return

        const headers = ['Name', 'Email', 'Subscribed At']
        const csvRows = [
            headers.join(','),
            ...subscribers.map(sub =>
                `"${sub.name || ''}","${sub.email}","${new Date(sub.subscribed_at).toISOString()}"`
            )
        ]

        const csvString = csvRows.join('\n')
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', `diana-mae-fans-${new Date().toISOString().split('T')[0]}.csv`)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
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
                        ✨ Fans (Inner Circle)
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '6px' }}>
                        People who subscribed to your newsletter.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={fetchSubscribers}
                        disabled={loading}
                        className="btn-outline"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button
                        onClick={handleExportCSV}
                        disabled={loading || subscribers.length === 0}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            {loading && subscribers.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading your fans...</p>
            ) : subscribers.length === 0 ? (
                <div style={{ padding: '64px 0', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>👥</div>
                    <p style={{ color: 'white', fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>No subscribers yet</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>When fans join your inner circle, they will appear here.</p>
                </div>
            ) : (
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Name</th>
                                <th style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Email</th>
                                <th style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Subscribed On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((sub) => (
                                <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                    <td style={{ padding: '16px 24px', color: 'white', fontSize: '14px', fontWeight: 500 }}>
                                        {sub.name || <span style={{ color: 'rgba(255,255,255,0.3)' }}>Unknown</span>}
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                                        <a href={`mailto:${sub.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{sub.email}</a>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                                        {new Date(sub.subscribed_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminShell>
    )
}
