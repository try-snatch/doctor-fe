import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Users, UserCog, LogOut, UserRound } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const Sidebar = ({ onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation('common');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="mb-4 flex items-center gap-2" style={{ marginBottom: '2rem' }}>
                <img src="/EzeeHealthLogo.png" alt="EzeeHealth" style={{ width: '36px', height: '36px', borderRadius: '0.25rem' }} />
                <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{t('appName')}</span>
            </div>

            <nav style={{ flex: 1 }}>
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `btn btn-block ${isActive ? 'btn-primary' : ''}`}
                    style={{ justifyContent: 'flex-start', marginBottom: '0.5rem', background: 'transparent', color: 'inherit', border: '1px solid transparent' }}
                    onClick={onClose}
                >
                    <LayoutDashboard size={20} style={{ marginRight: '0.75rem' }} /> {t('nav.dashboard')}
                </NavLink>

                <NavLink
                    to="/patients"
                    className={({ isActive }) => `btn btn-block ${isActive ? 'btn-primary' : ''}`}
                    style={{ justifyContent: 'flex-start', marginBottom: '0.5rem', background: 'transparent', color: 'inherit', border: '1px solid transparent' }}
                    onClick={onClose}
                >
                    <Users size={20} style={{ marginRight: '0.75rem' }} /> {t('nav.patients')}
                </NavLink>


                {user?.role === 'owner' && (
                    <NavLink
                        to="/staff"
                        className={({ isActive }) => `btn btn-block ${isActive ? 'btn-primary' : ''}`}
                        style={{ justifyContent: 'flex-start', marginBottom: '0.5rem', background: 'transparent', color: 'inherit', border: '1px solid transparent' }}
                        onClick={onClose}
                    >
                        <UserCog size={20} style={{ marginRight: '0.75rem' }} /> {t('nav.staffManagement')}
                    </NavLink>
                )}
            </nav>

            <div className="mt-auto pt-4 border-t" style={{ borderTop: '1px solid var(--border)', marginTop: 'auto', paddingTop: '1rem' }}>
                <div className="flex items-center gap-2 mb-2">
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                        {user?.doctor_name?.[0]}
                    </div>
                    <div>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {user?.doctor_name}
                            <NavLink to="/profile" style={{ color: '#2563eb', fontSize: '0.7rem', fontWeight: 'normal', textDecoration: 'underline' }} onClick={onClose}>
                                {t('editProfile')}
                            </NavLink>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{user?.role}</div>
                    </div>
                </div>
                <LanguageSelector compact />
                <button
                    onClick={handleLogout}
                    className="btn btn-block"
                    style={{ justifyContent: 'flex-start', color: 'var(--text-secondary)', paddingLeft: 0 }}
                >
                    <LogOut size={18} style={{ marginRight: '0.5rem' }} /> {t('logout')}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
