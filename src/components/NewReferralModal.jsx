import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import {
    validateReferralForm,
    validatePatientName,
    validateGender,
    validateAge,
    validatePatientPhone,
    sanitizePatientNameInput,
    sanitizeAgeInput,
    sanitizePatientPhoneInput,
} from '../utils/validation';

// ============== ICONS ==============
const DocumentIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="#4A7DFC" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
    </svg>
);

const PersonIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
    </svg>
);

const GenderIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 9C10.29 9 11.5 9.41 12.47 10.11L17.58 5H13V3H21V11H19V6.41L13.89 11.53C14.59 12.5 15 13.71 15 15C15 18.31 12.31 21 9 21C5.69 21 3 18.31 3 15C3 11.69 5.69 9 9 9ZM9 19C11.21 19 13 17.21 13 15C13 12.79 11.21 11 9 11C6.79 11 5 12.79 5 15C5 17.21 6.79 19 9 19Z" fill="currentColor" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor" />
    </svg>
);

const HospitalIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3H5C3.9 3 3.01 3.9 3.01 5L3 19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM18 14H14V18H10V14H6V10H10V6H14V10H18V14Z" fill="currentColor" />
    </svg>
);

const DiagnosisIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-stethoscope w-3 h-3"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>
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


const Spinner = () => <div className="spinner" />;

// ============== OPTIONS ==============
const getGenderOptions = (t) => [
    { value: '', label: t('patients:selectGender') },
    { value: 'male', label: t('common:male') },
    { value: 'female', label: t('common:female') },
    { value: 'other', label: t('common:other') },
];

// ============== FORM FIELD COMPONENT ==============
const FormField = ({
    label,
    icon: Icon,
    children,
    error,
    touched,
    required = false,
    t,
}) => (
    <div className="mb-5">
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
                {t ? t(error) : error}
            </p>
        )}
    </div>
);

