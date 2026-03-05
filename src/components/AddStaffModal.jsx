import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import useModalBackHandler from '../hooks/useModalBackHandler';
import {
    validateStaffForm,
    validateFirstName,
    validateLastName,
    validateStaffMobile,
    validateStaffEmail,
    validateStaffRegNumber,
    validateStaffRole,
    sanitizeStaffNameInput,
    sanitizeStaffMobileInput,
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
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" />
        <path d="M12 6C9.79 6 8 7.79 8 10H10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C11.45 12 11 12.45 11 13V15H13V13.83C14.72 13.41 16 11.86 16 10C16 7.79 14.21 6 12 6Z" fill="currentColor" />
        <circle cx="12" cy="18" r="1" fill="currentColor" />
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

const Spinner = () => <div className="spinner" />;

// ============== FORM FIELD COMPONENT ==============
const FormField = ({
    label,
    icon: Icon,
    children,
    error,
    touched,
    required = false,
    helperText,
}) => (
    <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            {Icon && (
                <span className="text-gray-400">
                    <Icon />
                </span>
            )}
            {label}
            {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && touched && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                <ErrorIcon />
                {error}
            </p>
        )}
        {helperText && !error && (
            <p className="mt-1.5 text-xs text-gray-400">{helperText}</p>
        )}
    </div>
);

