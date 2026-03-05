import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { translateError } from '../i18n/errorMap';
import {
    validateRegistrationForm,
    validateOtp,
    formatPhoneDisplay,
    sanitizePhoneInput,
    sanitizeOtpInput,
    sanitizeNameInput,
    sanitizeRegNumInput,
    sanitizePasswordInput,
} from '../utils/validation';
import { StethoscopeIcon, EyeIcon, EyeOffIcon } from '../components/Icons';
import OTPInput from '../components/OTPInput';

const PersonIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
            fill="#9CA3AF"
        />
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
            fill="#9CA3AF"
        />
    </svg>
);

const DocumentIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z"
            fill="#9CA3AF"
        />
    </svg>
);

const BuildingIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H12V13H14V11H12V9H20V19ZM18 11H16V13H18V11ZM18 15H16V17H18V15Z"
            fill="#9CA3AF"
        />
    </svg>
);

const EmailIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
            fill="#9CA3AF"
        />
    </svg>
);

const LockIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z"
            fill="#9CA3AF"
        />
    </svg>
);

const PersonAddIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M15 12C17.21 12 19 10.21 19 8C19 5.79 17.21 4 15 4C12.79 4 11 5.79 11 8C11 10.21 12.79 12 15 12ZM6 10V7H4V10H1V12H4V15H6V12H9V10H6ZM15 14C12.33 14 7 15.34 7 18V20H23V18C23 15.34 17.67 14 15 14Z"
            fill="white"
        />
    </svg>
);

const ArrowRightIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="white" />
    </svg>
);

const ErrorIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
    </svg>
);

const Spinner = () => <div className="spinner" />;

// ============== ICON MAP ==============
const iconMap = {
    person: PersonIcon,
    phone: PhoneIcon,
    document: DocumentIcon,
    building: BuildingIcon,
    email: EmailIcon,
    lock: LockIcon,
};

