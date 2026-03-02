'use client'

import { useEffect, useState } from 'react'
import AdminShell from './AdminShell'
import { useAdminAuth } from '../hooks/useAdminAuth'

function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: string; color: string }) {
    return (
        <div
            style={{
                padding: '28px 32px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${color}33`,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
            }}
        >
            <div
                style={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    background: `${color}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{label}</div>
            </div>
        </div>
    )
}

export default function AdminDashboard() {
    const { token } = useAdminAuth()
    const [counts, setCounts] = useState({ releases: 0, videos: 0, shows: 0, gallery: 0 })

    useEffect(() => {
        if (!token) return
        Promise.all([
            fetch('/api/releases').then((r) => r.json()),
            fetch('/api/videos').then((r) => r.json()),
            fetch('/api/shows').then((r) => r.json()),
            fetch('/api/gallery').then((r) => r.json()),
        ]).then(([releases, videos, shows, gallery]) => {
            setCounts({
                releases: Array.isArray(releases) ? releases.length : 0,
                videos: Array.isArray(videos) ? videos.length : 0,
                shows: Array.isArray(shows) ? shows.length : 0,
                gallery: Array.isArray(gallery) ? gallery.length : 0,
            })
        })
    }, [token])

    const quickLinks = [
        { href: '/admin/messages', label: 'View Inbox', icon: '📬', desc: 'Read messages from fans and bookings' },
        { href: '/admin/fans', label: 'Manage Fans', icon: '👥', desc: 'View and export newsletter subscribers' },
        { href: '/admin/hero', label: 'Edit Hero Section', icon: '🌟', desc: 'Change headline, tagline, and CTAs' },
        { href: '/admin/about', label: 'Edit Biography', icon: '📝', desc: 'Update bio text and stats' },
        { href: '/admin/releases', label: 'Manage Releases', icon: '🎵', desc: 'Add or edit albums, singles, EPs' },
        { href: '/admin/videos', label: 'Manage Videos', icon: '🎬', desc: 'Add YouTube music videos' },
        { href: '/admin/shows', label: 'Manage Shows', icon: '🎤', desc: 'Schedule or cancel tour dates' },
        { href: '/admin/gallery', label: 'Manage Gallery', icon: '🖼️', desc: 'Upload and organize photos' },
        { href: '/admin/merch', label: 'Manage Merch', icon: '🛍️', desc: 'Edit merchandise items' },
        { href: '/admin/support', label: 'Manage Support', icon: '💖', desc: 'Configure donation settings' },
    ]

    return (
        <AdminShell>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.4rem', fontWeight: 400, color: 'white', marginBottom: '8px' }}>
                    Welcome back 👋
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px' }}>
                    Manage all Diana Mae website content from here.
                </p>
            </div>

            {/* Stats */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '48px',
                }}
            >
                <StatCard label="Releases" value={counts.releases} icon="🎵" color="#9333ea" />
                <StatCard label="Videos" value={counts.videos} icon="🎬" color="#e040fb" />
                <StatCard label="Shows" value={counts.shows} icon="🎤" color="#f5c842" />
                <StatCard label="Gallery Photos" value={counts.gallery} icon="🖼️" color="#f43f5e" />
            </div>

            {/* Quick links */}
            <h2 style={{ fontSize: '13px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '16px' }}>
                Quick Actions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                {quickLinks.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '18px 20px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '14px',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(147,51,234,0.3)'
                            e.currentTarget.style.background = 'rgba(147,51,234,0.08)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                        }}
                    >
                        <span style={{ fontSize: '22px' }}>{link.icon}</span>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{link.label}</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{link.desc}</div>
                        </div>
                    </a>
                ))}
            </div>
        </AdminShell>
    )
}
