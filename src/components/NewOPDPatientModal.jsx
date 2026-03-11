import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import useModalBackHandler from '../hooks/useModalBackHandler';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/bmp', 'image/tiff', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const MAX_FILES = 5;

const NewOPDPatientModal = ({ onClose }) => {
    const { t } = useTranslation(['patients', 'common']);
    const toast = useToast();
    useModalBackHandler(onClose);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        email: '',
        age: '',
        gender: 'male',
        diagnosis: '',
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileSelect = (e) => {
        const selected = Array.from(e.target.files || []);
        const valid = [];
        for (const f of selected) {
            if (!ALLOWED_TYPES.includes(f.type)) {
                toast.error(t('patients:unsupportedFileType', { name: f.name }));
                continue;
            }
            if (f.size > MAX_FILE_SIZE) {
                toast.error(t('patients:fileTooLarge', { name: f.name }));
                continue;
            }
            valid.push(f);
        }
        setFiles(prev => {
            const combined = [...prev, ...valid];
            if (combined.length > MAX_FILES) {
                toast.error(t('patients:maxFilesExceeded', { max: MAX_FILES }));
                return combined.slice(0, MAX_FILES);
            }
            return combined;
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.full_name.trim()) {
            toast.error(t('patients:patientNameRequired'));
            return;
        }

        if (!formData.phone.trim() && !formData.email.trim()) {
            toast.error(t('patients:phoneOrEmailRequired'));
            return;
        }

        if (formData.phone.trim()) {
            const cleanPhone = formData.phone.replace(/\D/g, '');
            if (cleanPhone.length < 10) {
                toast.error(t('patients:phoneMinDigits', 'Phone number must be at least 10 digits'));
                return;
            }
            if (cleanPhone.length > 10) {
                toast.error(t('patients:phoneTooLong', 'Phone number is too long'));
                return;
            }
            if (!/^[0-9]\d{9}$/.test(cleanPhone)) {
                toast.error(t('patients:phoneInvalid', 'Please enter a valid phone number'));
                return;
            }
        }

        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('full_name', formData.full_name);
            if (formData.phone) fd.append('phone', formData.phone);
            if (formData.email) fd.append('email', formData.email);
            if (formData.age) fd.append('age', parseInt(formData.age));
            fd.append('gender', formData.gender);
            if (formData.diagnosis) fd.append('diagnosis', formData.diagnosis);
            files.forEach(f => fd.append('documents', f));

            await api.post('/api/patients/register-opd/', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const docCount = files.length;
            toast.success(
                docCount
                    ? t('patients:opdRegisteredWithDocs', { count: docCount })
                    : t('patients:opdRegistered')
            );
            onClose();
        } catch (error) {
            console.error('Error registering OPD patient:', error);
            const msg = error.response?.data?.error || error.response?.data?.full_name?.[0] || t('patients:failedToRegister');
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
            <div
                className="bg-white w-full max-w-lg rounded-t-3xl p-6 pb-10 animate-slide-up max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-900">{t('patients:registerOpd')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('patients:fullName')}</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                            placeholder={t('patients:fullNamePlaceholder')}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('patients:phone')} <span className="text-red-500">*</span>
                            <span className="text-xs font-normal text-gray-400 ml-1">(or email)</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                            placeholder={t('patients:mobilePlaceholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('patients:email')} <span className="text-red-500">*</span>
                            <span className="text-xs font-normal text-gray-400 ml-1">(or phone)</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                            placeholder={t('patients:emailAddress')}
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('patients:age')}</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                placeholder={t('patients:age')}
                                min="0"
                                max="150"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('patients:gender')}</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                            >
                                <option value="male">{t('common:male')}</option>
                                <option value="female">{t('common:female')}</option>
                                <option value="other">{t('common:other')}</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('patients:preliminaryDiagnosis')}</label>
                        <textarea
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
                            placeholder={t('patients:initialDiagnosisPlaceholder')}
                            rows={3}
                        />
                    </div>

                    {/* Document uploads */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('patients:attachDocuments')}</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.bmp,.tiff,.webp"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-primary-400 hover:text-primary-500 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {t('patients:addDocuments')}
                        </button>
                        {files.length > 0 && (
                            <div className="mt-2 space-y-1.5">
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="flex-1 truncate text-gray-700">{f.name}</span>
                                        <span className="text-xs text-gray-400 shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="text-gray-400 hover:text-red-500 shrink-0"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-primary-500 text-white rounded-xl font-semibold text-sm
                                 hover:bg-primary-600 active:bg-primary-700 transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? t('patients:registering') : t('patients:registerOpd')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewOPDPatientModal;
