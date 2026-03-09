import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfUsePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 safe-top safe-bottom">
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Terms and Conditions</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-card p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Terms and Conditions for EzeeHealth BridgeCare</h2>
                    <p className="text-sm text-gray-500 mb-6">Last Updated: February 4, 2026</p>

                    <p className="text-sm text-gray-700 leading-relaxed mb-6">
                        Please read these Terms and Conditions ("Terms") carefully before using the EzeeHealth BridgeCare mobile application (the "Service") operated by EzeeHealth ("us," "we," or "our").
                    </p>

                    {/* 1. Acceptance of Terms */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">1. Acceptance of Terms</h3>
                    <p className="text-sm text-gray-700 mb-6">
                        By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service. These Terms apply specifically to registered medical practitioners ("Users" or "Doctors").
                    </p>

                    {/* 2. Professional Responsibility */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">2. Professional Responsibility</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1 pl-2">
                        <li><strong>Licensing:</strong> Users must be legally licensed to practice medicine in their respective jurisdictions. We reserve the right to verify credentials and terminate accounts of unlicensed individuals.</li>
                    </ul>

                    {/* 3. Referral and Co-Management */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">3. Referral and Co-Management</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1 pl-2">
                        <li><strong>Referral Accuracy:</strong> Users must ensure that all patient data and clinical notes provided during the referral process are accurate and complete.</li>
                        <li><strong>Co-Management Fees:</strong>
                            <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                                <li>Fees are earned for the active co-management of patients referred through the platform.</li>
                                <li>Payment triggers (e.g., patient admission) and fee amounts are determined by the MOU and are visible within the User's wallet.</li>
                                <li>We act as a facilitator for these payments and are not responsible for disputes arising from clinical outcomes.</li>
                            </ul>
                        </li>
                    </ul>

                    {/* 4. User Accounts */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">4. User Accounts</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1 pl-2">
                        <li>You are responsible for safeguarding the password used to access the Service and for any activities or actions under your password.</li>
                        <li>You agree to notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                    </ul>

                    {/* 5. Patient Data and Privacy */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">5. Patient Data and Privacy</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1 pl-2">
                        <li><strong>Consent:</strong> Users represent and warrant that they have obtained all necessary consents from patients to upload their Protected Health Information (PHI) to the Service.</li>
                        <li><strong>Data Usage:</strong> Use of patient data is governed by our Privacy Policy. Users must not use the Service to store data for any purpose other than clinical referral and co-management.</li>
                    </ul>

                    {/* 6. Intellectual Property */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">6. Intellectual Property</h3>
                    <p className="text-sm text-gray-700 mb-6">
                        The Service and its original content (excluding User-provided patient data), features, and functionality are and will remain the exclusive property of EzeeHealth and its licensors.
                    </p>

                    {/* 7. Limitation of Liability */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">7. Limitation of Liability</h3>
                    <p className="text-sm text-gray-700 mb-6">
                        In no event shall EzeeHealth, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or medical malpractice claims resulting from your use of the Service.
                    </p>

                    {/* 8. Termination */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">8. Termination</h3>
                    <p className="text-sm text-gray-700 mb-6">
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    {/* 9. Governing Law */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">9. Governing Law</h3>
                    <p className="text-sm text-gray-700 mb-6">
                        These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which EzeeHealth is registered, without regard to its conflict of law provisions.
                    </p>

                    {/* 10. Changes */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">10. Changes</h3>
                    <p className="text-sm text-gray-700 mb-6">
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.
                    </p>

                    {/* 11. Contact */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">11. Contact Us</h3>
                    <p className="text-sm text-gray-700 mb-1">
                        If you have any questions about these Terms, please contact us at:
                    </p>
                    <p className="text-sm text-gray-700 mb-1">Email: <a href="mailto:support@ezeehealth.in" className="text-primary-500 underline">support@ezeehealth.in</a></p>
                    <p className="text-sm text-gray-700 mb-1">Phone: +91 (80) 6586 7900</p>
                    <p className="text-sm text-gray-700">Website: <a href="https://www.ezeehealth.in" target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">www.ezeehealth.in</a></p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUsePage;
