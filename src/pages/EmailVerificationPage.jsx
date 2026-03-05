import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { translateError } from '../i18n/errorMap';
import { validateVerificationCode } from '../utils/validation';
import { StethoscopeIcon, ErrorIcon } from '../components/Icons';
import OTPInput from '../components/OTPInput';

const Spinner = () => <div className="spinner" />;

const EmailVerificationPage = () => {
    const location = useLocation();
    const email = location.state?.email || '';
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});

    const { verifyEmail, resendEmailVerification } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { t } = useTranslation(['auth', 'common', 'validation']);

    // Redirect if no email provided
    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    // Cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Validate code
    useEffect(() => {
        if (touched.code && code) {
            const { isValid, errors } = validateVerificationCode(code);
            setFieldErrors((prev) => ({
                ...prev,
                code: isValid ? null : errors[0],
            }));
        }
    }, [code, touched.code]);

    const handleSubmit = async (codeToSubmit = code) => {
        setLoading(true);
        setFieldErrors({});

        const { isValid, errors } = validateVerificationCode(codeToSubmit);
        if (!isValid) {
            setFieldErrors({ code: errors[0] });
            setLoading(false);
            return;
        }

        try {
            await verifyEmail(email, codeToSubmit);
            toast.success(t('auth:emailVerification.verifySuccess'));
            navigate('/dashboard');
        } catch (error) {
            const errorMsg = error?.error || error?.message || '';
            toast.error(translateError(errorMsg, t));
            setFieldErrors({ code: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        setResendLoading(true);
        try {
            await resendEmailVerification(email);
            toast.success(t('auth:emailVerification.codeResent'));
            setResendCooldown(60);
            setCode('');
        } catch (error) {
            const errorMsg = error?.error || error?.message || '';
            toast.error(translateError(errorMsg, t));
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-indigo-600 p-4 rounded-full">
                            <StethoscopeIcon className="h-12 w-12 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{t('auth:emailVerification.title')}</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t('auth:emailVerification.subtitle')} <strong>{email}</strong>
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    {/* 6-digit code input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                            {t('auth:emailVerification.enterCode')}
                        </label>
                        <OTPInput
                            value={code}
                            onChange={(val) => { setCode(val); setTouched(p => ({ ...p, code: true })); }}
                            onComplete={handleSubmit}
                            disabled={loading}
                            error={!!fieldErrors.code}
                        />
                        {fieldErrors.code && (
                            <div className="flex items-center mt-2 text-red-600 text-sm justify-center">
                                <ErrorIcon className="h-4 w-4 mr-1" />
                                {t(fieldErrors.code)}
                            </div>
                        )}
                    </div>

                    {/* Submit button */}
                    <button
                        onClick={() => handleSubmit()}
                        disabled={loading || code.length !== 6}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Spinner /> : t('auth:emailVerification.verifyEmail')}
                    </button>

                    {/* Resend code */}
                    <div className="text-center">
                        <button
                            onClick={handleResend}
                            disabled={resendLoading || resendCooldown > 0}
                            className="text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {resendLoading ? (
                                <Spinner />
                            ) : resendCooldown > 0 ? (
                                t('auth:emailVerification.resendIn', { seconds: resendCooldown })
                            ) : (
                                <>
                                    {t('auth:emailVerification.didntReceive')}{' '}
                                    {t('auth:emailVerification.resend')}
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
                            {t('auth:forgotPassword.backToLogin')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationPage;
