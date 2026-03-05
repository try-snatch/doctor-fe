import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { translateError } from '../i18n/errorMap';
import NewOPDPatientModal from '../components/NewOPDPatientModal';
import { Link } from "react-router-dom";
import PatientDetailModal from '../components/PatientDetailModal';
import { getStatusConfig } from '../utils/StatusConfig';
import PullToRefresh from '../components/PullToRefresh';


// ============== ICONS ==============
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send w-3.5 h-3.5"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>
);

const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity w-3.5 h-3.5"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>
);

const RupeeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-indian-rupee w-3.5 h-3.5"><path d="M6 3h12"></path><path d="M6 8h12"></path><path d="m6 13 8.5 8"></path><path d="M6 13h3"></path><path d="M9 13c6.667 0 6.667-10 0-10"></path></svg>
);

const ActivityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-pulse w-3.5 h-3.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"></path></svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-pulse w-3.5 h-3.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"></path></svg>
);

const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list w-3.5 h-3.5"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>
);

const HospitalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2 w-3.5 h-3.5"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
);

const CancelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x w-3.5 h-3.5"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
);

const TreatmentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-stethoscope w-3.5 h-3.5"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>
);

const DischargeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-3.5 h-3.5"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
);

const PersonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user w-4 h-4 text-primary"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hospital w-3 h-3"><path d="M12 6v4"></path><path d="M14 14h-4"></path><path d="M14 18h-4"></path><path d="M14 8h-4"></path><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"></path><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"></path></svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar w-3 h-3"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
);

const ChevronRightIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="white" />
    </svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell w-4 h-4"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus w-5 h-5 text-primary-foreground"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house w-5 h-5 text-primary"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users w-5 h-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

const StaffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-cog w-5 h-5"><circle cx="18" cy="15" r="3"></circle><circle cx="9" cy="7" r="4"></circle><path d="M10 15H6a4 4 0 0 0-4 4v2"></path><path d="m21.7 16.4-.9-.3"></path><path d="m15.2 13.9-.9-.3"></path><path d="m16.6 18.7.3-.9"></path><path d="m19.1 12.2.3-.9"></path><path d="m19.6 18.7-.4-1"></path><path d="m16.8 12.3-.4-1"></path><path d="m14.3 16.6 1-.4"></path><path d="m20.7 13.8 1-.4"></path></svg>
);

const DocumentsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

// ============== COLOR MAPPINGS ==============
// Map API color strings to Tailwind classes
const colorVariants = {
    primary: {
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-500',
        valueColor: 'text-blue-600',
        titleColor: 'text-blue-500',
    },
    warning: {
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        valueColor: 'text-amber-600',
        titleColor: 'text-amber-500',
    },
    info: {
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-500',
        valueColor: 'text-purple-600',
        titleColor: 'text-purple-500',
    },
    success: {
        iconBg: 'bg-green-100',
        iconColor: 'text-green-500',
        valueColor: 'text-green-600',
        titleColor: 'text-green-500',
    },
    danger: {
        iconBg: 'bg-red-100',
        iconColor: 'text-red-500',
        valueColor: 'text-red-600',
        titleColor: 'text-red-500',
    },
    secondary: {
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-500',
        valueColor: 'text-gray-600',
        titleColor: 'text-gray-500',
    },
};

// Map stage titles to icons
const stageIcons = {
    'care initiated': HeartIcon,
    'registration': DocumentIcon,
    'hospitalisation': HospitalIcon,
    'hospitalization': HospitalIcon,
    'treatment cancelled': CancelIcon,
    'cancelled': CancelIcon,
    'undergoing treatment': TreatmentIcon,
    'treatment': TreatmentIcon,
    'discharge': DischargeIcon,
    'discharged': DischargeIcon,
    'default': ActivityIcon,
};

// ============== HELPER FUNCTIONS ==============
const getStageIcon = (title) => {
    const normalizedTitle = title?.toLowerCase() || '';
    for (const [key, icon] of Object.entries(stageIcons)) {
        if (normalizedTitle.includes(key)) {
            return icon;
        }
    }
    return stageIcons.default;
};

