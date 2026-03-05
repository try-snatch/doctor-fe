import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { translateError } from '../i18n/errorMap';
import { validateEmail, sanitizeEmailInput } from '../utils/validation';
import { StethoscopeIcon, ErrorIcon } from '../components/Icons';

const Spinner = () => <div className="spinner" />;

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});

    const { forgotPassword } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { t } = useTranslation(['auth', 'common', 'validation']);

    // Validate email
    useEffect(() => {
        if (touched.email && email) {
            const { isValid, errors } = validateEmail(email);
            setFieldErrors((prev) => ({
                ...prev,
                email: isValid ? null : errors[0],
            }));
        }
    }, [email, touched.email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});
        setTouched({ email: true });

        const { isValid, errors } = validateEmail(email);
        if (!isValid) {
            setFieldErrors({ email: errors[0] });
            setLoading(false);
            return;
        }

        try {
            await forgotPassword(email);
            toast.success(t('auth:forgotPassword.codeSent'));
            navigate('/reset-password', { state: { email } });
        } catch (error) {
            const errorMsg = error?.error || error?.message || '';
            toast.error(translateError(errorMsg, t));
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
                    <h2 className="text-3xl font-bold text-gray-900">{t('auth:forgotPassword.title')}</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t('auth:forgotPassword.subtitle')}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            {t('auth:forgotPassword.emailAddress')}
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(sanitizeEmailInput(e.target.value))}
                            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                            placeholder={t('auth:forgotPassword.emailPlaceholder')}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loading}
                        />
                        {fieldErrors.email && (
                            <div className="flex items-center mt-2 text-red-600 text-sm">
                                <ErrorIcon className="h-4 w-4 mr-1" />
                                {t(fieldErrors.email)}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Spinner /> : t('auth:forgotPassword.sendResetCode')}
                    </button>

                    <div className="text-center text-sm">
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
                            {t('auth:forgotPassword.backToLogin')}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
