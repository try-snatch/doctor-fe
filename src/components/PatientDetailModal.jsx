import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getStatusConfig } from '../utils/statusConfig';
import useModalBackHandler from '../hooks/useModalBackHandler';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';

// ============== ICONS ==============
const CloseIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
    </svg>
);

const EditIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
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
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 2v2"></path>
        <path d="M5 2v2"></path>
        <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path>
        <path d="M8 15a6 6 0 0 0 12 0v-3"></path>
        <circle cx="20" cy="10" r="2"></circle>
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM9 12H7V10H9V12ZM13 12H11V10H13V12ZM17 12H15V10H17V12ZM9 16H7V14H9V16ZM13 16H11V14H13V16ZM17 16H15V14H17V16Z" fill="#4A7DFC" />
    </svg>
);

const InfoIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor" />
    </svg>
);

const DocumentsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

// ============== HELPER FUNCTIONS ==============
const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// ============== SUB-COMPONENTS ==============
const InfoCard = ({ children, className = '' }) => (
    <div className={`bg-white border border-gray-100 rounded-2xl p-4 ${className}`}>
        {children}
    </div>
);

const DisplayField = ({ label, value, icon: Icon, notProvided = 'Not provided' }) => (
    <div className="space-y-2">
        <label className="text-sm text-gray-400">{label}</label>
        <div className="flex items-center gap-3">
            {Icon && <span className="shrink-0 text-gray-500"><Icon /></span>}
            <p className="flex-1 text-base text-gray-900 font-medium">{value || notProvided}</p>
        </div>
    </div>
);

const EditField = ({ label, value, onChange, icon: Icon, type = 'text', children }) => (
    <div className="space-y-1.5">
        <label className="text-sm text-gray-400">{label}</label>
        <div className="relative flex items-center gap-3">
            {Icon && <span className="shrink-0 text-gray-400"><Icon /></span>}
            {children || (
                <input
                    type={type}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-base text-gray-900 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100"
                />
            )}
        </div>
    </div>
);

