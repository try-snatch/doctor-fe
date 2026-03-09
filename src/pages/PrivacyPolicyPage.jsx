import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage = () => {
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
                    <h1 className="text-lg font-bold text-gray-900">Privacy Policy</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-card p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Privacy Policy for EzeeHealth BridgeCare</h2>
                    <p className="text-sm text-gray-500 mb-6">Effective Date: February 4, 2026</p>

                    <p className="text-sm text-gray-700 leading-relaxed mb-6">
                        EzeeHealth BridgeCare ("we," "us," or "our") is committed to protecting the privacy and security of the medical professionals and patients whose data is processed through our application. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our mobile application.
                    </p>

                    {/* 1. Information Collection */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">1. Information Collection</h3>

                    <h4 className="text-sm font-semibold text-gray-800 mb-2">1.1 Professional Information</h4>
                    <p className="text-sm text-gray-700 mb-2">For doctors using the app, we collect:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-4 space-y-1 pl-2">
                        <li>Name, registration number, mobile and email.</li>
                        <li>Clinic/Hospital affiliation and contact details.</li>
                        <li>Payment/Bank information for the processing of co-management fees.</li>
                    </ul>

                    <h4 className="text-sm font-semibold text-gray-800 mb-2">1.2 Patient Information (PHI)</h4>
                    <p className="text-sm text-gray-700 mb-2">As a tool for medical professionals, the app processes Protected Health Information (PHI) including:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-4 space-y-1 pl-2">
                        <li>Patient identifiers (Name, Age, Gender, Contact info).</li>
                        <li>Medical history, provisional diagnoses, and clinical notes.</li>
                    </ul>

                    <h4 className="text-sm font-semibold text-gray-800 mb-2">1.3 Automated Data Collection</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1 pl-2">
                        <li>Device information (Model, OS version).</li>
                        <li>Log data (Access times, features used).</li>
                    </ul>

                    {/* 2. Use of Information */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">2. Use of Information</h3>
                    <p className="text-sm text-gray-700 mb-2">We use the collected information to:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1 pl-2">
                        <li>Facilitate specialty referrals and patient tracking.</li>
                        <li>Process co-management fee payments to doctors.</li>
                        <li>Enable secure communication between referring doctors and specialists.</li>
                        <li>Comply with legal and healthcare regulatory obligations.</li>
                    </ul>

                    {/* 3. Data Sharing and Disclosure */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">3. Data Sharing and Disclosure</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1 pl-2">
                        <li><strong>With Super-Specialists/Hospitals:</strong> Data is shared with the specific providers you select for referral.</li>
                        <li><strong>Service Providers:</strong> We may share data with third-party vendors (e.g., cloud hosting, payment processors) who are contractually bound to protect the data.</li>
                        <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities.</li>
                        <li><strong>No Sale of Data:</strong> We do not sell patient or doctor data to third parties for marketing purposes.</li>
                    </ul>

                    {/* 4. Data Security */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">4. Data Security</h3>
                    <p className="text-sm text-gray-700 mb-2">We implement industry-standard security measures, including:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1 pl-2">
                        <li><strong>Encryption:</strong> Data is secured at rest and in transit (TLS/SSL).</li>
                        <li><strong>Access Control:</strong> Strict multi-factor authentication for all professional accounts.</li>
                    </ul>

                    {/* 6. Your Rights */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">5. Your Rights</h3>
                    <p className="text-sm text-gray-700 mb-2">Depending on your jurisdiction, you may have the right to:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1 pl-2">
                        <li>Access and export your professional data.</li>
                        <li>Request correction of inaccurate data.</li>
                        <li>Request deletion of your account (subject to medical record retention laws).</li>
                    </ul>

                    {/* 7. Changes */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">6. Changes to This Policy</h3>
                    <p className="text-sm text-gray-700 mb-6">
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy within the app.
                    </p>

                    {/* 8. Contact */}
                    <h3 className="text-base font-bold text-gray-900 mb-3">7. Contact Us</h3>
                    <p className="text-sm text-gray-700 mb-1">
                        If you have questions about this Privacy Policy, please contact at:
                    </p>
                    <p className="text-sm text-gray-700 mb-1">Email: <a href="mailto:support@ezeehealth.in" className="text-primary-500 underline">support@ezeehealth.in</a></p>
                    <p className="text-sm text-gray-700 mb-1">Phone: +91 (80) 6586 7900</p>
                    <p className="text-sm text-gray-700">Website: <a href="https://www.ezeehealth.in" target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">www.ezeehealth.in</a></p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
