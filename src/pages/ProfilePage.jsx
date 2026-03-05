import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { translateError } from '../i18n/errorMap';
import LanguageSelector from '../components/LanguageSelector';


// ============== ICONS ==============
const ArrowLeftIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor" />
    </svg>
);

const EditIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor" />
    </svg>
);

const EmailIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor" />
    </svg>
);

const BuildingIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H12V13H14V11H12V9H20V19ZM18 11H16V13H18V11ZM18 15H16V17H18V15Z" fill="currentColor" />
    </svg>
);

const DocumentIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor" />
    </svg>
);

const LogoutIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor" />
    </svg>
);

const PersonIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
    </svg>
);

const SaveIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19ZM15 9H5V5H15V9Z" fill="currentColor" />
    </svg>
);

const CameraIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15.2C10.8954 15.2 10 14.3046 10 13.2C10 12.0954 10.8954 11.2 12 11.2C13.1046 11.2 14 12.0954 14 13.2C14 14.3046 13.1046 15.2 12 15.2ZM9 3L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3H9ZM12 17C9.79 17 8 15.21 8 13C8 10.79 9.79 9 12 9C14.21 9 16 10.79 16 13C16 15.21 14.21 17 12 17Z" fill="currentColor" />
    </svg>
);

// ============== HELPER FUNCTIONS ==============
const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const formatPhone = (phone, fallback) => {
    if (!phone) return fallback;
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 10) {
        return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
    }
    return phone;
};

