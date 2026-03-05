// Status badge config — covers local statuses, Zoho stage headings, and lead states

export const getStatusConfig = (status) => {
    if (!status) {
        return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', labelKey: 'unknown' };
    }

    const s = status.toLowerCase();

    if (s === 'opd')
        return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', labelKey: 'opd' };

    if (s === 'referred' || s === 'referral pending')
        return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', labelKey: 'referred' };

    if (s === 'care initiated')
        return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', labelKey: 'careInitiated' };

    if (s === 'registration')
        return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', labelKey: 'registration' };

    if (s === 'hospitalisation' || s === 'hospitalization')
        return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', labelKey: 'hospitalised' };

    if (s === 'undergoing treatment' || s.includes('treatment') || s.includes('ongoing'))
        return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', labelKey: 'inTreatment' };

    if (s === 'discharge' || s === 'discharged')
        return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', labelKey: 'discharged' };

    if (s === 'treatment cancelled' || s === 'cancelled')
        return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', labelKey: 'cancelled' };

    if (s === 'converted')
        return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', labelKey: 'converted' };

    if (s.includes('billing') || s.includes('billed'))
        return { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', labelKey: 'billed' };

    return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', labelKey: 'unknown' };
};
