import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enPatients from './locales/en/patients.json';
import enStaff from './locales/en/staff.json';
import enProfile from './locales/en/profile.json';
import enValidation from './locales/en/validation.json';
import enStatus from './locales/en/status.json';
import enDocuments from './locales/en/documents.json';
import enMou from './locales/en/mou.json';

// Hindi
import hiCommon from './locales/hi/common.json';
import hiAuth from './locales/hi/auth.json';
import hiDashboard from './locales/hi/dashboard.json';
import hiPatients from './locales/hi/patients.json';
import hiStaff from './locales/hi/staff.json';
import hiProfile from './locales/hi/profile.json';
import hiValidation from './locales/hi/validation.json';
import hiStatus from './locales/hi/status.json';
import hiDocuments from './locales/hi/documents.json';
import hiMou from './locales/hi/mou.json';

// Kannada
import knCommon from './locales/kn/common.json';
import knAuth from './locales/kn/auth.json';
import knDashboard from './locales/kn/dashboard.json';
import knPatients from './locales/kn/patients.json';
import knStaff from './locales/kn/staff.json';
import knProfile from './locales/kn/profile.json';
import knValidation from './locales/kn/validation.json';
import knStatus from './locales/kn/status.json';
import knDocuments from './locales/kn/documents.json';
import knMou from './locales/kn/mou.json';

const savedLanguage = localStorage.getItem('app_language') || 'en';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            common: enCommon,
            auth: enAuth,
            dashboard: enDashboard,
            patients: enPatients,
            staff: enStaff,
            profile: enProfile,
            validation: enValidation,
            status: enStatus,
            documents: enDocuments,
            mou: enMou,
        },
        hi: {
            common: hiCommon,
            auth: hiAuth,
            dashboard: hiDashboard,
            patients: hiPatients,
            staff: hiStaff,
            profile: hiProfile,
            validation: hiValidation,
            status: hiStatus,
            documents: hiDocuments,
            mou: hiMou,
        },
        kn: {
            common: knCommon,
            auth: knAuth,
            dashboard: knDashboard,
            patients: knPatients,
            staff: knStaff,
            profile: knProfile,
            validation: knValidation,
            status: knStatus,
            documents: knDocuments,
            mou: knMou,
        },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'auth', 'dashboard', 'patients', 'staff', 'profile', 'validation', 'status', 'documents', 'mou'],
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
