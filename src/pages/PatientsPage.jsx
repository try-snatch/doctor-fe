import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { translateError } from '../i18n/errorMap';
import NewOPDPatientModal from '../components/NewOPDPatientModal';
import CreateReferralModal from '../components/CreateReferralModal';
import PatientDetailModal from '../components/PatientDetailModal';
import PatientDocumentsModal from '../components/PatientDocumentsModal';
import { getStatusConfig } from '../utils/statusConfig';
import PullToRefresh from '../components/PullToRefresh';

// ─── Journey stages in order (headings from stages.json) ─────────────────────
const JOURNEY_STAGES = [
    { key: 'Care Initiated',       shortKey: 'initiated'   },
    { key: 'Registration',         shortKey: 'registered'  },
    { key: 'Hospitalisation',      shortKey: 'hospitalised'},
    { key: 'Undergoing Treatment', shortKey: 'treatment'   },
    { key: 'Discharge',            shortKey: 'discharged'  },
];
const COMPLETED_STAGE_KEYS = new Set(['Discharge', 'Treatment Cancelled']);

// Stage filter chips for Cases tab (key matches deal.status from Zoho)
const CASE_STAGE_CHIPS = [
    { key: 'all',                  labelKey: 'all',          color: 'gray'   },
    { key: 'Care Initiated',       labelKey: 'initiated',    color: 'cyan'   },
    { key: 'Registration',         labelKey: 'registered',   color: 'sky'    },
    { key: 'Hospitalisation',      labelKey: 'hospitalised', color: 'indigo' },
    { key: 'Undergoing Treatment', labelKey: 'treatment',    color: 'amber'  },
    { key: 'Discharge',            labelKey: 'discharged',   color: 'green'  },
    { key: 'Treatment Cancelled',  labelKey: 'cancelled',    color: 'red'    },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor" />
    </svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
);
const PersonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);
const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 shrink-0">
        <path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/>
        <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/>
        <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/>
    </svg>
);
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
);
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);
const StaffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/>
        <path d="M10 15H6a4 4 0 0 0-4 4v2"/>
        <path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/>
        <path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/>
        <path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/>
        <path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/>
    </svg>
);
const DocumentIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getRelativeDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const genderAge = (p) =>
    [p.gender?.[0]?.toUpperCase(), p.age && `${p.age}y`].filter(Boolean).join(', ');

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, t }) => {
    const cfg = getStatusConfig(status);
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {t('status:' + cfg.labelKey)}
        </span>
    );
};