// ============== INPUT FIELD COMPONENT (DEFINED OUTSIDE) ==============
const InputField = ({
    name,
    label,
    type = 'text',
    placeholder,
    icon,
    required = false,
    inputMode,
    autoComplete,
    value,
    onChange,
    onBlur,
    disabled,
    error,
    touched,
    t,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const IconComponent = iconMap[icon];
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    {IconComponent && <IconComponent />}
                </span>
                <input
                    type={inputType}
                    name={name}
                    inputMode={inputMode}
                    autoComplete={autoComplete}
                    className={`input-base ${isPassword ? 'pr-12' : ''} ${error && touched ? 'input-error' : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                )}
            </div>
            {error && touched && (
                <p id={`${name}-error`} className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <ErrorIcon />
                    {t(error)}
                </p>
            )}
        </div>
    );
};

// ============== REGISTER PAGE COMPONENT ==============
const RegisterPage = () => {
    const [formData, setFormData] = useState({
        doctor_name: '',
        mobile: '',
        registration_number: '',
        clinic_name: '',
        email: '',
        password: '', // NEW: optional
    });
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});

    const { register, verifyOtp, resendRegistrationOtp } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { t } = useTranslation(['auth', 'common', 'validation']);

    // Real-time validation for touched fields
    useEffect(() => {
        if (Object.keys(touched).length > 0) {
            const { errors } = validateRegistrationForm(formData);
            const newFieldErrors = {};

            Object.keys(touched).forEach((field) => {
                if (touched[field] && errors[field]) {
                    newFieldErrors[field] = errors[field];
                }
            });

            setFieldErrors(newFieldErrors);
        }
    }, [formData, touched]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let sanitizedValue = value;

        switch (name) {
            case 'doctor_name':
                sanitizedValue = sanitizeNameInput(value);
                break;
            case 'mobile':
                sanitizedValue = sanitizePhoneInput(value);
                break;
            case 'registration_number':
                sanitizedValue = sanitizeRegNumInput(value);
                break;
            case 'clinic_name':
                sanitizedValue = value;
                break;
            case 'email':
                sanitizedValue = value.toLowerCase();
                break;
            case 'password':
                sanitizedValue = sanitizePasswordInput(value);
                break;
            default:
                sanitizedValue = value;
        }

        setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const handleOtpChange = (e) => {
        const sanitized = sanitizeOtpInput(e.target.value);
        setOtp(sanitized);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const validation = validateRegistrationForm(formData);

        if (!validation.isValid) {
            setFieldErrors(validation.errors);
            setTouched({
                doctor_name: true,
                mobile: true,
                registration_number: true,
                clinic_name: true,
                email: true,
                password: true,
            });

            const firstError = Object.values(validation.errors)[0];
            toast.error(t(firstError));
            return;
        }

        setLoading(true);

        const payload = { ...validation.cleanData };
        if (!payload.clinic_name) {
            payload.clinic_name = `${payload.doctor_name}'s Clinic`;
        }

        try {
            const res = await register(payload);
            setIdentifier(res.identifier);
            setStep(2);
            setTouched({});
            setFieldErrors({});
            toast.success(t('auth:register.otpSent'));
        } catch (err) {
            let errorMessage = '';

            if (typeof err === 'object') {
                if (err.error) {
                    errorMessage = err.error;
                } else {
                    const errors = Object.entries(err).map(([field, msgs]) => {
                        const message = Array.isArray(msgs) ? msgs.join(' ') : msgs;
                        return `${field}: ${message}`;
                    });
                    if (errors.length > 0) errorMessage = errors.join('; ');
                }
            }

            toast.error(translateError(errorMessage, t));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e, otpOverride) => {
        e.preventDefault();

        const validation = validateOtp(otpOverride || otp);
        if (!validation.isValid) {
            setFieldErrors({ otp: validation.errors[0] });
            toast.error(t(validation.errors[0]));
            return;
        }

        setLoading(true);

        try {
            await verifyOtp(identifier, validation.cleanOtp);
            toast.success(t('auth:register.registrationSuccess'));
            // Redirect to email verification page if email was provided
            if (formData.email) {
                navigate('/verify-email', { state: { email: formData.email } });
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            const errorMsg = err.error || '';
            toast.error(translateError(errorMsg, t));
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);

        try {
            await resendRegistrationOtp(identifier);
            toast.success(t('auth:register.otpResent'));
        } catch (err) {
            const errorMsg = err?.error || '';
            toast.error(translateError(errorMsg, t));
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep(1);
        setOtp('');
        setFieldErrors({});
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-5 py-12 bg-gradient-to-b from-blue-50 to-slate-50 safe-top safe-bottom">
            {/* Logo Section */}
            {/* <div className="flex flex-col items-center mb-6">
                <div className="w-[80px] h-[80px] bg-gradient-to-br from-blue-400 to-primary-500 rounded-[20px] flex items-center justify-center mb-4 shadow-logo">
                    <StethoscopeIcon />
                </div>
                <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">
                    MedRefer
                </h1>
                <p className="text-[14px] text-gray-500 mt-1">
                    Doctor's Referral Management
                </p>
            </div> */}

            {/* Register Card */}
            <div className="w-full max-w-[420px] card">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-[180px] h-[180px] rounded-[22px] flex items-center justify-center mb-4">
                        <img src='/EzeeHealthLogo.png' alt='logo'></img>
                    </div>
                    <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
                        EzeeHealth BridgeCare
                    </h1>
                    {/* <p className="text-[12px] text-gray-500 mt-1 text-center">
                        {t('auth:register.subtitle')}
                    </p> */}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    {step === 1 ? t('auth:register.title') : t('auth:register.verifyMobile')}
                </h2>
                <p className="text-[15px] text-gray-400 text-center mb-6">
                    {step === 1
                        ? t('auth:register.subtitle')
                        : t('auth:register.otpSentTo', { phone: formatPhoneDisplay(identifier) })}
                </p>

                {step === 1 ? (
                    <form onSubmit={handleRegister} noValidate>
                        <InputField
                            name="doctor_name"
                            label={t('auth:register.doctorName')}
                            placeholder={t('auth:register.doctorNamePlaceholder')}
                            icon="person"
                            required
                            autoComplete="name"
                            value={formData.doctor_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            error={fieldErrors.doctor_name}
                            touched={touched.doctor_name}
                            t={t}
                        />

                        <InputField
                            name="mobile"
                            label={t('auth:register.phoneNumber')}
                            type="tel"
                            placeholder={t('auth:register.phonePlaceholder')}
                            icon="phone"
                            required
                            inputMode="tel"
                            autoComplete="tel"
                            value={formData.mobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            error={fieldErrors.mobile}
                            touched={touched.mobile}
                            t={t}
                        />

                        <InputField
                            name="registration_number"
                            label={t('auth:register.registrationNumber')}
                            placeholder={t('auth:register.regNumPlaceholder')}
                            icon="document"
                            required
                            autoComplete="off"
                            value={formData.registration_number}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            error={fieldErrors.registration_number}
                            touched={touched.registration_number}
                            t={t}
                        />

                        <InputField
                            name="clinic_name"
                            label={t('auth:register.clinicName')}
                            placeholder={t('auth:register.clinicPlaceholder')}
                            icon="building"
                            required
                            autoComplete="organization"
                            value={formData.clinic_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            error={fieldErrors.clinic_name}
                            touched={touched.clinic_name}
                            t={t}
                        />

                        <InputField
                            name="email"
                            label={t('auth:register.email')}
                            type="email"
                            placeholder={t('auth:register.emailPlaceholder')}
                            icon="email"
                            required
                            inputMode="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            error={fieldErrors.email}
                            touched={touched.email}
                            t={t}
                        />

                        <InputField
                            name="password"
                            label={t('auth:register.password')}
                            type="password"
                            placeholder={t('auth:register.passwordPlaceholder')}
                            icon="lock"
                            required
                            inputMode="text"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            error={fieldErrors.password}
                            touched={touched.password}
                            t={t}
                        />

                        <button type="submit" className="btn-primary mt-2" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner />
                                    <span>{t('auth:register.creating')}</span>
                                </>
                            ) : (
                                <>
                                    <PersonAddIcon />
                                    <span>{t('auth:register.createAccount')}</span>
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} noValidate>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2 text-center">
                                {t('auth:register.verifyMobile')}
                            </label>
                            <OTPInput
                                value={otp}
                                onChange={setOtp}
                                onComplete={(val) => { setOtp(val); handleVerifyOtp({ preventDefault: () => {} }, val); }}
                                disabled={loading}
                                error={!!fieldErrors.otp}
                            />
                            {fieldErrors.otp && (
                                <p id="otp-error" className="mt-2 text-sm text-red-500 flex items-center gap-1 justify-center">
                                    <ErrorIcon />
                                    {t(fieldErrors.otp)}
                                </p>
                            )}
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner />
                                    <span>{t('auth:register.verifying')}</span>
                                </>
                            ) : (
                                <>
                                    <span>{t('auth:register.verifyAndRegister')}</span>
                                    <ArrowRightIcon />
                                </>
                            )}
                        </button>

                        <div className="flex items-center justify-between mt-4">
                            <button
                                type="button"
                                className="text-sm text-gray-500 hover:text-primary-500 transition-colors disabled:opacity-50 cursor-pointer"
                                onClick={handleBack}
                                disabled={loading}
                            >
                                {t('auth:register.changeMobile')}
                            </button>
                            <button
                                type="button"
                                className="text-sm text-primary-500 font-medium hover:text-primary-600 transition-colors disabled:opacity-50 cursor-pointer"
                                onClick={handleResendOtp}
                                disabled={loading}
                            >
                                {t('auth:register.resendOtp')}
                            </button>
                        </div>
                    </form>
                )}

                <p className="text-[15px] text-gray-500 text-center mt-6">
                    {t('auth:register.haveAccount')}{' '}
                    <Link
                        to="/login"
                        className="text-primary-500 font-semibold no-underline hover:text-primary-600 hover:underline transition-colors"
                    >
                        {t('auth:register.signIn')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
