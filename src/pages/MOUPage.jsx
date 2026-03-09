import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { translateError } from '../i18n/errorMap';
import MOUContent from '../components/MOUContent';
import LanguageSelector from '../components/LanguageSelector';

const Spinner = () => <div className="spinner" />;

const MOUPage = () => {
    const { user, signMOU } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { t } = useTranslation(['mou', 'common']);
    const sigCanvas = useRef(null);

    // Pre-fill from user profile
    const doctorName = user ? `${user.doctor_name || ''}`.trim() : '';
    const clinicName = user?.clinic?.name || '';

    const [formData, setFormData] = useState({
        hospital_name: clinicName,
        authorized_signatory_name: doctorName,
        hospital_address: '',
        bank_account_number: '',
        bank_name: '',
        bank_branch: '',
        bank_ifsc: '',
        bank_address: '',
        professional_fee: '',
    });

    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const clearSignature = () => {
        sigCanvas.current?.clear();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.hospital_name.trim()) {
            toast.error(t('mou:form.hospitalName') + ' is required');
            return;
        }
        if (!formData.authorized_signatory_name.trim()) {
            toast.error(t('mou:form.authorizedSignatory') + ' is required');
            return;
        }
        if (!formData.hospital_address.trim()) {
            toast.error(t('mou:form.hospitalAddress') + ' is required');
            return;
        }
        if (!formData.bank_account_number.trim()) {
            toast.error(t('mou:form.bankAccountNumber') + ' is required');
            return;
        }
        if (!formData.bank_name.trim()) {
            toast.error(t('mou:form.bankName') + ' is required');
            return;
        }
        if (!formData.bank_branch.trim()) {
            toast.error(t('mou:form.bankBranch') + ' is required');
            return;
        }
        if (!formData.bank_ifsc.trim()) {
            toast.error(t('mou:form.bankIfsc') + ' is required');
            return;
        }
        if (!formData.bank_address.trim()) {
            toast.error(t('mou:form.bankAddress') + ' is required');
            return;
        }

        if (sigCanvas.current?.isEmpty()) {
            toast.error(t('mou:messages.signatureRequired'));
            return;
        }

        if (!agreed) {
            toast.error(t('mou:messages.agreementRequired'));
            return;
        }

        setLoading(true);

        try {
            const signatureDataUrl = sigCanvas.current.toDataURL('image/png');

            await signMOU({
                ...formData,
                signature: signatureDataUrl,
            });

            toast.success(t('mou:messages.success'));
            navigate('/dashboard', { replace: true });
        } catch (err) {
            const errorMsg = err?.error || err?.message || '';
            toast.error(errorMsg ? translateError(errorMsg, t) : t('mou:messages.submitError'));
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 safe-top safe-bottom">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-gray-900">{t('mou:pageTitle')}</h1>
                    <LanguageSelector />
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6">
                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-700">{t('mou:instructions')}</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Editable Form Fields — BEFORE the document so user fills first */}
                    <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            {t('mou:form.hospitalDetails')}
                        </h3>

                        {/* Hospital Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                                {t('mou:form.hospitalName')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="hospital_name"
                                value={formData.hospital_name}
                                onChange={handleChange}
                                placeholder={t('mou:form.hospitalNamePlaceholder')}
                                className="w-full px-4 py-3 text-sm border-[1.5px] border-gray-200 rounded-xl outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                disabled={loading}
                            />
                        </div>

                        {/* Authorized Signatory */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                                {t('mou:form.authorizedSignatory')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="authorized_signatory_name"
                                value={formData.authorized_signatory_name}
                                onChange={handleChange}
                                placeholder={t('mou:form.authorizedSignatoryPlaceholder')}
                                className="w-full px-4 py-3 text-sm border-[1.5px] border-gray-200 rounded-xl outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                disabled={loading}
                            />
                        </div>

                        {/* Hospital Address */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                                {t('mou:form.hospitalAddress')} <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="hospital_address"
                                value={formData.hospital_address}
                                onChange={handleChange}
                                placeholder={t('mou:form.hospitalAddressPlaceholder')}
                                rows={3}
                                className="w-full px-4 py-3 text-sm border-[1.5px] border-gray-200 rounded-xl outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Bank Details Section */}
                    <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            {t('mou:form.bankDetails')}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                                    {t('mou:form.bankAccountNumber')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="bank_account_number"
                                    value={formData.bank_account_number}
                                    onChange={handleChange}
                                    placeholder={t('mou:form.bankAccountNumberPlaceholder')}
                                    className="w-full px-4 py-3 text-sm border-[1.5px] border-gray-200 rounded-xl outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                                    {t('mou:form.bankName')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="bank_name"
                                    value={formData.bank_name}
                                    onChange={handleChange}
                                    placeholder={t('mou:form.bankNamePlaceholder')}
                                    className="w-full px-4 py-3 text-sm border-[1.5px] border-gray-200 rounded-xl outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                                    {t('mou:form.bankBranch')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="bank_branch"
                                    value={formData.bank_branch}
                                    onChange={handleChange}
                                    placeholder={t('mou:form.bankBranchPlaceholder')}
                                    className="w-full px-4 py-3 text-sm border-[1.5px] border-gray-200 rounded-xl outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                                    {t('mou:form.bankIfsc')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="bank_ifsc"
                                    value={formData.bank_ifsc}
                                    onChange={handleChange}
                                    placeholder={t('mou:form.bankIfscPlaceholder')}
                                    className="w-full px-4 py-3 text-sm border-[1.5px] border-gray-200 rounded-xl outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                                {t('mou:form.bankAddress')} <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="bank_address"
                                value={formData.bank_address}
                                onChange={handleChange}
                                placeholder={t('mou:form.bankAddressPlaceholder')}
                                rows={2}
                                className="w-full px-4 py-3 text-sm border-[1.5px] border-gray-200 rounded-xl outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                                disabled={loading}
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                                {t('mou:form.professionalFee')}
                            </label>
                            <input
                                type="text"
                                name="professional_fee"
                                value={formData.professional_fee}
                                onChange={handleChange}
                                placeholder={t('mou:form.professionalFeePlaceholder')}
                                className="w-full px-4 py-3 text-sm border-[1.5px] border-gray-200 rounded-xl outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* MOU Document Content — shows live with filled values */}
                    <div className="bg-white rounded-2xl shadow-card p-6 mb-6 max-h-[60vh] overflow-y-auto">
                        <MOUContent
                            hospitalName={formData.hospital_name}
                            signatoryName={formData.authorized_signatory_name}
                            effectiveDate={today}
                            bankAccountNumber={formData.bank_account_number}
                            bankName={formData.bank_name}
                            bankBranch={formData.bank_branch}
                            bankIfsc={formData.bank_ifsc}
                            bankAddress={formData.bank_address || formData.hospital_address}
                            professionalFee={formData.professional_fee}
                        />
                    </div>

                    {/* Signature Section */}
                    <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {t('mou:signature.title')}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">{t('mou:signature.instruction')}</p>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                            <SignatureCanvas
                                ref={sigCanvas}
                                penColor="black"
                                canvasProps={{
                                    className: 'w-full',
                                    style: { width: '100%', height: '200px' },
                                }}
                                backgroundColor="rgb(249, 250, 251)"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={clearSignature}
                            className="mt-3 text-sm text-red-500 font-medium hover:text-red-600 transition-colors cursor-pointer"
                            disabled={loading}
                        >
                            {t('mou:signature.clear')}
                        </button>
                    </div>

                    {/* Agreement Checkbox */}
                    <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                                disabled={loading}
                            />
                            <span className="text-sm text-gray-700 leading-relaxed">
                                {t('mou:agreement.checkbox')}
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn-primary mb-8"
                        disabled={loading || !agreed}
                    >
                        {loading ? (
                            <>
                                <Spinner />
                                <span>{t('mou:agreement.submitting')}</span>
                            </>
                        ) : (
                            <span>{t('mou:agreement.submit')}</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MOUPage;
