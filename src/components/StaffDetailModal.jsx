import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import useModalBackHandler from '../hooks/useModalBackHandler';
import {
    validateFirstName,
    validateLastName,
    validateStaffEmail,
    validateStaffRegNumber,
    validateStaffRole,
    sanitizeStaffNameInput,
    sanitizeStaffRegNumInput,
} from '../utils/validation';

// ============== ICONS ==============
const PersonIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#4A7DFC" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor" />
    </svg>
);

const EmailIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor" />
    </svg>
);

const BadgeIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.97 20 7.57 19.18 5.86 17.12C7.55 15.8 9.68 15 12 15C14.32 15 16.45 15.8 18.14 17.12C16.43 19.18 14.03 20 12 20Z" fill="currentColor" />
    </svg>
);

const RoleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H12V13H14V11H12V9H20V19ZM18 11H16V13H18V11ZM18 15H16V17H18V15Z" fill="currentColor" />
    </svg>
);

const FinanceIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="currentColor" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" fill="currentColor" />
    </svg>
);

const ErrorIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
    </svg>
);

const CheckboxIcon = ({ checked }) => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {checked ? (
            <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.11 21 21 20.1 21 19V5C21 3.9 20.11 3 19 3ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#4A7DFC" />
        ) : (
            <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="#D1D5DB" />
        )}
    </svg>
);

const SaveIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19ZM15 9H5V5H15V9Z" fill="currentColor" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM9 12H7V10H9V12ZM13 12H11V10H13V12ZM17 12H15V10H17V12ZM9 16H7V14H9V16ZM13 16H11V14H13V16ZM17 16H15V14H17V16Z" fill="#4A7DFC" />
    </svg>
);

const EditIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor" />
    </svg>
);

const Spinner = () => <div className="spinner" />;

// ============== HELPER FUNCTIONS ==============
const formatPhone = (phone) => {
    if (!phone) return null;
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 10) {
        return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
    }
    if (clean.length > 10) {
        const last10 = clean.slice(-10);
        return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
    }
    return phone;
};

const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// ============== INFO CARD COMPONENT ==============
const InfoCard = ({ children, className = '' }) => (
    <div className={`bg-white border border-gray-100 rounded-2xl p-4 ${className}`}>
        {children}
    </div>
);

