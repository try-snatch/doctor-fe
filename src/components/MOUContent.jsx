import React from 'react';
import { useTranslation } from 'react-i18next';

const MOUContent = ({ hospitalName, signatoryName, effectiveDate }) => {
    const { t } = useTranslation('mou');

    return (
        <div className="mou-document text-sm leading-relaxed text-gray-700">
            {/* Title */}
            <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
                {t('document.title')}
            </h2>

            {/* Parties */}
            <div className="mb-6 text-center">
                <p className="font-semibold text-gray-600 mb-2">{t('document.between')}</p>
                <p className="font-bold text-gray-900">{t('document.party1')}</p>
                <p className="text-gray-500 text-xs">{t('document.party1Trading')}</p>
                <p className="text-gray-500 text-xs mt-1">{t('document.party1Address')}</p>
                <p className="font-semibold text-gray-600 my-2">{t('document.and')}</p>
                <p className="font-bold text-gray-900">
                    {hospitalName || t('document.party2Label')}
                </p>
                {signatoryName && (
                    <p className="text-gray-500 text-xs">({signatoryName})</p>
                )}
            </div>

            {/* Effective Date */}
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm">
                    <span className="font-semibold">{t('document.effectiveDate')}: </span>
                    {effectiveDate}
                </p>
            </div>

            {/* Section 1: Purpose */}
            <div className="mb-5">
                <h3 className="font-bold text-gray-900 mb-2">{t('document.section1Title')}</h3>
                <p>{t('document.section1Content')}</p>
            </div>

            {/* Section 2: Term */}
            <div className="mb-5">
                <h3 className="font-bold text-gray-900 mb-2">{t('document.section2Title')}</h3>
                <p>{t('document.section2Content')}</p>
            </div>

            {/* Section 3: Responsibilities of EzeeHealth */}
            <div className="mb-5">
                <h3 className="font-bold text-gray-900 mb-2">{t('document.section3Title')}</h3>
                <ul className="list-disc pl-5 space-y-1">
                    <li>{t('document.section3Item1')}</li>
                    <li>{t('document.section3Item2')}</li>
                    <li>{t('document.section3Item3')}</li>
                    <li>{t('document.section3Item4')}</li>
                    <li>{t('document.section3Item5')}</li>
                </ul>
            </div>

            {/* Section 4: Responsibilities of Hospital */}
            <div className="mb-5">
                <h3 className="font-bold text-gray-900 mb-2">{t('document.section4Title')}</h3>
                <ul className="list-disc pl-5 space-y-1">
                    <li>{t('document.section4Item1')}</li>
                    <li>{t('document.section4Item2')}</li>
                    <li>{t('document.section4Item3')}</li>
                    <li>{t('document.section4Item4')}</li>
                    <li>{t('document.section4Item5')}</li>
                </ul>
            </div>

            {/* Section 5: Payment Terms */}
            <div className="mb-5">
                <h3 className="font-bold text-gray-900 mb-2">{t('document.section5Title')}</h3>
                <p>{t('document.section5Content')}</p>
            </div>

            {/* Section 6: Confidentiality */}
            <div className="mb-5">
                <h3 className="font-bold text-gray-900 mb-2">{t('document.section6Title')}</h3>
                <p>{t('document.section6Content')}</p>
            </div>

            {/* Section 7: Data Protection */}
            <div className="mb-5">
                <h3 className="font-bold text-gray-900 mb-2">{t('document.section7Title')}</h3>
                <p>{t('document.section7Content')}</p>
            </div>

            {/* Section 8: Termination */}
            <div className="mb-5">
                <h3 className="font-bold text-gray-900 mb-2">{t('document.section8Title')}</h3>
                <p>{t('document.section8Content')}</p>
            </div>

            {/* Section 9: Dispute Resolution */}
            <div className="mb-5">
                <h3 className="font-bold text-gray-900 mb-2">{t('document.section9Title')}</h3>
                <p>{t('document.section9Content')}</p>
            </div>

            {/* Section 10: Governing Law */}
            <div className="mb-5">
                <h3 className="font-bold text-gray-900 mb-2">{t('document.section10Title')}</h3>
                <p>{t('document.section10Content')}</p>
            </div>

            {/* Section 11: General */}
            <div className="mb-5">
                <h3 className="font-bold text-gray-900 mb-2">{t('document.section11Title')}</h3>
                <ul className="list-disc pl-5 space-y-1">
                    <li>{t('document.section11Item1')}</li>
                    <li>{t('document.section11Item2')}</li>
                    <li>{t('document.section11Item3')}</li>
                    <li>{t('document.section11Item4')}</li>
                </ul>
            </div>
        </div>
    );
};

export default MOUContent;
