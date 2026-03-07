'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface AudioUploaderProps {
    value: string // current URL
    onChange: (url: string) => void
    folder?: string
    token: string
    hint?: string
    label?: string
}

export default function AudioUploader({ value, onChange, folder = 'general', token, hint, label = 'Audio File' }: AudioUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [mode, setMode] = useState<'url' | 'upload'>(value ? 'url' : 'upload')
    const inputRef = useRef<HTMLInputElement>(null)

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setError('')

        const form = new FormData()
        form.append('file', file)
        form.append('folder', folder)

        try {
            const ext = file.name.split('.').pop()
            const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

            const { data, error: uploadError } = await supabase.storage
                .from('diana-mae-assets')
                .upload(filename, file, {
                    contentType: file.type,
                    upsert: false,
                })

            if (uploadError) throw new Error(uploadError.message)

            const { data: urlData } = supabase.storage
                .from('diana-mae-assets')
                .getPublicUrl(data.path)

            onChange(urlData.publicUrl)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '6px',
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '11px 14px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: 'white',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={labelStyle}>{label}</label>
                {/* Toggle */}
                <div style={{ display: 'flex', gap: '0', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {(['upload', 'url'] as const).map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setMode(m)}
                            style={{
                                padding: '4px 12px',
                                fontSize: '11px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: mode === m ? 600 : 400,
                                background: mode === m ? 'rgba(147,51,234,0.5)' : 'rgba(255,255,255,0.04)',
                                color: mode === m ? 'white' : 'rgba(255,255,255,0.45)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {m === 'upload' ? '📁 Upload' : '🔗 URL'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dimension hint */}
            {hint && (
                <p style={{ fontSize: '11px', color: 'rgba(147,51,234,0.7)', margin: '0 0 8px 0', padding: '5px 10px', background: 'rgba(147,51,234,0.08)', borderRadius: '6px', border: '1px solid rgba(147,51,234,0.15)' }}>
                    💡 {hint}
                </p>
            )}

            {mode === 'url' ? (
                <input
                    type="url"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://..."
                    style={inputStyle}
                />
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    style={{
                        border: '2px dashed rgba(147,51,234,0.35)',
                        borderRadius: '10px',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: uploading ? 'wait' : 'pointer',
                        background: 'rgba(147,51,234,0.04)',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(147,51,234,0.6)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(147,51,234,0.35)')}
                >
                    {uploading ? (
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>⏳ Uploading...</p>
                    ) : (
                        <>
                            <p style={{ fontSize: '24px', margin: '0 0 6px 0' }}>🎵</p>
                            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', margin: 0 }}>
                                Click to select an audio file
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginTop: '4px' }}>
                                MP3, WAV, OGG, M4A · Max 10MB
                            </p>
                        </>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="audio/*,.mp3,.wav,.ogg,.m4a"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
            )}

            {error && (
                <p style={{ color: '#f43f5e', fontSize: '12px', marginTop: '6px' }}>⚠ {error}</p>
            )}

            {/* Preview */}
            {value && (
                <div style={{ marginTop: '12px', position: 'relative', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <audio
                        controls
                        src={value}
                        style={{ width: '100%', height: '40px', outline: 'none' }}
                        preload="metadata"
                        controlsList="nodownload"
                    />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        style={{
                            position: 'absolute', top: '-8px', right: '-8px',
                            background: '#f43f5e', border: 'none', borderRadius: '50%',
                            width: '24px', height: '24px', cursor: 'pointer', color: 'white',
                            fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
                        }}
                        title="Remove audio"
                    >
                        ✕
                    </button>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '8px', wordBreak: 'break-all' }}>
                        {value}
                    </p>
                </div>
            )}
        </div>
    )
}
