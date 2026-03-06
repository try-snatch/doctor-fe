import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';

const CATEGORY_OPTIONS = [
    { value: 'Doctor Consultation', labelKey: 'documents:categories.doctor_consultation' },
    { value: 'Lab Tests', labelKey: 'documents:categories.lab_tests' },
    { value: 'Prescription', labelKey: 'documents:categories.prescription' },
    { value: 'Imaging/Scan', labelKey: 'documents:categories.imaging_scan' },
    { value: 'Health Record', labelKey: 'documents:categories.health_record' },
    { value: 'Others', labelKey: 'documents:categories.others' },
];

const CloseIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const CloudUploadIcon = () => (
    <svg className="w-8 h-8 mx-auto mb-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const PatientDocumentsModal = ({ patient, onClose }) => {
    const { t, i18n } = useTranslation(['documents', 'common']);
    const toast = useToast();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Others');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [expandedInsights, setExpandedInsights] = useState({});
    const [loadingInsights, setLoadingInsights] = useState({});
    const [sendingUploadLink, setSendingUploadLink] = useState(false);
    const fileInputRef = useRef(null);

    const patientId = patient.id;
    const patientName = patient.full_name || patient.name || 'Patient';
    const insightLangParam = i18n.language !== 'en' ? `?lang=${i18n.language}` : '';

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/patients/${patientId}/documents/${insightLangParam}`);
            setDocuments(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            toast.error(t('documents:failedToLoadDocs'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [patientId]);

    const MAX_FILES = 5;

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const allowed = ['pdf', 'jpg', 'jpeg', 'png', 'bmp', 'tiff', 'webp'];
        const validFiles = [];

        for (const file of files) {
            const ext = file.name.split('.').pop().toLowerCase();
            if (!allowed.includes(ext)) {
                toast.error(t('documents:unsupportedFileType', { name: file.name }));
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error(t('documents:fileTooLarge', { name: file.name }));
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length > 0) {
            setSelectedFiles((prev) => {
                const combined = [...prev, ...validFiles];
                if (combined.length > MAX_FILES) {
                    toast.error(t('documents:maxFilesExceeded', { max: MAX_FILES }));
                    return combined.slice(0, MAX_FILES);
                }
                return combined;
            });
        }
        // Reset input so re-selecting the same files triggers onChange
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        try {
            setUploading(true);
            let uploaded = 0;

            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('title', title || file.name.split('.').slice(0, -1).join('.'));
                formData.append('category', category);

                await api.post(`/api/patients/${patientId}/documents/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (e) => {
                        if (e.total) {
                            const fileProgress = Math.round((e.loaded * 100) / e.total);
                            const overallProgress = Math.round(((uploaded * 100) + fileProgress) / selectedFiles.length);
                            setUploadProgress(overallProgress);
                        }
                    },
                });
                uploaded++;
            }

            toast.success(t('documents:uploadSuccess', { count: uploaded }));
            setSelectedFiles([]);
            setTitle('');
            setCategory('Others');
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchDocuments();
        } catch (error) {
            toast.error(t('documents:failedToUpload'));
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (docId) => {
        if (!window.confirm(t('documents:deleteConfirm'))) return;
        try {
            await api.delete(`/api/patients/${patientId}/documents/${docId}/`);
            toast.success(t('documents:documentDeleted'));
            setDocuments((docs) => docs.filter((d) => d.id !== docId));
        } catch (error) {
            toast.error(t('documents:failedToDeleteDoc'));
        }
    };

    const pollingRefs = useRef({});

    // Clean up any active polls on unmount
    useEffect(() => {
        return () => {
            Object.values(pollingRefs.current).forEach(clearTimeout);
        };
    }, []);

    const handleGetInsights = async (docId) => {
        setLoadingInsights((prev) => ({ ...prev, [docId]: true }));
        try {
            const res = await api.get(`/api/patients/${patientId}/documents/${docId}/insights/${insightLangParam}`);
            if (res.status === 202) {
                // Processing started — poll until ready
                pollForInsights(docId);
                return;
            }
            setDocuments((docs) =>
                docs.map((d) => (d.id === docId ? { ...d, insight: res.data, ai_processed: true } : d))
            );
            setExpandedInsights((prev) => ({ ...prev, [docId]: true }));
            setLoadingInsights((prev) => ({ ...prev, [docId]: false }));
        } catch (error) {
            toast.error(t('documents:failedToGenerateInsights'));
            setLoadingInsights((prev) => ({ ...prev, [docId]: false }));
        }
    };

    const pollForInsights = (docId, attempt = 0) => {
        const MAX_ATTEMPTS = 20; // ~60s total (3s intervals)
        if (attempt >= MAX_ATTEMPTS) {
            setLoadingInsights((prev) => ({ ...prev, [docId]: false }));
            toast.error(t('documents:insightsTakingLong'));
            return;
        }
        pollingRefs.current[docId] = setTimeout(async () => {
            try {
                const res = await api.get(`/api/patients/${patientId}/documents/${docId}/insights/${insightLangParam}`);
                if (res.status === 202) {
                    pollForInsights(docId, attempt + 1);
                    return;
                }
                // 200 — insights ready
                delete pollingRefs.current[docId];
                setDocuments((docs) =>
                    docs.map((d) => (d.id === docId ? { ...d, insight: res.data, ai_processed: true } : d))
                );
                setExpandedInsights((prev) => ({ ...prev, [docId]: true }));
                setLoadingInsights((prev) => ({ ...prev, [docId]: false }));
            } catch (error) {
                delete pollingRefs.current[docId];
                setLoadingInsights((prev) => ({ ...prev, [docId]: false }));
                toast.error(t('documents:failedToGenerateInsights'));
            }
        }, 3000);
    };

    const toggleInsights = (docId) => {
        setExpandedInsights((prev) => ({ ...prev, [docId]: !prev[docId] }));
    };

    const handleSendUploadLink = async () => {
        try {
            setSendingUploadLink(true);
            const res = await api.post(`/api/patients/${patientId}/document-upload-link/`);
            const parts = [];
            if (res.data.email_sent) parts.push('email');
            if (res.data.sms_sent) parts.push('SMS');
            if (parts.length > 0) {
                toast.success(t('documents:uploadLinkSentVia', { channels: parts.join(' and ') }));
            } else {
                toast.success(t('documents:uploadLinkGenerated'));
            }
        } catch (error) {
            toast.error(t('documents:failedToSendLink'));
        } finally {
            setSendingUploadLink(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                    <h2 className="font-bold text-gray-900 text-lg">{t('documents:documentsFor', { name: patientName })}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* Upload section */}
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-700 text-sm mb-3">{t('documents:uploadDocument')}</h3>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.bmp,.tiff,.webp"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-primary-300 rounded-xl p-5 text-center text-sm text-gray-500 hover:border-primary-500 hover:bg-primary-50 transition-colors"
                        >
                            <CloudUploadIcon />
                            <span className="font-medium text-gray-600">{t('documents:tapToSelect')}</span>
                            <br />
                            <span className="text-xs text-gray-400">{t('documents:fileTypesAllowed')}</span>
                        </button>

                        {selectedFiles.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {/* Selected files list */}
                                <div className="space-y-1.5">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 font-medium truncate">{file.name}</p>
                                                <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                                            </div>
                                            <button
                                                onClick={() => removeSelectedFile(index)}
                                                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {/* <input
                                    type="text"
                                    placeholder="Title (optional — applies to all)"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary-400 transition-colors"
                                /> */}
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary-400 bg-white transition-colors"
                                >
                                    {CATEGORY_OPTIONS.map((c) => (
                                        <option key={c.value} value={c.value}>{t(c.labelKey)}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="w-full py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? t('documents:uploading', { progress: uploadProgress }) : t('documents:uploadCount', { count: selectedFiles.length })}
                                </button>
                            </div>
                        )}

                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <button
                                onClick={handleSendUploadLink}
                                disabled={sendingUploadLink}
                                className="w-full py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {sendingUploadLink ? (
                                    t('documents:sending')
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        {t('documents:sendUploadLink')}
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-gray-400 text-center mt-1">
                                {t('documents:sendUploadLinkDesc')}
                            </p>
                        </div>
                    </div>

                    {/* Documents list */}
                    <div className="px-5 py-4">
                        {loading ? (
                            <div className="text-center py-8 text-gray-400 text-sm">{t('documents:loading')}</div>
                        ) : documents.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">{t('documents:noDocuments')}</div>
                        ) : (
                            <div className="space-y-3">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="border border-gray-100 rounded-2xl p-4">
                                        {/* Doc info */}
                                        <div className="mb-3">
                                            <p className="font-medium text-gray-900 text-sm truncate">
                                                {doc.title || t('documents:untitled')}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {doc.category} · {doc.file_extension?.toUpperCase()} · {formatFileSize(doc.file_size)} · {formatDate(doc.uploaded_at)}
                                            </p>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex flex-wrap gap-2">
                                            {doc.presigned_url && (
                                                <a
                                                    href={doc.presigned_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    {t('documents:download')}
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                {t('documents:delete')}
                                            </button>
                                            {doc.insight ? (
                                                <button
                                                    onClick={() => toggleInsights(doc.id)}
                                                    className="px-3 py-1.5 bg-green-50 text-green-600 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors"
                                                >
                                                    {expandedInsights[doc.id] ? t('documents:hideInsights') : t('documents:viewInsights')}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleGetInsights(doc.id)}
                                                    disabled={loadingInsights[doc.id]}
                                                    className="px-3 py-1.5 bg-purple-50 text-purple-600 text-xs font-medium rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                                                >
                                                    {loadingInsights[doc.id] ? t('documents:analyzing') : t('documents:getInsights')}
                                                </button>
                                            )}
                                        </div>

                                        {/* AI processing indicator */}
                                        {doc.ai_processed && !doc.insight && !loadingInsights[doc.id] && (
                                            <p className="text-xs text-gray-400 mt-2">{t('documents:aiProcessing')}</p>
                                        )}

                                        {/* AI Insights panel */}
                                        {expandedInsights[doc.id] && doc.insight && (
                                            doc.insight.title === 'Could Not Process Document' ? (
                                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                                                <span className="text-amber-500 shrink-0 mt-0.5">⚠</span>
                                                <p className="text-xs text-amber-800">{doc.insight.summary}</p>
                                            </div>
                                            ) : (
                                            <div className="mt-3 p-3 bg-purple-50 rounded-xl space-y-2">
                                                <p className="font-semibold text-purple-800 text-xs">{doc.insight.title}</p>
                                                <p className="text-xs text-gray-700">{doc.insight.summary}</p>

                                                {doc.insight.key_findings?.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-600 mb-1">{t('documents:keyFindings')}</p>
                                                        <ul className="space-y-0.5">
                                                            {doc.insight.key_findings.map((f, i) => (
                                                                <li key={i} className="text-xs text-gray-600 flex gap-1">
                                                                    <span className="text-purple-400 shrink-0">•</span> {f}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {doc.insight.risk_flags?.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-red-600 mb-1">{t('documents:riskFlags')}</p>
                                                        <ul className="space-y-0.5">
                                                            {doc.insight.risk_flags.map((f, i) => (
                                                                <li key={i} className="text-xs text-red-600 flex gap-1">
                                                                    <span className="shrink-0">⚠</span> {f}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {doc.insight.tags?.length > 0 && (
                                                    <div className="flex gap-1 flex-wrap">
                                                        {doc.insight.tags.map((tag, i) => (
                                                            <span
                                                                key={i}
                                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                    tag === 'high'
                                                                        ? 'bg-red-100 text-red-600'
                                                                        : tag === 'medium'
                                                                        ? 'bg-yellow-100 text-yellow-600'
                                                                        : 'bg-green-100 text-green-600'
                                                                }`}
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDocumentsModal;
