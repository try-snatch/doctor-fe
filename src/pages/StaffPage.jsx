import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { translateError } from '../i18n/errorMap';
import AddStaffModal from '../components/AddStaffModal';
import StaffDetailModal from '../components/StaffDetailModal';
import PullToRefresh from '../components/PullToRefresh';

// ============== ICONS ==============
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus w-3.5 h-3.5"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
);

const PersonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-4 h-4 text-primary"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-3 h-3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-3 h-3"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 w-3.5 h-3.5"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
);

const ShieldOffIcon = () => (
    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="currentColor" />
    </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house w-5 h-5 text-primary"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-5 h-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

const StaffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-cog w-5 h-5"><circle cx="18" cy="15" r="3"></circle><circle cx="9" cy="7" r="4"></circle><path d="M10 15H6a4 4 0 0 0-4 4v2"></path><path d="m21.7 16.4-.9-.3"></path><path d="m15.2 13.9-.9-.3"></path><path d="m16.6 18.7.3-.9"></path><path d="m19.1 12.2.3-.9"></path><path d="m19.6 18.7-.4-1"></path><path d="m16.8 12.3-.4-1"></path><path d="m14.3 16.6 1-.4"></path><path d="m20.7 13.8 1-.4"></path></svg>
);

const DocumentsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const EmptyIcon = () => (
    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor" />
    </svg>
);

const FinanceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield w-2.5 h-2.5 mr-0.5"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
);

// ============== HELPERS ==============
const formatPhone = (phone) => {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 10) {
        return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
    }
    if (clean.length > 10) {
        const last10 = clean.slice(-10);
        return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
    }
    return phone;
};

const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getRoleLabel = (role, t) => {
    const roleMap = {
        receptionist: t('staff:receptionist'),
        nurse: t('staff:nurse'),
        other: t('staff:other'),
    };
    return roleMap[role?.toLowerCase()] || capitalizeFirst(role);
};

const getStatusBadge = (status, t) => {
    switch (status) {
        case 'active':
            return {
                label: t('staff:active'),
                classes: 'px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200'
            };
        case 'pending':
            return {
                label: t('staff:pending'),
                classes: 'px-2.5 py-0.5 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200'
            };
        case 'inactive':
            return {
                label: t('staff:inactive'),
                classes: 'px-2.5 py-0.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200'
            };
        default:
            return {
                label: status || t('staff:unknown'),
                classes: 'px-2.5 py-0.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200'
            };
    }
};

