import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    // ========================
    // CHECK EXISTING SESSION
    // ========================
    const checkAuth = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const res = await api.get('/api/auth/me/');
                setUser(res.data);
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    };

    // ========================
    // LOGIN (PASSWORD + OTP REQUEST)
    // ========================
    const login = async (identifier, password) => {
        try {
            const res = await api.post('/api/auth/request-otp/', {
                identifier,
                password,
            });

            const data = res.data;

            // If backend directly logged user in (2FA disabled)
            if (data.access && data.refresh) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                setUser(data.user);
            }

            return data; // Contains either tokens OR 2fa_required flag
        } catch (error) {
            throw error.response?.data || { error: 'Login failed' };
        }
    };

    // ========================
    // VERIFY OTP (SECOND FACTOR)
    // ========================
    const verifyOtp = async (identifier, otp) => {
        try {
            const res = await api.post('/api/auth/verify-otp/', {
                identifier,
                otp,
            });

            const { access, refresh, user } = res.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            setUser(user);
            return user;
        } catch (error) {
            throw error.response?.data || { error: 'Verification failed' };
        }
    };

    // ========================
    // REGISTER (OPTIONAL PASSWORD SUPPORTED)
    // ========================
    const register = async (data) => {
        try {
            const res = await api.post('/api/auth/register/', data);
            return res.data;
        } catch (error) {
            console.log("here")
            throw error.response?.data || { error: 'Registration failed' };
        }
    };

    // ========================
    // RESEND REGISTRATION OTP
    // ========================
    const resendRegistrationOtp = async (identifier) => {
        try {
            const res = await api.post('/api/auth/resend-registration-otp/', { identifier });
            return res.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to resend OTP' };
        }
    };

    // ========================
    // LOGOUT
    // ========================
    // ========================
    // EMAIL VERIFICATION
    // ========================
    const verifyEmail = async (email, code) => {
        try {
            const res = await api.post('/api/auth/verify-email/', {
                email,
                code,
            });
            return res.data;
        } catch (error) {
            throw error.response?.data || { error: 'Email verification failed' };
        }
    };

    const resendEmailVerification = async (email) => {
        try {
            const res = await api.post('/api/auth/resend-email-verification/', {
                email,
            });
            return res.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to resend verification code' };
        }
    };

    // ========================
    // PASSWORD RESET
    // ========================
    const forgotPassword = async (email) => {
        try {
            const res = await api.post('/api/auth/forgot-password/', {
                email,
            });
            return res.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to send reset code' };
        }
    };

    const resetPassword = async (email, code, new_password) => {
        try {
            const res = await api.post('/api/auth/reset-password/', {
                email,
                code,
                new_password,
            });
            return res.data;
        } catch (error) {
            throw error.response?.data || { error: 'Password reset failed' };
        }
    };

    // ========================
    // STAFF INVITATION
    // ========================
    const verifyInvitation = async (invitationCode) => {
        try {
            const res = await api.post('/api/auth/verify-invitation/', {
                invitation_code: invitationCode,
            });
            return res.data;
        } catch (error) {
            throw error.response?.data || { error: 'Invalid invitation code' };
        }
    };

    const setupStaffAccount = async (invitationCode, password) => {
        try {
            const res = await api.post('/api/auth/staff/setup-account/', {
                invitation_code: invitationCode,
                password,
            });
            return res.data; // Contains otp_required and identifier
        } catch (error) {
            throw error.response?.data || { error: 'Account setup failed' };
        }
    };

    // ========================
    // SIGN MOU
    // ========================
    const signMOU = async (data) => {
        try {
            const res = await api.post('/api/auth/sign-mou/', data);
            // Update local user state with mou_signed = true
            setUser((prev) => prev ? { ...prev, mou_signed: true } : prev);
            return res.data;
        } catch (error) {
            throw error.response?.data || { error: 'MOU signing failed' };
        }
    };

    // ========================
    // UPDATE PROFILE
    // ========================
    const updateProfile = async (data) => {
        try {
            // Check if we have a profile_picture File object
            const hasFile = data.profile_picture instanceof File;

            let payload;
            let headers = {};

            if (hasFile) {
                // Build FormData for multipart/form-data
                payload = new FormData();

                // Add the file
                payload.append('profile_picture', data.profile_picture);

                // Add other fields
                Object.keys(data).forEach(key => {
                    if (key !== 'profile_picture') {
                        if (key === 'clinic' && typeof data[key] === 'object') {
                            // Serialize clinic object as individual form fields
                            Object.keys(data.clinic).forEach(clinicKey => {
                                payload.append(`clinic[${clinicKey}]`, data.clinic[clinicKey]);
                            });
                        } else {
                            payload.append(key, data[key]);
                        }
                    }
                });

                // Let axios set the Content-Type with boundary
                headers['Content-Type'] = 'multipart/form-data';
            } else {
                // Standard JSON payload
                payload = data;
                headers['Content-Type'] = 'application/json';
            }

            const res = await api.patch('/api/auth/me/', payload, { headers });

            // Update local user state
            setUser(res.data);

            return res.data;
        } catch (error) {
            throw error.response?.data || { error: 'Profile update failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                verifyOtp,
                register,
                logout,
                loading,
                verifyEmail,
                resendEmailVerification,
                forgotPassword,
                resetPassword,
                resendRegistrationOtp,
                verifyInvitation,
                setupStaffAccount,
                updateProfile,
                signMOU,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
