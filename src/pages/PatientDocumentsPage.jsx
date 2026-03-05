import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// ============== ICONS ==============
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

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const FileIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const DownloadIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SparklesIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const PersonIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const EmptyIcon = () => (
    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

// ============== HELPER FUNCTIONS ==============
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

// Group documents by patient
const groupDocumentsByPatient = (documents) => {
    const grouped = {};
    documents.forEach(doc => {
        const key = doc.patient_zoho_id;
        if (!grouped[key]) {
            grouped[key] = {
                patient_zoho_id: doc.patient_zoho_id,
                patient_name: doc.patient_name,
                patient_email: doc.patient_email,
                patient_phone: doc.patient_phone,
                documents: [],
                documentCount: 0,
                latestDate: doc.shared_at,
            };
        }
        grouped[key].documents.push(doc);
        grouped[key].documentCount++;
        // Keep track of most recent share date
        if (new Date(doc.shared_at) > new Date(grouped[key].latestDate)) {
            grouped[key].latestDate = doc.shared_at;
        }
    });

    // Convert to array and sort by latest date
    return Object.values(grouped).sort((a, b) =>
        new Date(b.latestDate) - new Date(a.latestDate)
    );
};

// ============== PATIENT CARD ==============
const PatientDocumentCard = ({ patientData, onClick, t }) => {
    const { patient_name, patient_phone, documentCount, latestDate } = patientData;

    return (
        <div
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm cursor-pointer
                       hover:border-primary-200 hover:shadow-md transition-all active:scale-[0.99]"
            onClick={() => onClick(patientData)}
        >
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-blue-50 text-blue-500">
                    <PersonIcon />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Name & Document Count */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                            {patient_name}
                        </h4>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 bg-blue-50 text-blue-700 border-blue-200">
                            {t('documents:documentCount', { count: documentCount })}
                        </span>
                    </div>

                    {/* Phone */}
                    <p className="text-sm text-gray-500 mb-2">
                        {patient_phone}
                    </p>

                    {/* Latest Share Date */}
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <CalendarIcon />
                        <span>{t('documents:latest', { date: formatDate(latestDate) })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============== DOCUMENT LIST ITEM ==============
const DocumentListItem = ({ document, onClick, t }) => {
    const getCategoryColor = (category) => {
        const colors = {
            'Doctor Consultation': 'bg-purple-50 text-purple-700 border-purple-200',
            'Health Record': 'bg-green-50 text-green-700 border-green-200',
            'Lab Tests': 'bg-blue-50 text-blue-700 border-blue-200',
            'Prescription': 'bg-red-50 text-red-700 border-red-200',
            'Imaging/Scan': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'Insurance': 'bg-gray-50 text-gray-700 border-gray-200',
            'Others': 'bg-gray-50 text-gray-700 border-gray-200',
        };
        return colors[category] || colors['Others'];
    };

    return (
        <div
            className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm cursor-pointer
                       hover:border-primary-200 hover:shadow-md transition-all active:scale-[0.99]"
            onClick={() => onClick(document)}
        >
            <div className="flex items-start gap-3">
                {/* File Icon */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-red-50 text-red-500">
                    <FileIcon />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 text-sm truncate mb-1">
                        {document.title}
                    </h5>

                    <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(document.category)}`}>
                            {document.category}
                        </span>
                        {document.has_insights && (
                            <span className="text-xs px-2 py-0.5 rounded-full border bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
                                <SparklesIcon />
                                {t('documents:aiInsights')}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <CalendarIcon />
                        <span>{t('documents:uploaded', { date: formatDate(document.uploaded_at) })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============== DOCUMENT DETAIL MODAL ==============
const DocumentDetailModal = ({ document, onClose, t }) => {
    const toast = useToast();
    const [documentDetails, setDocumentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchDocumentDetails();
    }, [document.id]);

    const fetchDocumentDetails = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/patient-documents/${document.id}/`);
            setDocumentDetails(res.data);
        } catch (error) {
            console.error('Error fetching document details:', error);
            toast.error(t('documents:failedToLoadDetails'));
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!documentDetails?.presigned_url) {
            toast.error(t('documents:downloadUrlNotAvailable'));
            return;
        }

        try {
            setDownloading(true);

            // Fetch the file from presigned URL
            const response = await fetch(documentDetails.presigned_url);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = window.document.createElement('a');
            a.href = url;
            a.download = documentDetails.title || 'document';
            window.document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            window.document.body.removeChild(a);

            toast.success(t('documents:downloadSuccess'));
        } catch (error) {
            console.error('Error downloading document:', error);
            toast.error(t('documents:failedToDownload'));
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">{t('documents:documentDetails')}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                            <div className="h-20 bg-gray-200 rounded animate-pulse" />
                        </div>
                    ) : documentDetails ? (
                        <div className="space-y-6">
                            {/* Patient Info */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('documents:patientInformation')}</h4>
                                <div className="space-y-1 text-sm">
                                    <p><span className="text-gray-500">{t('documents:nameLabel')}</span> <span className="text-gray-900 font-medium">{documentDetails.patient_name}</span></p>
                                    <p><span className="text-gray-500">{t('documents:emailLabel')}</span> <span className="text-gray-900">{documentDetails.patient_email}</span></p>
                                    <p><span className="text-gray-500">{t('documents:phoneLabel')}</span> <span className="text-gray-900">{documentDetails.patient_phone}</span></p>
                                </div>
                            </div>

                            {/* Document Info */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('documents:documentInformation')}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 min-w-24">{t('documents:titleLabel')}</span>
                                        <span className="text-gray-900 font-medium">{documentDetails.title}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 min-w-24">{t('documents:categoryLabel')}</span>
                                        <span className="text-gray-900">{documentDetails.category}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 min-w-24">{t('documents:uploadedLabel')}</span>
                                        <span className="text-gray-900">{formatDate(documentDetails.uploaded_at)}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 min-w-24">{t('documents:sharedLabel')}</span>
                                        <span className="text-gray-900">{formatDate(documentDetails.shared_at)}</span>
                                    </div>
                                    {documentDetails.file_size && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-gray-500 min-w-24">{t('documents:sizeLabel')}</span>
                                            <span className="text-gray-900">{(documentDetails.file_size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* AI Insights */}
                            {documentDetails.insights && (
                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                    <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                                        <SparklesIcon />
                                        {t('documents:aiInsights')}
                                    </h4>

                                    {documentDetails.insights.summary && (
                                        <div className="mb-4">
                                            <h5 className="text-xs font-semibold text-purple-800 mb-1">{t('documents:summary')}</h5>
                                            <p className="text-sm text-purple-900">{documentDetails.insights.summary}</p>
                                        </div>
                                    )}

                                    {documentDetails.insights.key_findings && documentDetails.insights.key_findings.length > 0 && (
                                        <div className="mb-4">
                                            <h5 className="text-xs font-semibold text-purple-800 mb-2">{t('documents:keyFindings')}</h5>
                                            <ul className="space-y-1">
                                                {documentDetails.insights.key_findings.map((finding, idx) => (
                                                    <li key={idx} className="text-sm text-purple-900 flex items-start gap-2">
                                                        <span className="text-purple-400 mt-1">•</span>
                                                        <span>{finding}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {documentDetails.insights.risk_flags && documentDetails.insights.risk_flags.length > 0 && (
                                        <div className="mb-4">
                                            <h5 className="text-xs font-semibold text-red-800 mb-2">{t('documents:riskFlags')}</h5>
                                            <ul className="space-y-1">
                                                {documentDetails.insights.risk_flags.map((flag, idx) => (
                                                    <li key={idx} className="text-sm text-red-900 flex items-start gap-2 bg-red-50 rounded px-2 py-1">
                                                        <span className="text-red-400 mt-1">⚠</span>
                                                        <span>{flag}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {documentDetails.insights.tags && documentDetails.insights.tags.length > 0 && (
                                        <div>
                                            <h5 className="text-xs font-semibold text-purple-800 mb-2">{t('documents:tags')}</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {documentDetails.insights.tags.map((tag, idx) => (
                                                    <span key={idx} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">{t('documents:failedToLoadDetails')}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
                    <button
                        onClick={handleDownload}
                        disabled={downloading || !documentDetails?.presigned_url}
                        className="w-full px-4 py-3 bg-primary-500 text-white font-semibold rounded-xl
                                 hover:bg-primary-600 active:bg-primary-700 transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <DownloadIcon />
                        {downloading ? t('documents:downloading') : t('documents:downloadDocument')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============== PATIENT DOCUMENTS LIST MODAL ==============
const PatientDocumentsListModal = ({ patientData, onClose, onDocumentClick, t }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{patientData.patient_name}</h3>
                            <p className="text-sm text-gray-500">{patientData.patient_phone}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        {t('documents:sharedDocuments')} ({patientData.documentCount})
                    </h4>
                    <div className="space-y-2">
                        {patientData.documents.map((doc) => (
                            <DocumentListItem
                                key={doc.id}
                                document={doc}
                                onClick={onDocumentClick}
                                t={t}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============== BOTTOM NAV ITEM ==============
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

// ============== LOADING SKELETON ==============
const DocumentSkeleton = () => (
    <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                        <div className="flex justify-between mb-2">
                            <div className="h-4 bg-gray-200 rounded w-1/3" />
                            <div className="h-5 bg-gray-200 rounded-full w-20" />
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// ============== EMPTY STATE ==============
const EmptyState = ({ searchTerm, t }) => (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center mt-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <EmptyIcon />
        </div>
        {searchTerm ? (
            <>
                <h4 className="text-gray-800 font-semibold mb-1">{t('documents:noResultsFound')}</h4>
                <p className="text-gray-500 text-sm">
                    {t('documents:noMatch', { term: searchTerm })}
                </p>
            </>
        ) : (
            <>
                <h4 className="text-gray-800 font-semibold mb-1">{t('documents:noSharedDocumentsYet')}</h4>
                <p className="text-gray-500 text-sm">
                    {t('documents:documentsAppearHere')}
                </p>
            </>
        )}
    </div>
);

// ============== MAIN COMPONENT ==============
const PatientDocumentsPage = () => {
    const { user } = useAuth();
    const toast = useToast();
    const { t } = useTranslation(['documents', 'common']);
    const [documents, setDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/patient-documents/');
            const docs = Array.isArray(res.data) ? res.data : [];
            console.log(res)
            console.log('Fetched documents:', docs);
            setDocuments(docs);
        } catch (error) {
            console.error("Error fetching documents:", error);
            toast.error(t('documents:failedToLoad'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // Group documents by patient
    const groupedPatients = groupDocumentsByPatient(documents);

    // Filter patients based on search term
    const filteredPatients = groupedPatients.filter(p => {
        const searchLower = searchTerm.toLowerCase();
        const name = (p.patient_name || '').toLowerCase();
        const phone = (p.patient_phone || '').toLowerCase();
        const email = (p.patient_email || '').toLowerCase();

        return name.includes(searchLower) ||
               phone.includes(searchLower) ||
               email.includes(searchLower);
    });

    const handlePatientClick = (patientData) => {
        setSelectedPatient(patientData);
    };

    const handlePatientModalClose = () => {
        setSelectedPatient(null);
    };

    const handleDocumentClick = (document) => {
        setSelectedDocument(document);
        setSelectedPatient(null); // Close patient modal
    };

    const handleDocumentModalClose = () => {
        setSelectedDocument(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white px-5 pt-6 pb-4 sticky top-0 z-20 border-b border-gray-100 safe-top">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{t('documents:title')}</h1>
                    <p className="text-sm text-gray-500">
                        {loading ? '...' : t('documents:patientsWithDocs', { count: filteredPatients.length })}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder={t('documents:searchPatients')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 text-base text-gray-900 bg-gray-50
                                 border border-gray-200 rounded-xl outline-none
                                 transition-all duration-200 placeholder:text-gray-400
                                 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                </div>
            </header>

            {/* Patient List */}
            <div className="px-5 py-4">
                {loading ? (
                    <DocumentSkeleton />
                ) : filteredPatients.length > 0 ? (
                    <div className="space-y-3">
                        {filteredPatients.map((patientData) => (
                            <PatientDocumentCard
                                key={patientData.patient_zoho_id}
                                patientData={patientData}
                                onClick={handlePatientClick}
                                t={t}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState searchTerm={searchTerm} t={t} />
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100
                          flex items-center justify-around px-4 py-1 z-30 safe-bottom">
                <NavItem to="/dashboard" icon={HomeIcon} label={t('common:nav.home')} end />
                <NavItem to="/patients" icon={UsersIcon} label={t('common:nav.patients')} />
                <NavItem to="/patient-documents" icon={DocumentsIcon} label={t('common:nav.documents')} />
                {user?.role === 'owner' && (
                    <NavItem to="/staff" icon={StaffIcon} label={t('common:nav.staff')} />
                )}
            </nav>

            {/* Patient Documents List Modal */}
            {selectedPatient && (
                <PatientDocumentsListModal
                    patientData={selectedPatient}
                    onClose={handlePatientModalClose}
                    onDocumentClick={handleDocumentClick}
                    t={t}
                />
            )}

            {/* Document Detail Modal */}
            {selectedDocument && (
                <DocumentDetailModal
                    document={selectedDocument}
                    onClose={handleDocumentModalClose}
                    t={t}
                />
            )}
        </div>
    );
};

export default PatientDocumentsPage;