// ─── Journey progress bar (stages.json headings) ──────────────────────────────
const JourneyProgress = ({ status, t }) => {
    if (!status) return null;

    if (status === 'Treatment Cancelled') {
        return (
            <div className="mt-3 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span className="text-[11px] text-red-500">{t('patients:stages.cancelled')}</span>
            </div>
        );
    }

    const currentIdx = JOURNEY_STAGES.findIndex(
        (s) => s.key.toLowerCase() === status.toLowerCase()
    );
    if (currentIdx < 0) return null;

    return (
        <div className="mt-3">
            {/* Dots + connector lines */}
            <div className="flex items-center">
                {JOURNEY_STAGES.map((stage, idx) => {
                    const done = idx <= currentIdx;
                    const current = idx === currentIdx;
                    return (
                        <React.Fragment key={stage.key}>
                            <div className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                                done ? 'bg-indigo-500' : 'bg-gray-200'
                            } ${current ? 'ring-2 ring-indigo-200' : ''}`} />
                            {idx < JOURNEY_STAGES.length - 1 && (
                                <div className={`flex-1 h-px ${idx < currentIdx ? 'bg-indigo-400' : 'bg-gray-200'}`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            {/* Stage labels */}
            <div className="flex justify-between mt-1">
                {JOURNEY_STAGES.map((stage, idx) => (
                    <span key={stage.key} className={`text-[9px] leading-tight ${
                        idx === currentIdx ? 'text-indigo-600 font-semibold' : 'text-gray-400'
                    }`}>
                        {t('patients:stages.' + stage.shortKey)}
                    </span>
                ))}
            </div>
        </div>
    );
};

// ─── OPD card ─────────────────────────────────────────────────────────────────
const OPDCard = ({ patient, onClick, onRefer, onDocuments, t }) => {
    const ref = patient.latest_referral;
    const isRevisit = Boolean(ref);
    const date = getRelativeDate(patient.created_at);
    const ga = genderAge(patient);

    return (
        <div
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm cursor-pointer hover:border-primary-200 hover:shadow-md transition-all active:scale-[0.99]"
            onClick={() => onClick(patient)}
        >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                    <PersonIcon />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">{patient.full_name || t('patients:noPatients')}</h4>
                        <div className="flex items-center gap-1 shrink-0">
                            {isRevisit && (
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200">
                                    {t('patients:reVisit')}
                                </span>
                            )}
                            <StatusBadge status="opd" t={t} />
                        </div>
                    </div>

                    {ga && <p className="text-xs text-gray-400 mb-1.5">{ga}</p>}

                    <p className="text-[13px] text-gray-600 truncate mb-2">
                        {patient.diagnosis || t('patients:noDiagnosis')}
                    </p>

                    {isRevisit && (ref.suggested_specialty || ref.suggested_sshs) && (
                        <p className="text-[11px] text-gray-400 mb-2">
                            {t('patients:last')}: {ref.suggested_specialty || ref.suggested_sshs}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] text-gray-400">{date}</span>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {/* Documents icon */}
                            <button
                                onClick={() => onDocuments(patient)}
                                title={t('patients:viewDocuments')}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary-50 text-primary-500 hover:bg-primary-100 transition-colors"
                            >
                                <DocumentIcon />
                            </button>
                            <button
                                onClick={() => onRefer(patient)}
                                className="px-3 py-1.5 bg-primary-500 text-white text-[11px] font-semibold rounded-lg hover:bg-primary-600 transition-colors"
                            >
                                {t('patients:refer')} →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Referral card (Zoho Lead) ────────────────────────────────────────────────
const ReferralCard = ({ patient, onClick, onDocuments, t }) => {
    const ga = genderAge(patient);
    const date = getRelativeDate(patient.date);
    const hospital = patient.hospital || patient.specialty;

    return (
        <div
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm cursor-pointer hover:border-primary-200 hover:shadow-md transition-all active:scale-[0.99]"
            onClick={() => onClick(patient)}
        >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                    <PersonIcon />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">{patient.full_name || patient.name || t('patients:noPatients')}</h4>
                        <StatusBadge status="referred" t={t} />
                    </div>

                    {ga && <p className="text-xs text-gray-400 mb-1.5">{ga}</p>}

                    {patient.diagnosis && (
                        <p className="text-[13px] text-gray-600 truncate mb-1.5">{patient.diagnosis}</p>
                    )}

                    <div className="flex items-center justify-between">
                        {hospital ? (
                            <span className="text-[11px] text-gray-400 flex items-center gap-1 truncate">
                                <BuildingIcon />{hospital}
                            </span>
                        ) : <span />}
                        <div className="flex items-center gap-2 shrink-0">
                            {onDocuments && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDocuments(patient); }}
                                    title={t('patients:viewDocuments')}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary-50 text-primary-500 hover:bg-primary-100 transition-colors"
                                >
                                    <DocumentIcon />
                                </button>
                            )}
                            <span className="text-[11px] text-gray-400">{date}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Case card (Zoho Deal) ────────────────────────────────────────────────────
const CaseCard = ({ patient, onClick, onDocuments, showRevenue, t }) => {
    const ga = genderAge(patient);
    const date = getRelativeDate(patient.date);
    const isCancelled = patient.status === 'Treatment Cancelled';
    const revenue = parseFloat(patient.revenue || 0);
    const revenueFormatted = revenue > 0
        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(revenue)
        : null;

    return (
        <div
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm cursor-pointer hover:border-primary-200 hover:shadow-md transition-all active:scale-[0.99]"
            onClick={() => onClick(patient)}
        >
            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isCancelled ? 'bg-red-50 text-red-400' : 'bg-indigo-50 text-indigo-500'
                }`}>
                    <PersonIcon />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">{patient.full_name || patient.name || t('patients:noPatients')}</h4>
                        <div className="flex items-center gap-1.5 shrink-0">
                            {showRevenue && revenueFormatted && (
                                <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                    {revenueFormatted}
                                </span>
                            )}
                            <StatusBadge status={patient.status} t={t} />
                        </div>
                    </div>

                    {ga && <p className="text-xs text-gray-400 mb-1">{ga}</p>}

                    <div className="flex items-center justify-between">
                        {patient.hospital ? (
                            <span className="text-[11px] text-gray-400 flex items-center gap-1 max-w-[60%] truncate">
                                <BuildingIcon />{patient.hospital}
                            </span>
                        ) : <span />}
                        <div className="flex items-center gap-2 shrink-0">
                            {onDocuments && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDocuments(patient); }}
                                    title={t('patients:viewDocuments')}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary-50 text-primary-500 hover:bg-primary-100 transition-colors"
                                >
                                    <DocumentIcon />
                                </button>
                            )}
                            <span className="text-[11px] text-gray-400">{date}</span>
                        </div>
                    </div>

                    <JourneyProgress status={patient.status} t={t} />
                </div>
            </div>
        </div>
    );
};

