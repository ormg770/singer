'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Music', href: '#music' },
    { label: 'Videos', href: '#videos' },
    { label: 'Shows', href: '#shows' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Support', href: '#support' },
    { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <nav
            id="navbar"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                transition: 'all 0.4s ease',
                padding: scrolled ? '12px 0' : '20px 0',
                background: scrolled
                    ? 'rgba(5, 5, 8, 0.85)'
                    : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
            }}
        >
            <div className="section-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Logo */}
                <a
                    href="#"
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.6rem',
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                        textDecoration: 'none',
                        color: 'white',
                    }}
                >
                    <span className="text-gradient">Diana</span>{' '}
                    <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 300 }}>Mae</span>
                </a>

                {/* Desktop Links */}
                <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }} className="hidden-mobile">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            style={{
                                textDecoration: 'none',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '13px',
                                fontWeight: 500,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                transition: 'color 0.3s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a href="#newsletter" className="btn-primary" style={{ padding: '10px 24px', fontSize: '12px' }}>
                        Subscribe
                    </a>
                </div>

                {/* Mobile burger */}
                <button
                    className="show-mobile"
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '8px',
                    }}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div
                    style={{
                        background: 'rgba(5, 5, 8, 0.98)',
                        backdropFilter: 'blur(20px)',
                        borderTop: '1px solid rgba(255,255,255,0.07)',
                        padding: '20px 24px 32px',
                    }}
                >
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                display: 'block',
                                padding: '14px 0',
                                textDecoration: 'none',
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '18px',
                                fontFamily: 'var(--font-display)',
                                letterSpacing: '0.05em',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a href="#newsletter" className="btn-primary" style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
                        Subscribe
                    </a>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
        </nav>
    )
}
