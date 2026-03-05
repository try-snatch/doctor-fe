import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { translateError } from '../i18n/errorMap';
import { validatePassword, validateOtp, sanitizePasswordInput, sanitizeOtpInput } from '../utils/validation';
import { StethoscopeIcon, LockIcon, ErrorIcon, EyeIcon, EyeOffIcon } from '../components/Icons';
import OTPInput from '../components/OTPInput';

const Spinner = () => <div className="spinner" />;

const StaffSetupPage = () => {
    const { invitationCode } = useParams();
    const [step, setStep] = useState(1); // 1: verify invitation, 2: set password, 3: OTP verification
    const [staffInfo, setStaffInfo] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpIdentifier, setOtpIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});

    const { verifyInvitation, setupStaffAccount, verifyOtp } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { t } = useTranslation(['auth', 'common', 'validation']);

    // Verify invitation on mount
    useEffect(() => {
        const verifyCode = async () => {
            setLoading(true);
            try {
                const info = await verifyInvitation(invitationCode);
                setStaffInfo(info);
                setStep(2);
            } catch (error) {
                const errorMsg = error?.error || error?.message || '';
                toast.error(translateError(errorMsg, t));
                setFieldErrors({ invitation: errorMsg });
            } finally {
                setLoading(false);
            }
        };

        if (invitationCode) {
            verifyCode();
        }
    }, [invitationCode, verifyInvitation]);

    // Validate password
    useEffect(() => {
        if (touched.password && password) {
            const { isValid, errors } = validatePassword(password);
            setFieldErrors((prev) => ({
                ...prev,
                password: isValid ? null : errors[0],
            }));
        }
    }, [password, touched.password]);

    // Validate confirm password
    useEffect(() => {
        if (touched.confirmPassword && confirmPassword) {
            if (confirmPassword !== password) {
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
    }, [confirmPassword, password, touched.confirmPassword]);

    // Validate OTP
    useEffect(() => {
        if (touched.otp && otp) {
            const { isValid, errors } = validateOtp(otp);
            setFieldErrors((prev) => ({
                ...prev,
                otp: isValid ? null : errors[0],
            }));
        }
    }, [otp, touched.otp]);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});
        setTouched({ password: true, confirmPassword: true });

        // Validate
        const passwordValidation = validatePassword(password);
        const errors = {};

        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.errors[0];
        }
        if (confirmPassword !== password) {
            errors.confirmPassword = 'auth:resetPassword.passwordsMustMatch';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setLoading(false);
            return;
        }

        try {
            const result = await setupStaffAccount(invitationCode, password);
            toast.success(t('auth:staffSetup.otpResent'));
            setOtpIdentifier(result.identifier);
            setStep(3);
        } catch (error) {
            const errorMsg = error?.error || error?.message || '';
            toast.error(translateError(errorMsg, t));
            setFieldErrors({ password: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e, otpOverride) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});
        setTouched({ otp: true });

        const otpValue = otpOverride || otp;
        const { isValid, errors } = validateOtp(otpValue);
        if (!isValid) {
            setFieldErrors({ otp: errors[0] });
            setLoading(false);
            return;
        }

        try {
            await verifyOtp(otpIdentifier, otpValue);
            toast.success(t('auth:staffSetup.activationSuccess'));
            navigate('/dashboard');
        } catch (error) {
            const errorMsg = error?.error || error?.message || '';
            toast.error(translateError(errorMsg, t));
            setFieldErrors({ otp: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    // Step 1: Loading or error
    if (step === 1) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-indigo-600 p-4 rounded-full">
                            <StethoscopeIcon className="h-12 w-12 text-white" />
                        </div>
                    </div>
                    {loading ? (
                        <>
                            <Spinner />
                            <p className="text-gray-600">{t('auth:staffSetup.verifyingInvite')}</p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold text-red-900">{t('auth:staffSetup.invalidInvite')}</h2>
                            <p className="text-red-600">{fieldErrors.invitation || t('auth:staffSetup.invalidInvite')}</p>
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-500 block">
                                {t('auth:staffSetup.backToLogin')}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // Step 2: Set password
    if (step === 2) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-600 p-4 rounded-full">
                                <StethoscopeIcon className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {t('auth:staffSetup.welcome', { name: staffInfo?.staff_name })}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {t('auth:staffSetup.invitedToJoin')} <strong>{staffInfo?.clinic_name}</strong>{' '}
                            {t('auth:staffSetup.asRole', { role: staffInfo?.role })}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Email: {staffInfo?.email} • Mobile: {staffInfo?.mobile}
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                            <p className="text-sm text-blue-700">
                                <strong>{t('auth:staffSetup.step1of2')}:</strong> {t('auth:staffSetup.createPassword')}
                            </p>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                {t('auth:staffSetup.password')}
                            </label>
                            <div className="relative mt-1">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(sanitizePasswordInput(e.target.value))}
                                    onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                                    placeholder={t('auth:staffSetup.passwordPlaceholder')}
                                    className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                        fieldErrors.password ? 'border-red-500' : 'border-gray-300'
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
                            {fieldErrors.password && (
                                <div className="flex items-center mt-2 text-red-600 text-sm">
                                    <ErrorIcon className="h-4 w-4 mr-1" />
                                    {t(fieldErrors.password)}
                                </div>
                            )}
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                {t('auth:staffSetup.confirmPassword')}
                            </label>
                            <div className="relative mt-1">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(sanitizePasswordInput(e.target.value))}
                                    onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                                    placeholder={t('auth:staffSetup.confirmPlaceholder')}
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
                            disabled={loading || !password || !confirmPassword}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Spinner /> : t('auth:staffSetup.continue')}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Step 3: OTP verification
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-indigo-600 p-4 rounded-full">
                            <StethoscopeIcon className="h-12 w-12 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{t('auth:staffSetup.verifyMobile')}</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t('auth:staffSetup.otpSentTo')} <strong>{otpIdentifier}</strong>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <p className="text-sm text-blue-700">
                            <strong>{t('auth:staffSetup.step2of2')}:</strong> {t('auth:staffSetup.verifyMobile')}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                            {t('auth:staffSetup.verifyMobile')}
                        </label>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            onComplete={(val) => { setOtp(val); handleOtpSubmit({ preventDefault: () => {} }, val); }}
                            disabled={loading}
                            error={!!fieldErrors.otp}
                        />
                        {fieldErrors.otp && (
                            <div className="flex items-center mt-2 text-red-600 text-sm justify-center">
                                <ErrorIcon className="h-4 w-4 mr-1" />
                                {t(fieldErrors.otp)}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Spinner /> : t('auth:staffSetup.activateAccount')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StaffSetupPage;
