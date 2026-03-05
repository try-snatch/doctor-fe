// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { translateError } from '../i18n/errorMap';
import LanguageSelector from '../components/LanguageSelector';
import {
    validatePhone,
    validateOtp,
    validatePassword,
    validateEmailOrPhone,
    formatPhoneDisplay,
    sanitizePhoneInput,
    sanitizeOtpInput,
    sanitizePasswordInput,
} from '../utils/validation';
import { StethoscopeIcon, PhoneIcon, LockIcon, ArrowRightIcon, ErrorIcon, EyeIcon, EyeOffIcon } from '../components/Icons';
import OTPInput from '../components/OTPInput';

const Spinner = () => <div className="spinner" />;

const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submittedIdentifier, setSubmittedIdentifier] = useState(null); // cleaned phone used for OTP flow
    const [showPassword, setShowPassword] = useState(false);

    const { login, verifyOtp } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { t } = useTranslation(['auth', 'common', 'validation']);

    useEffect(() => {
        if (touched.identifier && identifier) {
            const { isValid, errors } = validateEmailOrPhone(identifier);
            setFieldErrors((prev) => ({
                ...prev,
                identifier: isValid ? null : errors[0],
            }));
        }
    }, [identifier, touched.identifier]);

    useEffect(() => {
        if (touched.password && password) {
            const { isValid, errors } = validatePassword(password);
            setFieldErrors((prev) => ({
                ...prev,
                password: isValid ? null : errors[0],
            }));
        }
    }, [password, touched.password]);

    useEffect(() => {
        if (touched.otp && otp) {
            const { isValid, errors } = validateOtp(otp);
            setFieldErrors((prev) => ({
                ...prev,
                otp: isValid ? null : errors[0],
            }));
        }
    }, [otp, touched.otp]);

    const handlePhoneChange = (e) => {
        const sanitized = sanitizePhoneInput(e.target.value);
        setIdentifier(sanitized);
    };

    const handlePasswordChange = (e) => {
        const sanitized = sanitizePasswordInput(e.target.value);
        setPassword(sanitized);
    };

    const handleOtpChange = (e) => {
        const sanitized = sanitizeOtpInput(e.target.value);
        setOtp(sanitized);
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleRequestOtp = async (e) => {
        e.preventDefault();

        // Validate email or phone
        const identifierValidation = validateEmailOrPhone(identifier);
        if (!identifierValidation.isValid) {
            setFieldErrors({ identifier: identifierValidation.errors[0] });
            setTouched((p) => ({ ...p, identifier: true }));
            toast.error(t(identifierValidation.errors[0]));
            return;
        }

        // Validate password (first factor) - required now
        const passValidation = validatePassword(password);
        if (!passValidation.isValid) {
            setFieldErrors((prev) => ({ ...prev, password: passValidation.errors[0] }));
            setTouched((p) => ({ ...p, password: true }));
            toast.error(t(passValidation.errors[0]));
            return;
        }

        setLoading(true);

        try {
            // login() will request OTP if user has 2FA enabled (backend)
            // Use cleanEmail if email, cleanPhone if phone
            const cleanIdentifier = identifierValidation.cleanEmail || identifierValidation.cleanPhone || identifier.trim();
            const res = await login(cleanIdentifier, password);
            // If backend responded with 2fa_required, show step 2.
            if (res && res['2fa_required']) {
                setSubmittedIdentifier(res.identifier || cleanIdentifier);
                setStep(2);
                setTouched({});
                setFieldErrors({});
                toast.success(t('auth:login.otpSentSuccess'));
            } else if (res && res['access']) {
                // In case backend issued tokens (2FA not enabled for user)
                toast.success(t('auth:login.loginSuccess'));
                navigate('/dashboard');
            } else {
                // Fallback success path
                setSubmittedIdentifier(res.identifier || cleanIdentifier);
                setStep(2);
                toast.success(t('auth:login.otpSentSuccess'));
            }
        } catch (err) {
            const errorMsg = err?.error || err?.message || '';
            toast.error(translateError(errorMsg, t));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e, otpOverride) => {
        e.preventDefault();

        const validation = validateOtp(otpOverride || otp);
        if (!validation.isValid) {
            setFieldErrors({ otp: validation.errors[0] });
            setTouched({ otp: true });
            toast.error(t(validation.errors[0]));
            return;
        }

        if (!submittedIdentifier) {
            toast.error(t('common:errors.defaultError'));
            setStep(1);
            return;
        }

        setLoading(true);

        try {
            await verifyOtp(submittedIdentifier, validation.cleanOtp);
            toast.success(t('auth:login.loginSuccess'));
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err?.error || err?.message || '';
            toast.error(translateError(errorMsg, t));
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        // Resend requires first-factor (password). We kept password in state from step 1.
        const phoneValidation = validatePhone(identifier || submittedIdentifier || '');
        const passValidation = validatePassword(password || '');

        if (!phoneValidation.isValid) {
            toast.error(t(phoneValidation.errors[0]));
            setStep(1);
            return;
        }
        if (!passValidation.isValid) {
            toast.error(t(passValidation.errors[0]));
            setStep(1);
            return;
        }

        setLoading(true);
        try {
            await login(phoneValidation.cleanPhone, password);
            toast.success(t('auth:login.otpResent'));
        } catch (err) {
            const errorMsg = err?.error || err?.message || '';
            toast.error(translateError(errorMsg, t));
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep(1);
        setOtp('');
        setFieldErrors({});
        setTouched({});
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-5 py-36 bg-gradient-to-b from-blue-50 to-slate-50 safe-top safe-bottom">
            {/* Language Selector - top right */}
            <div className="absolute top-4 right-4">
                <LanguageSelector />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-[400px] card shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-[180px] h-[180px] rounded-[22px] flex items-center justify-center mb-4">
                        <img src='/EzeeHealthLogo.png' alt='logo'></img>
                    </div>
                    <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
                        {t('auth:login.title')}
                    </h1>
                    {/* <p className="text-[12px] text-gray-500 mt-1 text-center">
                        {t('auth:login.subtitle')}
                    </p> */}
                </div>

                <p className="text-[15px] text-gray-400 text-center mb-7">
                    {step === 1 ? t('auth:login.signIn') : t('auth:login.enterOtp')}
                </p>

                {step === 1 ? (
                    <form onSubmit={handleRequestOtp} noValidate>
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                {t('auth:login.emailOrMobile')}
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <PhoneIcon />
                                </span>
                                <input
                                    type="text"
                                    autoComplete="username"
                                    className={`input-base ${fieldErrors.identifier && touched.identifier ? 'input-error' : ''}`}
                                    placeholder={t('auth:login.emailOrMobilePlaceholder')}
                                    value={identifier}
                                    onChange={handlePhoneChange}
                                    onBlur={() => handleBlur('identifier')}
                                    disabled={loading}
                                    aria-invalid={!!fieldErrors.identifier}
                                    aria-describedby={fieldErrors.identifier ? 'identifier-error' : undefined}
                                />
                            </div>
                            {fieldErrors.identifier && touched.identifier && (
                                <p id="identifier-error" className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                    <ErrorIcon />
                                    {t(fieldErrors.identifier)}
                                </p>
                            )}
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                {t('auth:login.password')}
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <LockIcon />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    className={`input-base pr-12 ${fieldErrors.password && touched.password ? 'input-error' : ''}`}
                                    placeholder={t('auth:login.passwordPlaceholder')}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onBlur={() => handleBlur('password')}
                                    disabled={loading}
                                    aria-invalid={!!fieldErrors.password}
                                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {fieldErrors.password && touched.password && (
                                <p id="password-error" className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                    <ErrorIcon />
                                    {t(fieldErrors.password)}
                                </p>
                            )}
                            <div className="text-right mt-2">
                                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                                    {t('auth:login.forgotPassword')}
                                </Link>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner />
                                    <span>{t('auth:login.signingIn')}</span>
                                </>
                            ) : (
                                <>
                                    <span>{t('auth:login.signIn')}</span>
                                    <ArrowRightIcon />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} noValidate>
                        <div className="mb-3">
                            <label className="block text-sm font-semibold text-gray-900 mb-2 text-center">
                                {t('auth:login.enterOtp')}
                            </label>
                            <OTPInput
                                value={otp}
                                onChange={(val) => { setOtp(val); setTouched(p => ({ ...p, otp: true })); }}
                                onComplete={(val) => { setOtp(val); handleVerifyOtp({ preventDefault: () => {} }, val); }}
                                disabled={loading}
                                error={!!(fieldErrors.otp && touched.otp)}
                            />
                            {fieldErrors.otp && touched.otp && (
                                <p id="otp-error" className="mt-2 text-sm text-red-500 flex items-center gap-1 justify-center">
                                    <ErrorIcon />
                                    {t(fieldErrors.otp)}
                                </p>
                            )}
                        </div>

                        <p className="text-[13px] text-gray-500 text-center mb-5">
                            {t('auth:login.otpSentSuccess')}{' '}
                            <span className="text-primary-500 font-medium">
                                {formatPhoneDisplay(submittedIdentifier || identifier)}
                            </span>
                        </p>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner />
                                    <span>{t('auth:login.verifying')}</span>
                                </>
                            ) : (
                                <>
                                    <span>{t('auth:login.verifyOtp')}</span>
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
                                <span className="inline-flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                                <span>{t('auth:login.changeNumber')}</span>
                                </span>
                            </button>

                            <button
                                type="button"
                                className="text-sm text-primary-500 font-medium hover:text-primary-600 transition-colors disabled:opacity-50 cursor-pointer"
                                onClick={handleResendOtp}
                                disabled={loading}
                            >
                                {t('auth:login.resendOtp')}
                            </button>
                        </div>
                    </form>
                )}

                <p className="text-[15px] text-gray-500 text-center mt-6">
                    {t('auth:login.noAccount')}{' '}
                    <Link
                        to="/register"
                        className="text-primary-500 font-semibold no-underline hover:text-primary-600 hover:underline transition-colors"
                    >
                        {t('auth:login.register')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
