import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { translateError } from '../i18n/errorMap';
import { validateVerificationCode, validatePassword, sanitizePasswordInput } from '../utils/validation';
import { StethoscopeIcon, LockIcon, ErrorIcon, EyeIcon, EyeOffIcon } from '../components/Icons';
import OTPInput from '../components/OTPInput';

const Spinner = () => <div className="spinner" />;

const ResetPasswordPage = () => {
    const location = useLocation();
    const email = location.state?.email || '';
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});

    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { t } = useTranslation(['auth', 'common', 'validation']);

    // Redirect if no email provided
    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

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

    // Validate password
    useEffect(() => {
        if (touched.newPassword && newPassword) {
            const { isValid, errors } = validatePassword(newPassword);
            setFieldErrors((prev) => ({
                ...prev,
                newPassword: isValid ? null : errors[0],
            }));
        }
    }, [newPassword, touched.newPassword]);

    // Validate confirm password
    useEffect(() => {
        if (touched.confirmPassword && confirmPassword) {
            if (confirmPassword !== newPassword) {
                setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: 'auth:resetPassword.passwordsMustMatch',
                }));
            } else {
                setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: null,
                }));
            }
        }
    }, [confirmPassword, newPassword, touched.confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});
        setTouched({ code: true, newPassword: true, confirmPassword: true });

        // Validate all fields
        const codeValidation = validateVerificationCode(code);
        const passwordValidation = validatePassword(newPassword);
        const errors = {};

        if (!codeValidation.isValid) {
            errors.code = codeValidation.errors[0];
        }
        if (!passwordValidation.isValid) {
            errors.newPassword = passwordValidation.errors[0];
        }
        if (confirmPassword !== newPassword) {
            errors.confirmPassword = 'auth:resetPassword.passwordsMustMatch';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setLoading(false);
            return;
        }

        try {
            await resetPassword(email, code, newPassword);
            toast.success(t('auth:resetPassword.resetSuccess'));
            navigate('/login');
        } catch (error) {
            const errorMsg = error?.error || error?.message || '';
            toast.error(translateError(errorMsg, t));
            setFieldErrors({ code: errorMsg });
        } finally {
            setLoading(false);
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
                    <h2 className="text-3xl font-bold text-gray-900">{t('auth:resetPassword.title')}</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t('auth:resetPassword.subtitle')} <strong>{email}</strong>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* 6-digit code input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                            {t('auth:resetPassword.verificationCode')}
                        </label>
                        <OTPInput
                            value={code}
                            onChange={(val) => { setCode(val); setTouched(p => ({ ...p, code: true })); }}
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

                    {/* New password */}
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            {t('auth:resetPassword.newPassword')}
                        </label>
                        <div className="relative mt-1">
                            <input
                                id="newPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(sanitizePasswordInput(e.target.value))}
                                onBlur={() => setTouched((prev) => ({ ...prev, newPassword: true }))}
                                placeholder={t('auth:resetPassword.newPasswordPlaceholder')}
                                className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                    fieldErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {fieldErrors.newPassword && (
                            <div className="flex items-center mt-2 text-red-600 text-sm">
                                <ErrorIcon className="h-4 w-4 mr-1" />
                                {t(fieldErrors.newPassword)}
                            </div>
                        )}
                    </div>

                    {/* Confirm password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            {t('auth:resetPassword.confirmPassword')}
                        </label>
                        <div className="relative mt-1">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(sanitizePasswordInput(e.target.value))}
                                onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                                placeholder={t('auth:resetPassword.confirmPasswordPlaceholder')}
                                className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                    fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showConfirmPassword ? (
                                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {fieldErrors.confirmPassword && (
                            <div className="flex items-center mt-2 text-red-600 text-sm">
                                <ErrorIcon className="h-4 w-4 mr-1" />
                                {t(fieldErrors.confirmPassword)}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || code.length !== 6 || !newPassword || !confirmPassword}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Spinner /> : t('auth:resetPassword.resetPassword')}
                    </button>

                    <div className="text-center text-sm">
                        <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-500">
                            {t('auth:resetPassword.requestNewCode')}
                        </Link>
                        {' • '}
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
                            {t('auth:forgotPassword.backToLogin')}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
