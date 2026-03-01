'use client'

const socials = [
    { name: 'Spotify', icon: '🎵', url: 'https://open.spotify.com' },
    { name: 'Instagram', icon: '📸', url: 'https://instagram.com' },
    { name: 'TikTok', icon: '🎬', url: 'https://tiktok.com' },
    { name: 'YouTube', icon: '▶️', url: 'https://youtube.com' },
    { name: 'Twitter / X', icon: '✖️', url: 'https://twitter.com' },
]

const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Music', href: '#music' },
    { label: 'Videos', href: '#videos' },
    { label: 'Shows', href: '#shows' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Merch', href: '#merch' },
    { label: 'Contact', href: '#contact' },
]

export default function Footer() {
    return (
        <footer
            style={{
                background: 'linear-gradient(to top, #020204 0%, rgba(10,8,18,0.95) 100%)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                padding: '80px 0 32px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Music wave animation */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #9333ea, #e040fb, #f5c842, #e040fb, #9333ea, transparent)',
                    backgroundSize: '200% auto',
                    animation: 'shimmer 4s linear infinite',
                }}
            />

            <div className="section-container">
                {/* Top row */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '48px',
                        paddingBottom: '60px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                    className="footer-grid"
                >
                    {/* Brand */}
                    <div>
                        <a
                            href="#"
                            style={{
                                display: 'inline-block',
                                fontFamily: 'var(--font-display)',
                                fontSize: '2.2rem',
                                fontWeight: 500,
                                letterSpacing: '0.06em',
                                textDecoration: 'none',
                                color: 'white',
                                marginBottom: '16px',
                            }}
                        >
                            <span className="text-gradient">Diana</span>{' '}
                            <span style={{ fontWeight: 200 }}>Mae</span>
                        </a>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, maxWidth: 240 }}>
                            Singer. Songwriter. A voice that commands the dark.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4
                            style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: 'var(--text-muted)',
                                marginBottom: '20px',
                            }}
                        >
                            Navigation
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    style={{
                                        color: 'rgba(255,255,255,0.55)',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Social + Newsletter CTA */}
                    <div>
                        <h4
                            style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: 'var(--text-muted)',
                                marginBottom: '20px',
                            }}
                        >
                            Follow Diana
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {socials.map((s) => (
                                <a
                                    key={s.name}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: 'rgba(255,255,255,0.55)',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                                >
                                    <span>{s.icon}</span>
                                    {s.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '28px',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}
                >
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                        © {new Date().getFullYear()} Diana Mae. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        {['Privacy Policy', 'Terms of Use', 'Press Kit'].map((link) => (
                            <a
                                key={link}
                                href="#"
                                style={{
                                    color: 'var(--text-muted)',
                                    textDecoration: 'none',
                                    fontSize: '12px',
                                    letterSpacing: '0.03em',
                                    transition: 'color 0.3s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
        </footer>
    )
}
