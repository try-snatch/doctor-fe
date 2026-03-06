import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import useModalBackHandler from '../hooks/useModalBackHandler';

const CreateReferralModal = ({ patient, onClose, onSuccess }) => {
    const { t } = useTranslation(['patients', 'common']);
    const toast = useToast();
    useModalBackHandler(onClose);
    const [loading, setLoading] = useState(false);
    const [hospitals, setHospitals] = useState([]);
    const [hospitalSearch, setHospitalSearch] = useState('');
    const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
    const latestReferral = patient.latest_referral;

    useEffect(() => {
        api.get('/api/hospitals/')
            .then(res => setHospitals(Array.isArray(res.data) ? res.data : []))
            .catch(() => {});
    }, []);
    const [formData, setFormData] = useState({
        diagnosis: patient.diagnosis || latestReferral?.diagnosis || '',
        suggested_specialty: latestReferral?.suggested_specialty || '',
        suggested_sshs: latestReferral?.suggested_sshs || '',
    });

    // Sync search field with initial value
    useEffect(() => {
        if (formData.suggested_sshs) setHospitalSearch(formData.suggested_sshs);
    }, []);

    const filteredHospitals = hospitals.filter(h =>
        h.name.toLowerCase().includes(hospitalSearch.toLowerCase())
    );

    const selectHospital = (name) => {
        setFormData(prev => ({ ...prev, suggested_sshs: name }));
        setHospitalSearch(name);
        setShowHospitalDropdown(false);
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.diagnosis.trim()) {
            toast.error(t('patients:diagnosisRequired'));
            return;
        }

        setLoading(true);
        try {
            console.log("FORM DATA: ",formData)
            const res = await api.post(`/api/patients/${patient.id}/create-referral/`, formData);
            toast.success(t('patients:referralCreatedZoho'));
            if (onSuccess) onSuccess(res.data);
            onClose();
        } catch (error) {
            console.error('Error creating referral:', error);
            const msg = error.response?.data?.error || t('patients:failedToCreateReferral');
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
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{t('patients:createReferral')}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {t('patients:forPatient', { name: patient.full_name })}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('patients:diagnosis')}</label>
                        <textarea
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
                            placeholder={t('patients:diagnosisPlaceholder')}
                            rows={3}
                            required
                        />
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Suggested Specialty</label>
                        <input
                            type="text"
                            name="suggested_specialty"
                            value={formData.suggested_specialty}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                            placeholder="e.g., Cardiology, Orthopedics"
                        />
                    </div> */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('patients:suggestedHospital')}</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={hospitalSearch}
                                onChange={(e) => {
                                    setHospitalSearch(e.target.value);
                                    setFormData(prev => ({ ...prev, suggested_sshs: e.target.value }));
                                    setShowHospitalDropdown(true);
                                }}
                                onFocus={() => setShowHospitalDropdown(true)}
                                onBlur={() => setTimeout(() => setShowHospitalDropdown(false), 200)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none bg-white"
                                placeholder={t('patients:searchHospitals')}
                                disabled={loading}
                            />
                            {showHospitalDropdown && (hospitalSearch === '' || filteredHospitals.length > 0) && (
                                <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {filteredHospitals.map(h => (
                                        <button
                                            key={h.id}
                                            type="button"
                                            onMouseDown={() => selectHospital(h.name)}
                                            className={`w-full text-left px-4 py-3 text-sm hover:bg-primary-50 transition-colors ${
                                                formData.suggested_sshs === h.name ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'
                                            }`}
                                        >
                                            {h.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-blue-500 text-white rounded-xl font-semibold text-sm
                                 hover:bg-blue-600 active:bg-blue-700 transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? t('patients:creatingReferral') : t('patients:createReferralZoho')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateReferralModal;
