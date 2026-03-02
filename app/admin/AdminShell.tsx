'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminAuth } from '../hooks/useAdminAuth'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/messages', label: 'Inbox', icon: '📬' },
    { href: '/admin/fans', label: 'Fans', icon: '👥' },
    { href: '/admin/hero', label: 'Hero Section', icon: '🌟' },
    { href: '/admin/about', label: 'Biography', icon: '📝' },
    { href: '/admin/releases', label: 'Releases', icon: '🎵' },
    { href: '/admin/videos', label: 'Videos', icon: '🎬' },
    { href: '/admin/shows', label: 'Shows', icon: '🎤' },
    { href: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
    { href: '/admin/merch', label: 'Merch', icon: '🛍️' },
    { href: '/admin/support', label: 'Support', icon: '💖' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const { token, loading, logout } = useAdminAuth()
    const pathname = usePathname()

    if (loading || !token) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Loading...</div>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside
                style={{
                    width: 240,
                    background: 'rgba(255,255,255,0.03)',
                    borderRight: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    overflowY: 'auto',
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        padding: '28px 24px 24px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                >
                    <div
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '1.2rem',
                            fontWeight: 400,
                            color: 'white',
                        }}
                    >
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #e040fb, #f5c842)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontStyle: 'italic',
                            }}
                        >
                            Diana Mae
                        </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', letterSpacing: '0.1em' }}>
                        ADMIN PANEL
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ padding: '16px 12px', flex: 1 }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 14px',
                                    borderRadius: '10px',
                                    marginBottom: '4px',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                                    background: isActive ? 'rgba(147,51,234,0.2)' : 'transparent',
                                    border: isActive ? '1px solid rgba(147,51,234,0.3)' : '1px solid transparent',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <Link
                        href="/"
                        target="_blank"
                        style={{
                            display: 'block',
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.35)',
                            textDecoration: 'none',
                            marginBottom: '8px',
                        }}
                    >
                        ↗ View Public Site
                    </Link>
                    <button
                        onClick={logout}
                        style={{
                            width: '100%',
                            padding: '8px',
                            background: 'rgba(244,63,94,0.1)',
                            border: '1px solid rgba(244,63,94,0.2)',
                            borderRadius: '8px',
                            color: '#f43f5e',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    )
}