// ============== STAFF CARD COMPONENT ==============
const StaffCard = ({ member, onDelete, onResendInvitation, t }) => {
    const fullName = `${member.first_name || ''} ${member.last_name || ''}`.trim() || t('staff:unknown');
    const role = getRoleLabel(member.role, t);
    const phone = formatPhone(member.mobile);
    const email = member.email || '';
    const hasFinancialAccess = member.can_view_financial;
    const accountStatus = member.account_status || 'active';
    const invitationSentAt = member.invitation_sent_at;
    const statusBadge = getStatusBadge(accountStatus, t);

    const profilePicUrl = member.profile_picture_url;

    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-blue-50 flex items-center justify-center text-primary-400">
                    {profilePicUrl ? (
                        <img
                            src={profilePicUrl}
                            alt={fullName}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'; }}
                        />
                    ) : (
                        <PersonIcon />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Name Row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                            <h4 className="font-semibold text-gray-900">{fullName}</h4>
                            {/* Badges */}
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                    {role}
                                </span>
                                <span className={statusBadge.classes}>
                                    {statusBadge.label}
                                </span>
                                {hasFinancialAccess && (
                                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 text-xs font-medium rounded-full flex items-center gap-1 border border-amber-200">
                                        <FinanceIcon />
                                        {t('staff:finance')}
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Delete Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(member);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400
                                     hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <TrashIcon />
                        </button>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1">
                        {phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <PhoneIcon />
                                <span>{phone}</span>
                            </div>
                        )}
                        {email && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <EmailIcon />
                                <span className="truncate">{email}</span>
                            </div>
                        )}
                    </div>

                    {/* Invitation Info & Resend Button */}
                    {accountStatus === 'pending' && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between gap-2">
                                <div className="text-xs text-gray-500">
                                    {invitationSentAt ? (
                                        <>{t('staff:invited', { time: formatDate(invitationSentAt) })}</>
                                    ) : (
                                        <>{t('staff:invitationPending')}</>
                                    )}
                                </div>
                                {/* <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onResendInvitation(member);
                                    }}
                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg
                                             hover:bg-blue-100 transition-colors"
                                >
                                    {t('staff:resendInvitation')}
                                </button> */}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ============== SKELETON & EMPTY STATES ==============
const StaffSkeleton = () => (
    <div className="space-y-3">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                        <div className="flex justify-between mb-2">
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                                <div className="h-5 bg-gray-200 rounded-full w-20" />
                            </div>
                            <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-36 mb-1" />
                        <div className="h-3 bg-gray-200 rounded w-44" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const EmptyState = ({ onAddStaff, t }) => (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center mt-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <EmptyIcon />
        </div>
        <h4 className="text-gray-800 font-semibold mb-1">{t('staff:noStaff')}</h4>
        <p className="text-gray-500 text-sm mb-4">
            {t('staff:addFirstMember')}
        </p>
        <button
            onClick={onAddStaff}
            className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
        >
            {t('staff:addStaffMember')}
        </button>
    </div>
);

const AccessDenied = ({ t }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <ShieldOffIcon />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('staff:accessDenied')}</h2>
            <p className="text-gray-500">{t('staff:ownerOnly')}</p>
            <NavLink
                to="/dashboard"
                className="inline-block mt-4 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
            >
                {t('staff:goToDashboard')}
            </NavLink>
        </div>
    </div>
);

// ============== DELETE CONFIRMATION ==============
const DeleteConfirmModal = ({ member, onConfirm, onCancel, loading, t }) => {
    const fullName = `${member?.first_name || ''} ${member?.last_name || ''}`.trim();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />
            <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <TrashIcon />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{t('staff:removeStaffTitle')}</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        {t('staff:removeStaffMessage', { name: fullName })}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-gray-700 font-medium
                                     hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {t('common:cancel')}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium
                                     hover:bg-red-600 transition-colors disabled:opacity-50
                                     flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t('staff:removing')}
                                </>
                            ) : (
                                t('staff:remove')
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============== MAIN COMPONENT ==============
const StaffPage = () => {
    const { user } = useAuth();
    const toast = useToast();
    const { t } = useTranslation(['staff', 'common']);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [deletingMember, setDeletingMember] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // for quick detail modal
    const [selectedStaff, setSelectedStaff] = useState(null);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/staff/');
            setStaff(res.data);
        } catch (error) {
            console.error("Error fetching staff:", error);
            const errorMsg = error.response?.data?.detail || error.response?.data?.message || error.message;
            toast.error(translateError(errorMsg, t));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'owner') {
            fetchStaff();
        }
    }, [user]);

    const handleAddStaff = () => {
        setEditingMember(null);
        setShowAddModal(true);
    };

    const handleEditStaff = (member) => {
        // open add/edit modal (full form) if you want to do heavy edits
        setEditingMember(member);
        setShowAddModal(true);
    };

    const handleModalClose = () => {
        setShowAddModal(false);
        setEditingMember(null);
    };

    const handleModalSuccess = () => {
        fetchStaff();
    };

    const handleDeleteClick = (member) => {
        setDeletingMember(member);
    };

    const handleDeleteCancel = () => {
        setDeletingMember(null);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingMember) return;

        setDeleteLoading(true);

        try {
            await api.delete(`/api/staff/${deletingMember.id}/`);
            setStaff(prev => prev.filter(s => s.id !== deletingMember.id));
            toast.success(t('staff:staffRemoved'));
            setDeletingMember(null);
        } catch (error) {
            console.error("Error deleting staff:", error);
            const errorMsg = error.response?.data?.detail || error.response?.data?.message || error.message;
            toast.error(translateError(errorMsg, t));
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleResendInvitation = async (member) => {
        // TODO: Call backend endpoint to resend invitation email
        // Example: await axios.post(`/staff/${member.id}/resend-invitation/`);
        toast.info(`Resend invitation for ${member.first_name} ${member.last_name} - Backend endpoint not yet implemented`);
    };

    // Quick detail modal handlers
    const handleOpenStaffDetail = (member) => {
        setSelectedStaff(member);
    };

    const handleCloseStaffDetail = () => {
        setSelectedStaff(null);
    };

    const handleStaffUpdated = () => {
        fetchStaff();
    };

    // Check if user is owner
    if (user?.role !== 'owner') {
        return <AccessDenied t={t} />;
    }

    return (
        <PullToRefresh onRefresh={fetchStaff}>
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white px-5 pt-6 pb-4 sticky top-0 z-20 border-b border-gray-100 safe-top">
                {/* Title Row */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{t('staff:title')}</h1>
                        <p className="text-sm text-gray-500">
                            {loading ? '...' : t('staff:memberCount', { count: staff.length })}
                        </p>
                    </div>
                    <button
                        onClick={handleAddStaff}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl
                                 hover:bg-primary-600 active:bg-primary-700 transition-colors shadow-button"
                    >
                        <PlusIcon />
                        {t('staff:add')}
                    </button>
                </div>
            </header>

            {/* Staff List */}
            <div className="px-5 py-4">
                {loading ? (
                    <StaffSkeleton />
                ) : staff.length > 0 ? (
                    <div className="space-y-3">
                        {staff.map((member) => (
                            <div
                                key={member.id}
                                onClick={() => handleOpenStaffDetail(member)}
                                className="cursor-pointer"
                            >
                                <StaffCard
                                    member={member}
                                    onDelete={handleDeleteClick}
                                    onResendInvitation={handleResendInvitation}
                                    t={t}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState onAddStaff={handleAddStaff} t={t} />
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100
                          flex items-center justify-around px-4 py-1 z-30 safe-bottom">
                <NavLink to="/dashboard" end className={({isActive}) => isActive ? 'text-primary-500 flex flex-col items-center py-2' : 'text-gray-400 flex flex-col items-center py-2'}>
                    <HomeIcon />
                    <span className="text-xs font-medium">{t('common:nav.home')}</span>
                </NavLink>
                <NavLink to="/patients" className={({isActive}) => isActive ? 'text-primary-500 flex flex-col items-center py-2' : 'text-gray-400 flex flex-col items-center py-2'}>
                    <UsersIcon />
                    <span className="text-xs font-medium">{t('common:nav.patients')}</span>
                </NavLink>
                {/* <NavLink to="/patient-documents" className={({isActive}) => isActive ? 'text-primary-500 flex flex-col items-center py-2' : 'text-gray-400 flex flex-col items-center py-2'}>
                    <DocumentsIcon />
                    <span className="text-xs font-medium">{t('common:nav.documents')}</span>
                </NavLink> */}
                <NavLink to="/staff" className={({isActive}) => isActive ? 'text-primary-500 flex flex-col items-center py-2' : 'text-gray-400 flex flex-col items-center py-2'}>
                    <StaffIcon />
                    <span className="text-xs font-medium">{t('common:nav.staff')}</span>
                </NavLink>
            </nav>

            {/* Add/Edit Staff Modal */}
            {showAddModal && (
                <AddStaffModal
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                    editData={editingMember}
                />
            )}

            {/* Staff Detail Modal (quick edit) */}
            {selectedStaff && (
                <StaffDetailModal
                    staff={selectedStaff}
                    onClose={handleCloseStaffDetail}
                    onUpdate={handleStaffUpdated}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deletingMember && (
                <DeleteConfirmModal
                    member={deletingMember}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    loading={deleteLoading}
                    t={t}
                />
            )}
        </div>
        </PullToRefresh>
    );
};

export default StaffPage;
