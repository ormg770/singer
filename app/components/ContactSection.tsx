'use client'

import { useState } from 'react'

export default function ContactSection() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (res.ok) {
                setStatus('success')
                setForm({ name: '', email: '', subject: '', message: '' })
            } else {
                const data = await res.json()
                setStatus('error')
                setErrorMsg(data.error || 'Something went wrong.')
            }
        } catch {
            setStatus('error')
            setErrorMsg('Connection error. Please try again.')
        }
    }

    return (
        <section
            id="contact"
            style={{
                padding: '140px 0',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div
                className="bg-orb"
                style={{
                    width: 500,
                    height: 500,
                    background: 'radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)',
                    top: '10%',
                    right: '-10%',
                }}
            />

            <div className="section-container">
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '80px',
                        alignItems: 'start',
                    }}
                    className="contact-grid"
                >
                    {/* Left: Info */}
                    <div>
                        <div className="section-label">Get In Touch</div>
                        <h2 className="section-title" style={{ marginBottom: '24px' }}>
                            Let&apos;s <em>Connect</em>
                        </h2>
                        <div className="divider" />
                        <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.8, marginBottom: '48px' }}>
                            For bookings, press inquiries, collaborations, or just to say hello —
                            Diana&apos;s team is listening.
                        </p>

                        {/* Contact cards */}
                        {[
                            { icon: '📮', label: 'General Inquiries', value: 'hello@dianamae.com' },
                            { icon: '🎤', label: 'Booking & Press', value: 'booking@dianamae.com' },
                            { icon: '💼', label: 'Management', value: 'mgmt@dianamae.com' },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="glass-card"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '18px 22px',
                                    borderRadius: '16px',
                                    marginBottom: '12px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    transition: 'border-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(147,51,234,0.3)')}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                            >
                                <div style={{ fontSize: '24px' }}>{item.icon}</div>
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '2px' }}>
                                        {item.label}
                                    </div>
                                    <div style={{ fontSize: '15px', color: 'white' }}>{item.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Form */}
                    <div>
                        <div
                            className="glass-card"
                            style={{
                                padding: '40px',
                                borderRadius: '28px',
                                border: '1px solid rgba(255,255,255,0.07)',
                            }}
                        >
                            {status === 'success' ? (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
                                    <h3
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '1.6rem',
                                            color: 'white',
                                            marginBottom: '12px',
                                        }}
                                    >
                                        Message Sent!
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                                        Thank you for reaching out. Diana&apos;s team will get back to you soon.
                                    </p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="btn-outline"
                                        style={{ marginTop: '24px' }}
                                    >
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                                                NAME
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Your name"
                                                className="form-input"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                                                EMAIL
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="your@email.com"
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                                            SUBJECT
                                        </label>
                                        <select
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            className="form-input"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <option value="">Select a subject...</option>
                                            <option value="Booking">Booking & Performances</option>
                                            <option value="Press">Press & Media</option>
                                            <option value="Collab">Collaboration</option>
                                            <option value="Fan">Fan Message</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                                            MESSAGE
                                        </label>
                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            required
                                            placeholder="Write your message here..."
                                            rows={5}
                                            className="form-input"
                                            style={{ resize: 'none' }}
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <p style={{ color: '#f43f5e', fontSize: '14px' }}>{errorMsg}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="btn-primary"
                                        style={{
                                            justifyContent: 'center',
                                            opacity: status === 'loading' ? 0.7 : 1,
                                        }}
                                    >
                                        {status === 'loading' ? 'Sending...' : 'Send Message →'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
        </section>
    )
}
