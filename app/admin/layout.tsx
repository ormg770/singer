import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin — Diana Mae',
    robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f0eaff', fontFamily: 'var(--font-body)' }}>
            {children}
        </div>
    )
}