// ============== MAIN COMPONENT ==============
const PatientDetailModal = ({ patient, onClose, onUpdate }) => {
    const { t } = useTranslation(['patients', 'status', 'common']);
    const toast = useToast();
    useModalBackHandler(onClose);

    const isEditable = patient?.source === 'local' || patient?.source === 'lead';
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        full_name: patient?.full_name || patient?.name || '',
        age: patient?.age || '',
        gender: (patient?.gender || '').toLowerCase(),
        phone: patient?.phone || '',
        diagnosis: patient?.diagnosis || '',
    });

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    if (!patient) return null;

    const statusConfig = getStatusConfig(patient?.status);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Build a clean payload — DRF rejects '' for IntegerField and ChoiceField
            const payload = { ...form };
            if (!payload.full_name?.trim()) {
                toast.error(t('patients:patientNameRequired', 'Patient name is required'));
                setSaving(false);
                return;
            }
            payload.full_name = payload.full_name.trim();
            payload.age = (payload.age === '' || payload.age == null)
                ? null
                : parseInt(payload.age, 10);
            if (payload.gender) {
                payload.gender = payload.gender.toLowerCase();
            } else {
                delete payload.gender;
            }

            console.log('PatientDetailModal save:', { source: patient.source, id: patient.id, payload });

            if (patient.source === 'local') {
                await api.patch(`/api/patients/${patient.id}/`, payload);
            } else if (patient.source === 'lead') {
                await api.patch(`/api/patients/leads/${patient.id}/`, payload);
            }
            toast.success(t('patients:updateSuccess', 'Patient updated successfully'));
            onUpdate?.();
            onClose();
        } catch (err) {
            console.error('PatientDetailModal save error:', err?.response?.status, JSON.stringify(err?.response?.data));
            const data = err?.response?.data;
            // DRF validation errors are { field: [errors] } — flatten them
            let msg = data?.error || data?.detail || err?.message;
            if (!msg && typeof data === 'object') {
                msg = Object.entries(data).map(([k, v]) => `${k}: ${[].concat(v).join(', ')}`).join('; ');
            }
            toast.error(msg || t('common:error'));
        } finally {
            setSaving(false);
        }
    };

    const set = (field) => (val) => setForm(prev => ({ ...prev, [field]: val }));

    return (
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col safe-top safe-bottom">
            {/* Header */}
            <header className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <InfoIcon />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">{t('patients:patientDetails')}</h1>
                        <p className="text-sm text-gray-400">
                            {editing ? t('patients:editMode', 'Editing details') : t('patients:viewPatientInfo')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isEditable && !editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-50 text-primary-500 hover:bg-primary-100 transition-colors"
                        >
                            <EditIcon />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                {/* Status - always read only */}
                <InfoCard>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 px-2">{t('patients:status')}</label>
                        <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                            {t('status:' + statusConfig.labelKey)}
                        </span>
                    </div>
                </InfoCard>

                {editing ? (
                    <>
                        <InfoCard>
                            <EditField label={t('patients:patientName')} value={form.full_name} onChange={set('full_name')} icon={PersonIcon} />
                        </InfoCard>

                        <InfoCard>
                            <div className="grid grid-cols-2 gap-4">
                                <EditField label={t('patients:gender')} value={form.gender} onChange={set('gender')} icon={GenderIcon}>
                                    <select
                                        value={form.gender || ''}
                                        onChange={e => set('gender')(e.target.value)}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-base text-gray-900 focus:outline-none focus:border-primary-400"
                                    >
                                        <option value="">—</option>
                                        <option value="male">{t('patients:male', 'Male')}</option>
                                        <option value="female">{t('patients:female', 'Female')}</option>
                                        <option value="other">{t('patients:other', 'Other')}</option>
                                    </select>
                                </EditField>
                                <EditField label={t('patients:age')} value={form.age} onChange={set('age')} type="number" />
                            </div>
                        </InfoCard>

                        <InfoCard>
                            <EditField label={t('patients:phoneNumber')} value={form.phone} onChange={set('phone')} icon={PhoneIcon} type="tel" />
                        </InfoCard>

                        <InfoCard>
                            <div className="space-y-1.5">
                                <label className="text-sm text-gray-400">{t('patients:primaryDiagnosis')}</label>
                                <textarea
                                    value={form.diagnosis || ''}
                                    onChange={e => set('diagnosis')(e.target.value)}
                                    rows={3}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-base text-gray-900 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 resize-none"
                                />
                            </div>
                        </InfoCard>
                    </>
                ) : (
                    <>
                        <InfoCard>
                            <DisplayField label={t('patients:patientName')} value={patient?.full_name || patient?.name} icon={PersonIcon} notProvided={t('patients:notProvided')} />
                        </InfoCard>

                        <InfoCard>
                            <div className="grid grid-cols-2 gap-4">
                                <DisplayField label={t('patients:gender')} value={capitalizeFirst(patient?.gender)} icon={GenderIcon} notProvided={t('patients:notProvided')} />
                                <DisplayField label={t('patients:age')} value={patient?.age ? t('patients:yearsValue', { count: patient.age }) : null} notProvided={t('patients:notProvided')} />
                            </div>
                        </InfoCard>

                        <InfoCard>
                            <DisplayField label={t('patients:phoneNumber')} value={patient?.phone} icon={PhoneIcon} notProvided={t('patients:notProvided')} />
                        </InfoCard>

                        <InfoCard>
                            <DisplayField label={t('patients:hospital')} value={patient?.hospital} icon={HospitalIcon} notProvided={t('patients:notProvided')} />
                        </InfoCard>

                        <InfoCard>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">{t('patients:primaryDiagnosis')}</label>
                                <div className="flex items-start gap-3">
                                    <span className="shrink-0 text-gray-500 mt-0.5"><DiagnosisIcon /></span>
                                    <p className="flex-1 text-base text-gray-900 whitespace-pre-wrap">
                                        {patient?.diagnosis || t('patients:noDiagnosis')}
                                    </p>
                                </div>
                            </div>
                        </InfoCard>

                        {patient?.source === 'deal' && parseFloat(patient?.revenue || 0) > 0 && (
                            <InfoCard>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">{t('patients:billValue', 'Bill Value')}</label>
                                    <p className="text-xl font-bold text-green-600">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(patient.revenue)}
                                    </p>
                                </div>
                            </InfoCard>
                        )}

                        <InfoCard className="bg-gray-50">
                            <div className="flex items-center gap-3">
                                <CalendarIcon />
                                <div>
                                    <p className="text-sm text-gray-400">{t('patients:createdOn')}</p>
                                    <p className="text-base font-semibold text-gray-900">{formatDateTime(patient.date || patient.created_at)}</p>
                                </div>
                            </div>
                        </InfoCard>
                    </>
                )}
            </div>

            {/* Footer */}
            <footer className="px-5 py-4 border-t border-gray-100 shrink-0 bg-white">
                {editing ? (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setEditing(false)}
                            disabled={saving}
                            className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 text-base font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            {t('common:cancel')}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 py-4 px-6 bg-primary-500 text-white text-base font-semibold rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-60"
                        >
                            {saving ? t('common:saving', 'Saving…') : t('common:save')}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onClose}
                        className="w-full py-4 px-6 bg-gray-100 text-gray-700 text-base font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                        {t('common:close')}
                    </button>
                )}
            </footer>
        </div>
    );
};

export default PatientDetailModal;
