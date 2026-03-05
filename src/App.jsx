import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { closeTopModal } from './hooks/useModalBackHandler';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import StaffPage from './pages/StaffPage';
import ProfilePage from './pages/ProfilePage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import StaffSetupPage from './pages/StaffSetupPage';
import MOUPage from './pages/MOUPage';

// Configure status bar on native platforms
if (Capacitor.isNativePlatform()) {
    if (Capacitor.getPlatform() === 'android') {
        // Android: don't overlay so the WebView sits below the status bar
        StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
        StatusBar.setBackgroundColor({ color: '#4a7dfc' }).catch(() => {});
        StatusBar.setStyle({ style: Style.Light }).catch(() => {});
    } else {
        // iOS: overlay + env(safe-area-inset-top) handles the notch
        StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
        StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    }
}

const ProtectedRoute = ({ children, skipMouCheck = false }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user || !Capacitor.isNativePlatform()) return;

        const listener = CapApp.addListener('backButton', ({ canGoBack }) => {
            // Directly close the topmost modal (bypasses async popstate)
            if (closeTopModal()) {
                return;
            }

            if (location.pathname === '/dashboard') {
                CapApp.minimizeApp();
            } else if (canGoBack) {
                navigate(-1);
            } else {
                navigate('/dashboard');
            }
        });

        return () => {
            listener.then(h => h.remove());
        };
    }, [user, location.pathname, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    // MOU gate: owners must sign MOU before accessing dashboard
    if (!skipMouCheck && user.role === 'owner' && user.mou_signed === false && location.pathname !== '/sign-mou') {
        return <Navigate to="/sign-mou" replace />;
    }

    return <>{children}</>;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify-email" element={<EmailVerificationPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/staff/setup/:invitationCode" element={<StaffSetupPage />} />

                    <Route
                        path="/sign-mou"
                        element={
                            <ProtectedRoute skipMouCheck>
                                <MOUPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/patients"
                        element={
                            <ProtectedRoute>
                                <PatientsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/staff"
                        element={
                            <ProtectedRoute>
                                <StaffPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