// ============== MAIN COMPONENT ==============
const NewReferralModal = ({ onClose }) => {
    const { t } = useTranslation(['patients', 'common']);
    const toast = useToast();
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        age: '',
        phone: '',
        hospital: '',
        diagnosis: '',
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);

    // Prevent body scroll when modal is open
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

            // Validate only touched fields
            if (touched.name && formData.name) {
                const validation = validatePatientName(formData.name);
                if (!validation.isValid) {
                    newErrors.name = validation.errors[0];
                }
            }

            if (touched.gender && formData.gender) {
                const validation = validateGender(formData.gender);
                if (!validation.isValid) {
                    newErrors.gender = validation.errors[0];
                }
            }

            if (touched.age && formData.age) {
                const validation = validateAge(formData.age);
                if (!validation.isValid) {
                    newErrors.age = validation.errors[0];
                }
            }

            if (touched.phone && formData.phone) {
                const validation = validatePatientPhone(formData.phone);
                if (!validation.isValid) {
                    newErrors.phone = validation.errors[0];
                }
            }

            setErrors(newErrors);
        }
    }, [formData, touched]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let sanitizedValue = value;

        // Sanitize input based on field type
        switch (name) {
            case 'name':
                sanitizedValue = sanitizePatientNameInput(value);
                break;
            case 'age':
                sanitizedValue = sanitizeAgeInput(value);
                break;
            case 'phone':
                sanitizedValue = sanitizePatientPhoneInput(value);
                break;
            default:
                sanitizedValue = value;
        }

        setFormData(prev => ({ ...prev, [name]: sanitizedValue }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const validation = validateReferralForm(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            setTouched({
                name: true,
                gender: true,
                age: true,
                phone: true,
                hospital: true,
                diagnosis: true,
            });

            // Show first error in toast
            const firstError = Object.values(validation.errors)[0];
            toast.error(t(firstError));
            return;
        }

        setLoading(true);

        try {
            // Prepare payload with clean data
            const payload = {
                name: validation.cleanData.name,
                gender: validation.cleanData.gender,
                age: validation.cleanData.age,
                phone: validation.cleanData.phone,
                suggested_specialty: validation.cleanData.hospital,
                diagnosis: validation.cleanData.diagnosis,
            };

            await api.post('/api/patients/', payload);
            toast.success(t('patients:referralCreated'));
            onClose();
        } catch (error) {
            console.error("Failed to create referral", error);

            // Handle API errors
            let errorMessage = t('patients:failedToCreateReferral');

            if (error.response?.data) {
                const data = error.response.data;
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (data.message) {
                    errorMessage = data.message;
                } else if (typeof data === 'object') {
                    // Handle field-specific errors from API
                    const fieldErrors = {};
                    Object.entries(data).forEach(([field, msgs]) => {
                        const message = Array.isArray(msgs) ? msgs[0] : msgs;
                        fieldErrors[field] = message;
                    });
                    if (Object.keys(fieldErrors).length > 0) {
                        setErrors(prev => ({ ...prev, ...fieldErrors }));
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
                    <DocumentIcon />
                    <h1 className="text-lg font-bold text-gray-900">{t('patients:newReferral')}</h1>
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
                <form id="referral-form" onSubmit={handleSubmit} noValidate>
                    {/* Patient Name */}
                    <FormField
                        label={t('patients:patientName')}
                        icon={PersonIcon}
                        error={errors.name}
                        touched={touched.name}
                        required
                        t={t}
                    >
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={() => handleBlur('name')}
                            className={getInputClasses('name')}
                            placeholder={t('patients:fullNamePlaceholder')}
                            disabled={loading}
                            autoComplete="name"
                        />
                    </FormField>

                    {/* Gender & Age Row */}
                    <div className="flex gap-4 mb-5">
                        {/* Gender */}
                        <div className="flex-1">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <span className="text-gray-400">
                                    <GenderIcon />
                                </span>
                                {t('patients:gender')}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('gender')}
                                    className={getSelectClasses('gender')}
                                    disabled={loading}
                                >
                                    {getGenderOptions(t).map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                            {errors.gender && touched.gender && (
                                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                    <ErrorIcon />
                                    {t(errors.gender)}
                                </p>
                            )}
                        </div>

                        {/* Age */}
                        <div className="w-28">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('patients:age')}
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                onBlur={() => handleBlur('age')}
                                className={getInputClasses('age')}
                                placeholder={t('patients:agePlaceholder')}
                                disabled={loading}
                            />
                            {errors.age && touched.age && (
                                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                    <ErrorIcon />
                                    {t(errors.age)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Phone */}
                    <FormField
                        label={t('patients:phone')}
                        icon={PhoneIcon}
                        error={errors.phone}
                        touched={touched.phone}
                        required
                        t={t}
                    >
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={() => handleBlur('phone')}
                            className={getInputClasses('phone')}
                            placeholder={t('patients:phonePlaceholder')}
                            inputMode="tel"
                            disabled={loading}
                            autoComplete="tel"
                        />
                    </FormField>

                    {/* Hospital / SSH */}
                    <FormField
                        label={t('patients:suggestedHospital')}
                        icon={HospitalIcon}
                        error={errors.hospital}
                        touched={touched.hospital}
                        t={t}
                    >
                        <input
                            type="text"
                            name="hospital"
                            value={formData.hospital}
                            onChange={handleChange}
                            onBlur={() => handleBlur('hospital')}
                            className={getInputClasses('hospital')}
                            placeholder={t('patients:suggestedHospitalPlaceholder')}
                            disabled={loading}
                        />
                    </FormField>

                    {/* Primary Diagnosis */}
                    <FormField
                        label={t('patients:primaryDiagnosis')}
                        icon={DiagnosisIcon}
                        error={errors.diagnosis}
                        touched={touched.diagnosis}
                        t={t}
                    >
                        <textarea
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            onBlur={() => handleBlur('diagnosis')}
                            className={`${getInputClasses('diagnosis')} resize-none`}
                            placeholder={t('patients:diagnosisPlaceholder')}
                            rows={4}
                            disabled={loading}
                            maxLength={500}
                        />
                        <p className="mt-1 text-xs text-gray-400 text-right">
                            {formData.diagnosis.length}/500
                        </p>
                    </FormField>
                </form>
            </div>

            {/* Footer - Fixed Button */}
            <footer className="px-5 py-4 border-t border-gray-100 shrink-0 bg-white">
                <button
                    type="submit"
                    form="referral-form"
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
                            {t('patients:creating')}
                        </>
                    ) : (
                        t('patients:createReferral')
                    )}
                </button>
            </footer>
        </div>
    );
};

export default NewReferralModal;