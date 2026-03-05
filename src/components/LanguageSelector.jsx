import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
];

const LanguageSelector = ({ compact = false }) => {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem('app_language', code);
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (compact) {
        return (
            <div ref={ref} style={{ position: 'relative' }}>
                <button
                    onClick={() => setOpen(!open)}
                    className="btn btn-block"
                    style={{
                        justifyContent: 'flex-start',
                        color: 'var(--text-secondary)',
                        paddingLeft: 0,
                        fontSize: '0.875rem',
                    }}
                >
                    <Globe size={18} style={{ marginRight: '0.5rem' }} />
                    {current.label}
                    <ChevronDown size={14} style={{ marginLeft: 'auto' }} />
                </button>
                {open && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: 0,
                            right: 0,
                            background: 'var(--bg-primary, #fff)',
                            border: '1px solid var(--border)',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            zIndex: 50,
                            overflow: 'hidden',
                            marginBottom: '0.25rem',
                        }}
                    >
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    textAlign: 'left',
                                    border: 'none',
                                    background: lang.code === i18n.language ? 'var(--primary-light, #E0E7FF)' : 'transparent',
                                    fontWeight: lang.code === i18n.language ? '600' : '400',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                }}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Full button group for profile page / login page
    return (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {LANGUAGES.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="btn"
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: lang.code === i18n.language ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: lang.code === i18n.language ? 'var(--primary-light, #E0E7FF)' : 'transparent',
                        fontWeight: lang.code === i18n.language ? '600' : '400',
                        color: lang.code === i18n.language ? 'var(--primary)' : 'inherit',
                        fontSize: '0.875rem',
                    }}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
};

export default LanguageSelector;