// ─── Bottom nav item ──────────────────────────────────────────────────────────
const NavItem = ({ to, icon: Icon, label, end = false }) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
                isActive ? 'text-primary-500' : 'text-gray-400'
            }`
        }
    >
        <Icon />
        <span className="text-xs font-medium">{label}</span>
    </NavLink>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const PatientSkeleton = () => (
    <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                            <div className="h-4 bg-gray-200 rounded w-1/3" />
                            <div className="h-4 bg-gray-200 rounded-full w-16" />
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-16" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ tab, t }) => {
    const msgs = {
        opd:       { title: t('patients:emptyOpd'),       sub: t('patients:emptyOpdSub')       },
        referrals: { title: t('patients:emptyReferrals'), sub: t('patients:emptyReferralsSub') },
        cases:     { title: t('patients:emptyCases'),     sub: t('patients:emptyCasesSub')     },
    };
    const { title, sub } = msgs[tab] || { title: t('patients:noPatients'), sub: '' };
    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center mt-2">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                <UsersIcon />
            </div>
            <h4 className="text-gray-800 font-semibold mb-1">{title}</h4>
            <p className="text-gray-400 text-sm">{sub}</p>
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────
const VALID_TABS = ['opd', 'referrals', 'cases'];

const PatientsPage = () => {
    const { t } = useTranslation(['patients', 'common', 'status', 'dashboard']);
    const { user } = useAuth();
    const toast = useToast();
    const [searchParams] = useSearchParams();
    const initialTab = VALID_TABS.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'opd';
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [casesStageFilter, setCasesStageFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showOPDModal, setShowOPDModal] = useState(false);
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [referralPatient, setReferralPatient] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [documentsPatient, setDocumentsPatient] = useState(null);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/patients/');
            setPatients(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            const errorMsg = err?.response?.data?.detail || err?.response?.data?.message || err?.message;
            toast.error(translateError(errorMsg, t));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPatients(); }, []);

    const handleTabChange = (tab) => { setActiveTab(tab); setSearchTerm(''); setCasesStageFilter('all'); };

    const matchesSearch = (p, term) => {
        const lower = term.toLowerCase();
        return (
            (p.full_name || p.name || '').toLowerCase().includes(lower) ||
            (p.phone || '').includes(lower) ||
            (p.diagnosis || '').toLowerCase().includes(lower) ||
            (p.hospital || p.specialty || '').toLowerCase().includes(lower)
        );
    };

    // Partition by source
    const localPatients = patients.filter((p) => p.source === 'local');
    const leadPatients  = patients.filter((p) => p.source === 'lead');
    const dealPatients  = patients.filter((p) => p.source === 'deal');

    const getFilteredList = () => {
        let list;
        if (activeTab === 'opd')            list = localPatients;
        else if (activeTab === 'referrals') list = leadPatients;
        else {
            list = casesStageFilter === 'all'
                ? dealPatients
                : dealPatients.filter((p) => p.status === casesStageFilter);
        }
        if (!searchTerm) return list;
        return list.filter((p) => matchesSearch(p, searchTerm));
    };

    const filteredList = getFilteredList();

    const tabCounts = {
        opd:       localPatients.length,
        referrals: leadPatients.length,
        cases:     dealPatients.length,
    };

    const tabs = [
        { key: 'opd',       label: t('patients:tabs.opd')       },
        { key: 'referrals', label: t('patients:tabs.referrals')  },
        { key: 'cases',     label: t('patients:tabs.cases')      },
    ];

    const searchPlaceholders = {
        opd:       t('patients:searchOpd'),
        referrals: t('patients:searchReferrals'),
        cases:     t('patients:searchCases'),
    };

    const handleRefer = (patient) => { setReferralPatient(patient); setShowReferralModal(true); };
    const handleReferralClose = () => { setShowReferralModal(false); setReferralPatient(null); fetchPatients(); };
    const handleOPDClose   = () => { setShowOPDModal(false); fetchPatients(); };
    const handlePatientClick = (p) => setSelectedPatient(p);
    const handleDocuments = (patient) => {
        // Zoho leads/deals use Zoho IDs — find the matching local patient by phone
        if (patient.source === 'lead' || patient.source === 'deal') {
            const localMatch = patients.find(
                (p) => p.source === 'local' && p.phone === patient.phone
            );
            if (localMatch) {
                setDocumentsPatient(localMatch);
                return;
            }
            toast.error(t('patients:noLocalRecord'));
            return;
        }
        setDocumentsPatient(patient);
    };

    return (
        <PullToRefresh onRefresh={fetchPatients}>
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* ── Header ── */}
            <header className="bg-white px-5 pt-5 pb-3 sticky top-0 z-20 border-b border-gray-100 safe-top">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{t('patients:title')}</h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {loading ? '…' : t('patients:shown', { count: filteredList.length })}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowOPDModal(true)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
                    >
                        <PlusIcon /> {t('patients:registerOpd')}
                    </button>
                </div>

                {/* ── Tab strip ── */}
                <div className="flex gap-1.5 mb-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => handleTabChange(tab.key)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                                activeTab === tab.key
                                    ? 'bg-primary-500 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                            {tab.label}
                            {tabCounts[tab.key] > 0 && (
                                <span className={`ml-1 text-xs ${activeTab === tab.key ? 'opacity-80' : 'text-gray-400'}`}>
                                    {tabCounts[tab.key]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Cases stage filter chips ── */}
                {activeTab === 'cases' && (
                    <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide pb-0.5">
                        {CASE_STAGE_CHIPS.map((chip) => {
                            const count = chip.key === 'all'
                                ? dealPatients.length
                                : dealPatients.filter((p) => p.status === chip.key).length;
                            const isActive = casesStageFilter === chip.key;
                            return (
                                <button
                                    key={chip.key}
                                    onClick={() => setCasesStageFilter(chip.key)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                                        isActive
                                            ? 'bg-indigo-500 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    {t('patients:stages.' + chip.labelKey)}
                                    {count > 0 && (
                                        <span className={`ml-1 ${isActive ? 'opacity-75' : 'text-gray-400'}`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ── Search ── */}
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder={searchPlaceholders[activeTab]}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none
                                   focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400"
                    />
                </div>
            </header>

            {/* ── Content ── */}
            <div className="px-5 py-4">
                {loading ? (
                    <PatientSkeleton />
                ) : filteredList.length > 0 ? (
                    <div className="space-y-3">
                        {activeTab === 'opd' && filteredList.map((p, i) => (
                            <OPDCard
                                key={p.id || i}
                                patient={p}
                                onClick={handlePatientClick}
                                onRefer={handleRefer}
                                onDocuments={handleDocuments}
                                t={t}
                            />
                        ))}
                        {activeTab === 'referrals' && filteredList.map((p, i) => (
                            <ReferralCard
                                key={p.id || i}
                                patient={p}
                                onClick={handlePatientClick}
                                onDocuments={handleDocuments}
                                t={t}
                            />
                        ))}
                        {activeTab === 'cases' && filteredList.map((p, i) => (
                            <CaseCard
                                key={p.id || i}
                                patient={p}
                                onClick={handlePatientClick}
                                onDocuments={handleDocuments}
                                showRevenue={!!user?.can_view_financial}
                                t={t}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState tab={activeTab} t={t} />
                )}
            </div>

            {/* ── Bottom nav ── */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-4 py-1 z-30 safe-bottom">
                <NavItem to="/dashboard" icon={HomeIcon} label={t('common:nav.home')} end />
                <NavItem to="/patients"  icon={UsersIcon} label={t('common:nav.patients')} />
                {user?.role === 'owner' && (
                    <NavItem to="/staff" icon={StaffIcon} label={t('common:nav.staff')} />
                )}
            </nav>

            {/* ── Modals ── */}
            {showOPDModal && <NewOPDPatientModal onClose={handleOPDClose} />}

            {showReferralModal && referralPatient && (
                <CreateReferralModal
                    patient={referralPatient}
                    onClose={handleReferralClose}
                    onSuccess={fetchPatients}
                />
            )}

            {selectedPatient && (
                <PatientDetailModal
                    patient={selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                    onUpdate={fetchPatients}
                />
            )}

            {documentsPatient && (
                <PatientDocumentsModal
                    patient={documentsPatient}
                    onClose={() => setDocumentsPatient(null)}
                />
            )}
        </div>
        </PullToRefresh>
    );
};

export default PatientsPage;