// ============== MAIN COMPONENT ==============
const StaffDetailModal = ({ staff, onClose, onUpdate }) => {
    const { t } = useTranslation(['staff', 'common']);
    const toast = useToast();
    useModalBackHandler(onClose);
    const [loading, setLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // ============== ROLE OPTIONS ==============
    const ROLE_OPTIONS = [
        { value: '', label: t('staff:selectRole') },
        { value: 'receptionist', label: t('staff:receptionist') },
        { value: 'nurse', label: t('staff:nurse') },
    ];

    // Form state - Only editable fields
    const [formData, setFormData] = useState({
        role: '',
        can_view_financial: false,
    });

    // Original data for comparison
    const [originalData, setOriginalData] = useState({});

    // Validation errors
    const [errors, setErrors] = useState({});

    // Initialize form data when staff changes
    useEffect(() => {
        if (staff) {
            const initialData = {
                role: staff.role || '',
                can_view_financial: !!staff.can_view_financial,
            };
            setFormData(initialData);
            setOriginalData(initialData);
        }
    }, [staff]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Track changes
    useEffect(() => {
        const changed = Object.keys(formData).some(
            key => formData[key] !== originalData[key]
        );
        setHasChanges(changed);
    }, [formData, originalData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user changes role
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSave = async () => {
        if (!hasChanges) {
            toast.info(t('common:noChangesToSave'));
            return;
        }

        // Validate role
        const roleValidation = validateStaffRole(formData.role);
        if (!roleValidation.isValid) {
            setErrors({ role: roleValidation.errors[0] });
            toast.error(t(roleValidation.errors[0]));
            return;
        }

        setLoading(true);

        try {
            // Only send editable fields
            const payload = {
                role: formData.role,
                can_view_financial: formData.can_view_financial,
            };

            await api.patch(`/api/staff/${staff.id}/`, payload);

            toast.success(t('staff:staffUpdated'));

            if (onUpdate) {
                onUpdate({ ...staff, ...payload });
            }

            onClose();
        } catch (error) {
            console.error("Failed to update staff", error);

            let errorMessage = t('staff:failedToUpdate');

            if (error.response?.data) {
                const data = error.response.data;

                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (typeof data === 'object') {
                    const firstError = Object.values(data)[0];
                    errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                }
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getDisplayFieldClasses = () => `
        w-full px-4 py-3.5 text-base text-gray-900 bg-gray-50
        border border-gray-200 rounded-xl
        cursor-not-allowed
    `;

    const getSelectClasses = (field) => `
        w-full px-4 py-3.5 text-base bg-white
        border ${errors[field] ? 'border-red-400' : 'border-gray-200'}
        rounded-xl outline-none transition-all duration-200
        appearance-none cursor-pointer
        focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
        disabled:bg-gray-50 disabled:cursor-not-allowed
        ${!formData[field] ? 'text-gray-400' : 'text-gray-900'}
    `;

    if (!staff) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col safe-top safe-bottom">
            {/* Header */}
            <header className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <EditIcon />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">{t('staff:staffDetails')}</h1>
                        <p className="text-sm text-gray-400">{t('staff:staffDetailsSubtitle')}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    disabled={loading}
                >
                    <CloseIcon />
                </button>
            </header>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                {/* Read-Only Information Notice */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                    <p className="text-sm text-blue-600">
                        {t('staff:readOnlyNote')}
                    </p>
                </div>

                {/* Name Fields - Read Only */}
                <InfoCard className="bg-gray-50">
                    <p className="text-sm text-gray-400 mb-3">{t('staff:personalInfo')}</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                {t('staff:firstName')}
                            </label>
                            <input
                                type="text"
                                value={staff.first_name || t('staff:notProvided')}
                                className={getDisplayFieldClasses()}
                                disabled
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                {t('staff:lastName')}
                            </label>
                            <input
                                type="text"
                                value={staff.last_name || t('staff:notProvided')}
                                className={getDisplayFieldClasses()}
                                disabled
                            />
                        </div>
                    </div>
                </InfoCard>

                {/* Mobile - Read Only */}
                <InfoCard className="bg-gray-50">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <PhoneIcon />
                        {t('staff:mobileNumber')}
                    </label>
                    <input
                        type="tel"
                        value={formatPhone(staff.mobile) || t('staff:notProvided')}
                        className={getDisplayFieldClasses()}
                        disabled
                    />
                </InfoCard>

                {/* Email - Read Only */}
                <InfoCard className="bg-gray-50">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <EmailIcon />
                        {t('staff:emailAddress')}
                    </label>
                    <input
                        type="email"
                        value={staff.email || t('staff:notProvided')}
                        className={getDisplayFieldClasses()}
                        disabled
                    />
                </InfoCard>

                {/* Registration Number - Read Only */}
                <InfoCard className="bg-gray-50">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <BadgeIcon />
                        {t('staff:registrationNumber')}
                    </label>
                    <input
                        type="text"
                        value={staff.registration_number || t('staff:notProvided')}
                        className={getDisplayFieldClasses()}
                        disabled
                    />
                </InfoCard>

                {/* Role - Editable */}
                <InfoCard>
                    <p className="text-sm text-gray-400 mb-3">{t('staff:editableSettings')}</p>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <RoleIcon />
                        {t('staff:role')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={getSelectClasses('role')}
                            disabled={loading}
                        >
                            {ROLE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                    {errors.role && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <ErrorIcon />
                            {t(errors.role)}
                        </p>
                    )}
                </InfoCard>

                {/* Financial Access Toggle */}
                <InfoCard>
                    <div
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors
                            ${formData.can_view_financial
                                ? 'bg-amber-50 border-amber-200'
                                : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                            }
                            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !loading && setFormData(prev => ({
                            ...prev,
                            can_view_financial: !prev.can_view_financial
                        }))}
                    >
                        <div className="shrink-0 mt-0.5">
                            <CheckboxIcon checked={formData.can_view_financial} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className={formData.can_view_financial ? 'text-amber-600' : 'text-amber-500'}>
                                    <FinanceIcon />
                                </span>
                                <span className="font-semibold text-gray-900">{t('staff:financialAccess')}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {t('staff:canViewRevenue')}
                            </p>
                        </div>
                    </div>
                </InfoCard>

                {/* Created At - Read Only */}
                {staff.created_at && (
                    <InfoCard className="bg-gray-50">
                        <div className="flex items-center gap-3">
                            <CalendarIcon />
                            <div>
                                <p className="text-sm text-gray-400">{t('staff:memberSince')}</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {formatDateTime(staff.created_at)}
                                </p>
                            </div>
                        </div>
                    </InfoCard>
                )}

                {/* Staff ID - Read Only */}
                <InfoCard className="bg-gray-50">
                    <div className="flex items-center gap-3">
                        <BadgeIcon />
                        <div>
                            <p className="text-sm text-gray-400">{t('staff:staffId')}</p>
                            <p className="text-base font-semibold text-gray-900">
                                #{staff.id}
                            </p>
                        </div>
                    </div>
                </InfoCard>
            </div>

            {/* Footer - Fixed Button */}
            <footer className="px-5 py-4 border-t border-gray-100 shrink-0 bg-white">
                <button
                    onClick={handleSave}
                    className={`w-full py-4 px-6 text-white text-base font-semibold rounded-xl
                             flex items-center justify-center gap-2
                             transition-all shadow-button
                             ${hasChanges
                                 ? 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700'
                                 : 'bg-gray-300 cursor-not-allowed'
                             }
                             disabled:opacity-70 disabled:cursor-not-allowed`}
                    disabled={loading || !hasChanges}
                >
                    {loading ? (
                        <>
                            <Spinner />
                            {t('staff:saving')}
                        </>
                    ) : (
                        <>
                            <SaveIcon />
                            {t('staff:saveChanges')}
                        </>
                    )}
                </button>
            </footer>
        </div>
    );
};

export default StaffDetailModal;