// ============== MAIN COMPONENT ==============
const AddStaffModal = ({ onClose, onSuccess, editData = null }) => {
    const { t } = useTranslation(['staff', 'common']);
    const toast = useToast();
    useModalBackHandler(onClose);
    const isEdit = !!editData;

    // ============== ROLE OPTIONS ==============
    // *** Keep UI consistent with backend: only receptionist & nurse (backend restricts role)
    const ROLE_OPTIONS = [
        { value: '', label: t('staff:selectRole') },
        { value: 'receptionist', label: t('staff:receptionist') },
        { value: 'nurse', label: t('staff:nurse') },
        { value: 'other', label: t('staff:other') },
    ];

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        mobile: '',
        email: '',
        registration_number: '',
        role: '',
        can_view_financial: false,
    });
    const [customRole, setCustomRole] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);

    // Populate form if editing
    useEffect(() => {
        if (editData) {
            setFormData(prev => ({
                ...prev,
                first_name: editData.first_name || '',
                last_name: editData.last_name || '',
                mobile: editData.mobile || '',
                email: editData.email || '',
                registration_number: editData.registration_number || '',
                role: editData.role || '',
                can_view_financial: editData.can_view_financial || false,
            }));
            if (editData.role === 'other' && editData.custom_role) {
                setCustomRole(editData.custom_role);
            }
        }
    }, [editData]);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Real-time validation for touched fields
    useEffect(() => {
        if (Object.keys(touched).length > 0) {
            const newErrors = {};

            if (touched.first_name) {
                const validation = validateFirstName(formData.first_name);
                if (!validation.isValid) newErrors.first_name = validation.errors[0];
            }

            if (touched.last_name) {
                const validation = validateLastName(formData.last_name);
                if (!validation.isValid) newErrors.last_name = validation.errors[0];
            }

            if (touched.mobile && !isEdit) {
                const validation = validateStaffMobile(formData.mobile, true);
                if (!validation.isValid) newErrors.mobile = validation.errors[0];
            }

            if (touched.email) {
                const validation = validateStaffEmail(formData.email, !isEdit);
                if (!validation.isValid) newErrors.email = validation.errors[0];
            }

            if (touched.registration_number && formData.registration_number) {
                const validation = validateStaffRegNumber(formData.registration_number);
                if (!validation.isValid) newErrors.registration_number = validation.errors[0];
            }

            if (touched.role) {
                const validation = validateStaffRole(formData.role);
                if (!validation.isValid) newErrors.role = validation.errors[0];
            }

            setErrors(newErrors);
        }
    }, [formData, touched, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let sanitizedValue = value;

        switch (name) {
            case 'first_name':
            case 'last_name':
                sanitizedValue = sanitizeStaffNameInput(value);
                break;
            case 'mobile':
                sanitizedValue = sanitizeStaffMobileInput(value);
                break;
            case 'registration_number':
                sanitizedValue = sanitizeStaffRegNumInput(value);
                break;
            case 'email':
                sanitizedValue = value.toLowerCase();
                break;
            default:
                sanitizedValue = type === 'checkbox' ? checked : value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : sanitizedValue,
        }));

        // Clear custom role when switching away from "other"
        if (name === 'role' && sanitizedValue !== 'other') {
            setCustomRole('');
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields with existing validator
        const validation = validateStaffForm(formData, isEdit);

        if (!validation.isValid) {
            setErrors(validation.errors);
            setTouched({
                first_name: true,
                last_name: true,
                mobile: true,
                email: true,
                registration_number: true,
                role: true,
            });

            const firstError = Object.values(validation.errors)[0];
            toast.error(t(firstError));
            return;
        }

        if (formData.role === 'other' && !customRole.trim()) {
            setErrors(prev => ({ ...prev, customRole: t('staff:specifyRole') }));
            toast.error(t('staff:specifyRole'));
            return;
        }

        setLoading(true);

        try {
            // Use clean data from validation
            const payload = { ...validation.cleanData };
            if (formData.role === 'other' && customRole.trim()) {
                payload.custom_role = customRole.trim();
            }

            // safety: ensure mobile is digits-only before sending
            if (payload.mobile) payload.mobile = payload.mobile.replace(/\D/g, '');

            if (isEdit) {
                await api.patch(`/api/staff/${editData.id}/`, payload);
                toast.success(t('staff:staffUpdated'));
            } else {
                await api.post('/api/staff/', payload);
                toast.success(t('staff:invitationSent'));
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving staff:", error);

            let errorMessage = t('staff:failedToSave');

            if (error.response?.data) {
                const data = error.response.data;

                // Handle common shapes of DRF errors
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else if (data.non_field_errors) {
                    errorMessage = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (typeof data === 'object') {
                    // Field-specific errors
                    const fieldErrors = {};
                    Object.entries(data).forEach(([field, msgs]) => {
                        const message = Array.isArray(msgs) ? msgs[0] : msgs;
                        fieldErrors[field] = message;
                    });
                    if (Object.keys(fieldErrors).length > 0) {
                        setErrors(prev => ({ ...prev, ...fieldErrors }));
                        setTouched(prev => {
                            const newTouched = { ...prev };
                            Object.keys(fieldErrors).forEach(field => {
                                newTouched[field] = true;
                            });
                            return newTouched;
                        });
                        errorMessage = Object.values(fieldErrors)[0];
                    }
                }
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getInputClasses = (field) => `
        w-full px-4 py-3.5 text-base text-gray-900 bg-white
        border ${errors[field] && touched[field] ? 'border-red-400' : 'border-gray-200'}
        rounded-xl outline-none transition-all duration-200
        placeholder:text-gray-400
        focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
        disabled:bg-gray-50 disabled:cursor-not-allowed
    `;

    const getSelectClasses = (field) => `
        w-full px-4 py-3.5 text-base bg-white
        border ${errors[field] && touched[field] ? 'border-red-400' : 'border-gray-200'}
        rounded-xl outline-none transition-all duration-200
        appearance-none cursor-pointer
        focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
        disabled:bg-gray-50 disabled:cursor-not-allowed
        ${!formData[field] ? 'text-gray-400' : 'text-gray-900'}
    `;

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col safe-top safe-bottom">
            {/* Header */}
            <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                    <PersonIcon />
                    <h1 className="text-lg font-bold text-gray-900">
                        {isEdit ? t('staff:editStaff') : t('staff:addStaff')}
                    </h1>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    disabled={loading}
                >
                    <CloseIcon />
                </button>
            </header>

            {/* Form Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-6">
                <form id="staff-form" onSubmit={handleSubmit} noValidate>
                    {/* First Name & Last Name Row */}
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('staff:firstName')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                onBlur={() => handleBlur('first_name')}
                                className={getInputClasses('first_name')}
                                placeholder={t('staff:firstNamePlaceholder')}
                                disabled={loading}
                                autoComplete="given-name"
                                maxLength={50}
                            />
                            {errors.first_name && touched.first_name && (
                                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                    <ErrorIcon />
                                    {t(errors.first_name)}
                                </p>
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('staff:lastName')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                onBlur={() => handleBlur('last_name')}
                                className={getInputClasses('last_name')}
                                placeholder={t('staff:lastNamePlaceholder')}
                                disabled={loading}
                                autoComplete="family-name"
                                maxLength={50}
                            />
                            {errors.last_name && touched.last_name && (
                                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                    <ErrorIcon />
                                    {t(errors.last_name)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="mb-4">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <PhoneIcon />
                            {t('staff:mobile')} { !isEdit && <span className="text-red-500">*</span> }
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            onBlur={() => handleBlur('mobile')}
                            className={getInputClasses('mobile')}
                            placeholder={t('staff:mobilePlaceholder')}
                            inputMode="tel"
                            disabled={loading || isEdit}
                            autoComplete="tel"
                        />
                        {errors.mobile && touched.mobile && (
                            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                <ErrorIcon />
                                {t(errors.mobile)}
                            </p>
                        )}
                        {isEdit && <p className="mt-1.5 text-xs text-gray-400">{t('staff:mobileCannotChange')}</p>}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <EmailIcon />
                            {t('staff:email')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur('email')}
                            className={getInputClasses('email')}
                            placeholder={t('staff:emailPlaceholder')}
                            inputMode="email"
                            disabled={loading}
                            autoComplete="email"
                            maxLength={100}
                        />
                        {errors.email && touched.email && (
                            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                <ErrorIcon />
                                {t(errors.email)}
                            </p>
                        )}
                        {!isEdit && (
                            <p className="mt-1.5 text-sm text-blue-600 flex items-center gap-1">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
                                </svg>
                                {t('staff:invitationNote')}
                            </p>
                        )}
                    </div>

                    {/* Registration Number */}
                    <div className="mb-4">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <BadgeIcon />
                            {t('staff:registrationNumber')}
                        </label>
                        <input
                            type="text"
                            name="registration_number"
                            value={formData.registration_number}
                            onChange={handleChange}
                            onBlur={() => handleBlur('registration_number')}
                            className={getInputClasses('registration_number')}
                            placeholder={t('staff:regNumPlaceholder')}
                            disabled={loading}
                            maxLength={30}
                        />
                        {errors.registration_number && touched.registration_number && (
                            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                <ErrorIcon />
                                {t(errors.registration_number)}
                            </p>
                        )}
                    </div>

                    {/* Role */}
                    <div className="mb-4">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <RoleIcon />
                            {t('staff:role')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                onBlur={() => handleBlur('role')}
                                className={getSelectClasses('role')}
                                disabled={loading}
                            >
                                {ROLE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                        {errors.role && touched.role && (
                            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                <ErrorIcon />
                                {t(errors.role)}
                            </p>
                        )}
                        {formData.role === 'other' && (
                            <input
                                type="text"
                                value={customRole}
                                onChange={(e) => setCustomRole(e.target.value)}
                                className={`${getInputClasses('customRole')} mt-2`}
                                placeholder={t('staff:enterRoleTitle')}
                                disabled={loading}
                                maxLength={50}
                            />
                        )}
                    </div>

                    {/* Financial Access Checkbox */}
                    <div
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors mb-4
                            ${formData.can_view_financial
                                ? 'bg-amber-50 border-amber-200'
                                : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                            }`}
                        onClick={() => !loading && setFormData(prev => ({ ...prev, can_view_financial: !prev.can_view_financial }))}
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
                </form>
            </div>

            {/* Footer - Fixed Button */}
            <footer className="px-5 py-4 border-t border-gray-100 shrink-0 bg-white">
                <button
                    type="submit"
                    form="staff-form"
                    className="w-full py-4 px-6 bg-primary-500 text-white text-base font-semibold rounded-xl
                             flex items-center justify-center gap-2
                             hover:bg-primary-600 active:bg-primary-700
                             disabled:opacity-70 disabled:cursor-not-allowed
                             transition-colors shadow-button"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner />
                            {isEdit ? t('staff:saving') : t('staff:adding')}
                        </>
                    ) : (
                        isEdit ? t('staff:saveChanges') : t('staff:addStaffMember')
                    )}
                </button>
            </footer>
        </div>
    );
};

export default AddStaffModal;