const getColorVariant = (color) => {
    return colorVariants[color] || colorVariants.primary;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const formatRevenue = (value) => {
    if (!value || value === 0) return '₹0';
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${Math.round(value / 1000)}K`;
    return `₹${value}`;
};

const formatExactRevenue = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value || 0);

const getInitials = (name) => {
    if (!name) return 'DR';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

// ============== SUB COMPONENTS ==============

// Primary Stats Card
const PrimaryStatsCard = ({ title, value, icon: Icon, variant, onClick }) => {
    const variants = {
        blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
        green: 'bg-gradient-to-br from-green-500 to-green-600',
        indigo: 'bg-gradient-to-br from-indigo-400 to-indigo-500',
    };

    return (
        <div
            className={`${variants[variant]} rounded-2xl p-3 text-white flex-1 min-w-0 ${onClick ? 'cursor-pointer active:scale-[0.97] transition-transform' : ''}`}
            onClick={onClick}
        >
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                <Icon />
            </div>
            <div className="text-xl font-bold mb-0.5 truncate">{value}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wide opacity-90 truncate">{title}</div>
        </div>
    );
};

// Status Card
const StatusCard = ({ stage, onClick }) => {
    const { title, value, latest_date, color } = stage;
    const colors = getColorVariant(color);
    const IconComponent = getStageIcon(title);

    return (
        <div
            className={`bg-white rounded-2xl p-3 border border-gray-100 shadow-sm shrink-0 min-w-0 ${onClick ? 'cursor-pointer active:scale-[0.97] transition-transform' : ''}`}
            onClick={onClick}
        >
            <div className={`w-9 h-9 ${colors.iconBg} ${colors.iconColor} rounded-xl flex items-center justify-center mb-3`}>
                <IconComponent />
            </div>
            <div className={`text-xl font-bold ${colors.valueColor} mb-0.5`}>{value}</div>
            <div className={`text-[10px] font-medium ${colors.titleColor} leading-tight`}>{title}</div>
            {latest_date && (
                <div className="text-[10px] text-gray-400 mt-1">
                    {formatDate(latest_date)}
                </div>
            )}
        </div>
    );
};

// Referral Card - Now clickable
const ReferralCard = ({ patient, onClick, t }) => {
    const statusConfig = getStatusConfig(patient.status);

    return (
        <div
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm cursor-pointer
                       hover:border-primary-200 hover:shadow-md transition-all active:scale-[0.99]"
            onClick={() => onClick(patient)}
        >
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 shrink-0">
                    <PersonIcon />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Name & Status */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                            {patient.deal_name || patient.full_name || patient.name || t('patients:noPatients')}
                        </h4>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                            {t('status:' + statusConfig.labelKey)}
                        </span>
                    </div>

                    {/* Gender & Age */}
                    <p className="text-sm text-gray-500 mb-2">
                        {patient.gender?.[0]?.toUpperCase() || 'N/A'}, {patient.age ? `${patient.age}${t('common:yrs')}` : 'N/A'}
                    </p>

                    {/* Hospital & Date */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                            <BuildingIcon />
                            {patient.hospital || patient.referred_to || patient.specialty || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                            <CalendarIcon />
                            {formatDate(patient.date || patient.created_at)}
                        </span>
                    </div>

                    {/* Specialty/Condition */}
                    <p className="text-sm text-primary-500 font-medium">
                        {patient.diagnosis || patient.specialty || patient.condition || t('patients:noDiagnosis')}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Bottom Navigation Item
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

// Loading Skeletons
const StatsSkeleton = () => (
    <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-2xl p-3 flex-1 min-w-0 animate-pulse h-28" />
        ))}
    </div>
);

const StatusSkeleton = () => (
    <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-2xl p-3 animate-pulse h-24" />
        ))}
    </div>
);

const ReferralSkeleton = () => (
    <div className="space-y-3">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Empty State
const EmptyState = ({ t }) => (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <UsersIcon />
        </div>
        <h4 className="text-gray-800 font-semibold mb-1">{t('dashboard:noRecentReferrals')}</h4>
        <p className="text-gray-500 text-sm">
            {t('dashboard:noRecentReferrals')}
        </p>
    </div>
);

// ============== MAIN DASHBOARD COMPONENT ==============
const DashboardPage = () => {
    const { user } = useAuth();
    const { t } = useTranslation(['dashboard', 'common', 'status', 'patients']);
    // console.log("USER: ", user)
    const toast = useToast();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        overview: {
            total_referred: 0,
            total_converted: 0,
            total_admitted: 0,
            total_revenue: 0,
        },
        stages: [],
        recent_referrals: [],
    });
    const [showOPDModal, setShowOPDModal] = useState(false);
    const [showRevenueDetail, setShowRevenueDetail] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/doctor/dashboard/');
            setStats(res.data);
        } catch (error) {
            console.error("Error fetching dashboard:", error);
            const errorMsg = error?.response?.data?.detail || error?.response?.data?.message || error?.message;
            toast.error(translateError(errorMsg, t));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleRegisterOPD = () => {
        setShowOPDModal(true);
    };

    const handleOPDClose = () => {
        setShowOPDModal(false);
        fetchDashboardData();
    };

    const handlePatientClick = (patient) => {
        setSelectedPatient(patient);
    };

    const handlePatientDetailClose = () => {
        setSelectedPatient(null);
    };

    const handlePatientUpdate = () => {
        fetchDashboardData();
    };

    const { overview, stages, recent_referrals } = stats;

    return (
        <PullToRefresh onRefresh={fetchDashboardData}>
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 px-5 pt-6 pb-20 rounded-b-[32px] safe-top">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                         <Link to="/profile">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {user?.profile_picture_url ? (
                                    <img
                                        src={user.profile_picture_url}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <span className="text-white text-xl font-bold">
                                        {getInitials(user?.doctor_name)}
                                    </span>
                                )}
                            </div>
                        </Link>
                        <div>
                            <p className="text-white/80 text-sm">{t('dashboard:welcomeBack')}</p>
                            <h1 className="text-white font-bold text-lg">
                                {user?.doctor_name || t('common:loading')}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Clinic Info Card */}
                <NavLink to='/profile'>
                    <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-white font-semibold text-base">
                                {user?.clinic?.name || 'Your Clinic'}
                            </h2>
                            <p className="text-white/70 text-sm">
                                {user?.registration_number || 'MCI-XXXX-XXXXX'}
                            </p>
                        </div>
                        <ChevronRightIcon className="text-white/70" />
                    </div>
                </NavLink>
            </div>

            {/* Stats Cards */}
            <div className="px-5 -mt-12">
                {loading ? (
                    <StatsSkeleton />
                ) : (
                    <div className="flex gap-3">
                        {overview.total_opd > 0 && (
                            <PrimaryStatsCard
                                title={t('dashboard:opd')}
                                value={overview.total_opd}
                                icon={ActivityIcon}
                                variant="blue"
                                onClick={() => navigate('/patients?tab=opd')}
                            />
                        )}
                        <PrimaryStatsCard
                            title={t('dashboard:referrals')}
                            value={overview.total_referred}
                            icon={SendIcon}
                            variant="blue"
                            onClick={() => navigate('/patients?tab=referrals')}
                        />
                        <PrimaryStatsCard
                            title={t('dashboard:treated')}
                            value={overview.total_converted}
                            icon={TrendingUpIcon}
                            variant="green"
                            onClick={() => navigate('/patients?tab=cases')}
                        />
                        {user?.can_view_financial && <PrimaryStatsCard
                            title={t('dashboard:revenue')}
                            value={formatRevenue(overview.total_revenue)}
                            icon={RupeeIcon}
                            variant="indigo"
                            onClick={() => setShowRevenueDetail(true)}
                        />}
                    </div>
                )}
            </div>

            {/* Patient Status Section */}
            <div className="px-5 mt-6">
                <h3 className="text-gray-800 font-semibold text-base mb-3">{t('dashboard:patientStatus')}</h3>
                {loading ? (
                    <StatusSkeleton />
                ) : (
                    <div className="grid grid-cols-3 gap-3">
                        {stages.length > 0 ? (
                            stages.map((stage, idx) => (
                                <StatusCard key={idx} stage={stage} onClick={() => navigate('/patients?tab=cases')} />
                            ))
                        ) : (
                            <>
                                <StatusCard stage={{ title: t('dashboard:careInitiated'), value: 0, color: 'primary' }} onClick={() => navigate('/patients?tab=cases')} />
                                <StatusCard stage={{ title: t('dashboard:registration'), value: 0, color: 'warning' }} onClick={() => navigate('/patients?tab=cases')} />
                                <StatusCard stage={{ title: t('dashboard:hospitalisation'), value: 0, color: 'info' }} onClick={() => navigate('/patients?tab=cases')} />
                                <StatusCard stage={{ title: t('dashboard:discharge'), value: 0, color: 'success' }} onClick={() => navigate('/patients?tab=cases')} />
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Recent Referrals Section */}
            <div className="px-5 mt-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-800 font-semibold text-base">{t('dashboard:recentReferrals')}</h3>
                    <NavLink to="/patients" className="text-primary-500 text-sm font-medium">
                        {t('dashboard:viewAll')}
                    </NavLink>
                </div>

                {loading ? (
                    <ReferralSkeleton />
                ) : recent_referrals.length > 0 ? (
                    <div className="space-y-3">
                        {recent_referrals.map((patient) => (
                            <ReferralCard
                                key={patient.id}
                                patient={patient}
                                onClick={handlePatientClick}
                                t={t}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState t={t} />
                )}
            </div>

            {/* Floating Action Button — OPD Registration */}
            <button
                onClick={handleRegisterOPD}
                className="fixed right-5 bottom-24 px-4 py-3 bg-green-500 text-white rounded-2xl shadow-lg shadow-green-500/30 flex items-center gap-2 z-40 hover:bg-green-600 active:scale-95 transition-all text-sm font-medium"
            >
                <PlusIcon /> {t('dashboard:opd')}
            </button>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-4 py-1 z-30 safe-bottom">
                <NavItem to="/dashboard" icon={HomeIcon} label={t('common:nav.home')} end />
                <NavItem to="/patients" icon={UsersIcon} label={t('common:nav.patients')} />
                {user?.role === 'owner' && (
                    <NavItem to="/staff" icon={StaffIcon} label={t('common:nav.staff')} />
                )}
            </nav>

            {/* Patient Detail Modal */}
            {selectedPatient && (
                <PatientDetailModal
                    patient={selectedPatient}
                    onClose={handlePatientDetailClose}
                    onUpdate={handlePatientUpdate}
                />
            )}

            {/* OPD Registration Modal */}
            {showOPDModal && (
                <NewOPDPatientModal onClose={handleOPDClose} />
            )}

            {/* Revenue Detail Bottom Sheet */}
            {showRevenueDetail && (
                <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowRevenueDetail(false)}>
                    <div className="absolute inset-0 bg-black/40" />
                    <div
                        className="relative w-full bg-white rounded-t-3xl px-6 pt-5 pb-10 safe-bottom"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Handle */}
                        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-500">
                                <RupeeIcon />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">{t('dashboard:totalRevenue', 'Total Revenue')}</p>
                                <p className="text-2xl font-bold text-gray-900">{formatExactRevenue(overview.total_revenue)}</p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 mb-4">{t('dashboard:revenueNote', 'Sum of bill values across all treated cases.')}</p>

                        <button
                            onClick={() => setShowRevenueDetail(false)}
                            className="w-full py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            {t('common:close')}
                        </button>
                    </div>
                </div>
            )}
        </div>
        </PullToRefresh>
    );
};

export default DashboardPage;