// ============== INFO ROW COMPONENT ==============
const InfoRow = ({ icon: Icon, label, value, fallback, iconBgColor = 'bg-blue-50', iconColor = 'text-primary-500' }) => (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
        <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center ${iconColor} shrink-0`}>
            <Icon />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-400 mb-0.5">{label}</p>
            <p className="text-base font-medium text-gray-900 truncate">{value || fallback}</p>
        </div>
    </div>
);

// ============== EDIT MODAL COMPONENT ==============
const EditProfileModal = ({ user, onClose, onSave, t }) => {
    const { updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        doctor_name: user?.doctor_name || '',
        email: user?.email || '',
        registration_number: user?.registration_number || '',
        clinic: {
            name: user?.clinic?.name || ''
        }
    });
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'clinic_name') {
            setFormData(prev => ({
                ...prev,
                clinic: { ...prev.clinic, name: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                clinic: {
                    name: formData.clinic.name
                }
            };

            const updatedUser = await updateProfile(payload);
            toast.success(t('profile:clinicUpdated'));
            onSave(updatedUser);
            onClose();
        } catch (error) {
            console.error("Profile Update Error:", error);
            let errorMessage = t('profile:failedToUpdateClinic');

            if (error) {
                if (typeof error === 'string') {
                    errorMessage = error;
                } else if (error.error) {
                    errorMessage = error.error;
                } else if (error.clinic) {
                    errorMessage = typeof error.clinic === 'string' ? error.clinic : error.clinic.name || t('profile:failedToUpdateClinic');
                } else if (typeof error === 'object') {
                    const firstError = Object.values(error)[0];
                    if (Array.isArray(firstError)) {
                        errorMessage = firstError[0];
                    } else if (typeof firstError === 'object') {
                        const nestedError = Object.values(firstError)[0];
                        if (Array.isArray(nestedError)) errorMessage = nestedError[0];
                    }
                }
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden animate-slide-up">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">{t('profile:editClinicName')}</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-sm text-blue-600">
                            {t('profile:readOnlyNotice')}
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t('profile:doctorName')}
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <PersonIcon />
                            </span>
                            <input
                                type="text"
                                value={formData.doctor_name || t('profile:notProvided')}
                                className="w-full pl-14 pr-4 py-3.5 text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed"
                                disabled
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                            {t('profile:doctorNameCannotChange')}
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t('profile:emailAddress')}
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <EmailIcon />
                            </span>
                            <input
                                type="text"
                                value={formData.email || t('profile:notProvided')}
                                className="w-full pl-14 pr-4 py-3.5 text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed"
                                disabled
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                            {t('profile:emailCannotChange')}
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            {t('profile:clinicName')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500">
                                <BuildingIcon />
                            </span>
                            <input
                                type="text"
                                name="clinic_name"
                                value={formData.clinic.name}
                                onChange={handleChange}
                                className="w-full pl-14 pr-4 py-3.5 text-base text-gray-900 bg-white border border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                placeholder={t('profile:clinicPlaceholder')}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t('profile:registrationNumber')}
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <DocumentIcon />
                            </span>
                            <input
                                type="text"
                                value={formData.registration_number || t('profile:notProvided')}
                                className="w-full pl-14 pr-4 py-3.5 text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed"
                                disabled
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                            {t('profile:regNumCannotChange')}
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            {t('profile:mobileNumber')}
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <PhoneIcon />
                            </span>
                            <input
                                type="text"
                                value={formatPhone(user?.mobile, t('profile:notProvided'))}
                                className="input-base bg-gray-50 cursor-not-allowed"
                                disabled
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                            {t('profile:mobileCannotChange')}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 px-4 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            {t('common:cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3.5 px-4 bg-primary-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors disabled:opacity-70"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" />
                                    {t('profile:updating')}
                                </>
                            ) : (
                                <>
                                    <SaveIcon />
                                    {t('profile:updateClinicName')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ============== MAIN PROFILE PAGE COMPONENT ==============
const ProfilePage = () => {
    const { user, setUser, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { t } = useTranslation(['profile', 'common']);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const fileInputRef = useRef(null);

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = () => {
        if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
            toast.error(t('profile:ownerOnlyEdit'));
            return;
        }
        setShowEditModal(true);
    };

    const handleSave = (updatedUser) => {
        if (typeof setUser === 'function') {
            setUser(updatedUser);
        }
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            toast.success(t('profile:signedOut'));
            navigate('/login');
        } catch (error) {
            toast.error(t('profile:failedToSignOut'));
        } finally {
            setLoggingOut(false);
        }
    };

    const handleProfilePictureClick = () => {
        fileInputRef.current?.click();
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error(t('profile:invalidFileType'));
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error(t('profile:fileTooLarge'));
            return;
        }

        setUploadingPicture(true);

        try {
            const updatedUser = await updateProfile({ profile_picture: file });
            setUser(updatedUser);
            toast.success(t('profile:pictureUpdated'));
        } catch (error) {
            console.error('Profile picture upload error:', error);
            const errorMessage = error?.profile_picture || error?.error || t('profile:failedToUploadPicture');
            toast.error(errorMessage);
        } finally {
            setUploadingPicture(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 px-5 pt-4 pb-24 relative z-0 rounded-b-2xl">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={handleBack}
                        className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center text-white"
                    >
                        <ArrowLeftIcon />
                    </button>
                    <h1 className="text-white font-bold text-lg">{t('profile:title')}</h1>
                    <button
                        onClick={handleEdit}
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-white ${user && (user.role === 'owner' || user.role === 'admin') ? 'bg-white/20' : 'bg-white/10 cursor-not-allowed'}`}
                        title={user && (user.role === 'owner' || user.role === 'admin') ? t('profile:editClinicName') : t('profile:ownerOnlyEdit')}
                    >
                        <EditIcon />
                    </button>
                </div>

                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-28 h-28 bg-white/25 rounded-full flex items-center justify-center border-4 border-white/30 overflow-hidden">
                            {user?.profile_picture_url ? (
                                <img
                                    src={user.profile_picture_url}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-3xl font-bold">
                                    {getInitials(user?.doctor_name)}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleProfilePictureClick}
                            disabled={uploadingPicture}
                            className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={t('profile:changePhoto')}
                        >
                            {uploadingPicture ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <CameraIcon />
                            )}
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif"
                            onChange={handleProfilePictureChange}
                            className="hidden"
                        />
                    </div>
                </div>
            </div>

            {/* Profile Card */}
            <div className="px-5 -mt-12 relative z-30">
                <div className="bg-white rounded-3xl shadow-card p-6">
                    <div className="text-center mb-6 pb-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            {user?.doctor_name || t('profile:name')}
                        </h2>
                        <p className="text-gray-500">
                            {user?.clinic?.name || t('profile:clinicName')}
                        </p>
                    </div>

                    <div>
                        <InfoRow
                            icon={EmailIcon}
                            label={t('profile:email')}
                            value={user?.email}
                            fallback={t('profile:notProvided')}
                            iconBgColor="bg-blue-50"
                            iconColor="text-blue-500"
                        />
                        <InfoRow
                            icon={PhoneIcon}
                            label={t('profile:phone')}
                            value={formatPhone(user?.mobile, t('profile:notProvided'))}
                            fallback={t('profile:notProvided')}
                            iconBgColor="bg-blue-50"
                            iconColor="text-blue-500"
                        />
                        <InfoRow
                            icon={BuildingIcon}
                            label={t('profile:clinic')}
                            value={user?.clinic?.name}
                            fallback={t('profile:notProvided')}
                            iconBgColor="bg-blue-50"
                            iconColor="text-blue-500"
                        />
                        <InfoRow
                            icon={DocumentIcon}
                            label={t('profile:registrationNumber')}
                            value={user?.registration_number}
                            fallback={t('profile:notProvided')}
                            iconBgColor="bg-blue-50"
                            iconColor="text-blue-500"
                        />
                    </div>

                    {/* Language Selector */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-400 mb-3">{t('common:language')}</p>
                        <LanguageSelector />
                    </div>
                </div>

                {/* Sign Out Button */}
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full mt-4 py-4 px-6 bg-white border border-red-200 rounded-2xl flex items-center justify-center gap-2 text-red-500 font-medium hover:bg-red-50 transition-colors disabled:opacity-70"
                >
                    {loggingOut ? (
                        <>
                            <div className="w-5 h-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                            {t('profile:signingOut')}
                        </>
                    ) : (
                        <>
                            <LogoutIcon />
                            {t('common:signOut')}
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-gray-400 mt-6 mb-8">
                    {t('common:version', { version: '1.0.0' })}
                </p>
            </div>

            {showEditModal && (
                <EditProfileModal
                    user={user}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSave}
                    t={t}
                />
            )}
        </div>
    );
};

export default ProfilePage;
