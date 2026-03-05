import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { t } = useTranslation('common');

    return (
        <div className="layout-container">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            <main className="main-content">
                {/* Mobile Header */}
                <div className="mobile-header">
                    <button
                        className="btn-icon"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <img src="/EzeeHealthLogo.png" alt="EzeeHealth" style={{ width: '28px', height: '28px', marginLeft: '0.5rem' }} />
                    <span className="font-bold text-lg ml-2">{t('appName')}</span>
                </div>

                {children}
            </main>
        </div>
    );
};

export default Layout;
