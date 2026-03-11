import React from 'react';

const MOUContent = ({ hospitalName, signatoryName, effectiveDate, hospitalAddress, bankAccountNumber, bankName, bankBranch, bankIfsc, bankAddress, professionalFee }) => {
    const hosp = hospitalName || '________________';
    const signatory = signatoryName || '________________';
    const hospAddr = hospitalAddress || '________________';
    const bankAcct = bankAccountNumber || 'To be filled later';
    const bName = bankName || 'To be filled later';
    const bBranch = bankBranch || 'To be filled later';
    const bIfsc = bankIfsc || 'To be filled later';
    const bAddr = bankAddress || 'To be filled later';
    const fee = professionalFee || '';

    // Compute end date (1 year from effective date)
    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);
    const endDateStr = endDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <div className="mou-document text-sm leading-relaxed text-gray-700">
            {/* Title */}
            <h2 className="text-lg font-bold text-center text-gray-900 mb-4 underline">
                Memorandum of Understanding
            </h2>

            <p className="mb-4">
                This Memorandum of Understanding (the "<b>Agreement</b>") is made on <b>{effectiveDate}</b>.
            </p>

            <p className="text-center font-bold text-gray-900 mb-4">BETWEEN</p>

            <p className="mb-4">
                <b>Ezeehealth (Dual Mirror Healthcare Pvt Ltd)</b>, a Company registered under the Companies Act,
                2013 having its registered office at 127, 4th Cross, 1st Main, ST BED area, Koramangala,
                Karnataka – 560034 being represented by its authorized signatory Mr. Jyoti Swarup,
                hereinafter referred to as <b>"EH"</b> (which expression shall, unless repugnant to the context,
                include its successors and permitted assigns)
            </p>

            <p className="text-center font-bold text-gray-900 mb-4">AND</p>

            <p className="mb-4">
                <b>"{hosp}"</b> represented by its authorized signatory <b>Mr. {signatory}</b> and having its
                registered office at {hospAddr} (Hereinafter referred as <b>"{hosp}"</b>)
            </p>

            <p className="mb-4 text-gray-500 italic">
                (Hereinafter each shall be referred to as a "Party" and collectively referred to as the "Parties")
            </p>

            {/* WHEREAS */}
            <p className="font-bold text-gray-900 mb-2">WHEREAS:</p>
            <p className="mb-3">
                <b>A.</b> Ezeehealth (Dual Mirror Healthcare Pvt Ltd) is a digitally enabled platform for Doctors and
                Patients. It has a network of Specialty Hospitals. It has a complete ecosystem to handhold
                Patient's journey; and in addition digitally enable the Primary doctors/Hospitals to remain a
                part of their patient's journey of treatment through their specialty treatment.
            </p>
            <p className="mb-4">
                <b>B.</b> In order to enable it's patients to avail specialty treatment <b>Ezeehealth (EH)</b> and
                <b> "{hosp}"</b> have agreed to enter into this Agreement wherein <b>Ezeehealth (EH)</b> platform
                and Patient concierge services shall be made available to {hosp}.
            </p>

            <p className="font-bold text-gray-900 mb-4">
                NOW THESE PRESENTS WITNESSETH AND IT IS HEREBY AGREED, DECLARED AND CONFIRMED BY AND
                BETWEEN THE PARTIES HERETO AS UNDER
            </p>

            {/* 1. PURPOSE */}
            <p className="font-bold text-gray-900 mt-4 mb-2">1. PURPOSE OF THIS AGREEMENT</p>
            <p className="mb-4">
                The Ezeehealth shall provide its platform and concierge services to the patients of
                <b> "{hosp}"</b> to avail specialty medical treatment. EH shall not be responsible for clinical
                decisions, medical outcomes, or any treatment administered by the Hospital.
            </p>

            {/* 2. TERM */}
            <p className="font-bold text-gray-900 mt-4 mb-2">2. TERM</p>
            <p className="mb-4">
                This Agreement shall be effective from <b>{effectiveDate}</b> and shall remain in force till
                <b> {endDateStr}</b>. It is hereby agreed that on the expiry of this period, the Parties shall
                have the option to renew this Agreement for further period and on the terms and conditions as
                mutually agreed to between the Parties at the time of renewal. Renewal terms, including fee
                structure, shall be mutually agreed in writing.
            </p>

            {/* 3. PAYMENT TERMS */}
            <p className="font-bold text-gray-900 mt-4 mb-2">3. PAYMENT TERMS</p>

            <p className="mb-2 ml-4"><b>a.</b> For the Patients of <b>{hosp}</b>:</p>

            <div className="ml-8 mb-3 space-y-3">
                <p>
                    <b>i.</b> Ezeehealth will collect the Fee on behalf of <b>{hosp}</b> for providing distinct clinical
                    services as stated in Appendix A of this MOU. This fee to be paid to {hosp} will be as per the
                    Professional fee Disclosure form in the <b>Appendix C</b> of this MOU.
                </p>
                <p>
                    <b>ii.</b> The Tertiary healthcare treatment would be provided by any of the partner Specialty hospital
                    ('Tertiary Hospital') of <b>Ezeehealth (EH)</b> to this patient. The decision regarding the
                    choice of Tertiary Hospital will be strictly under the purview of {hosp}; wherein Ezeehealth as
                    a platform will have no say in this matter.
                </p>
                <p>
                    <b>iii.</b> The Parties expressly agree that the Fee payable to <b>{hosp}</b> is a primary obligation of the
                    Tertiary Hospital and is not a consideration payable by Ezeehealth. Ezeehealth shall solely act
                    as a 'pure agent' of Tertiary Hospital, as defined under Rule 33 of the Central Goods and
                    Services Tax Rules, 2017, for the limited purpose of collection and remittance of the
                    'Fee' from the Tertiary Hospital to {hosp}. Ezeehealth shall not have any right, title,
                    interest or beneficial ownership in 'distinct clinical services' and shall neither be treated
                    as the recipient of such services. Further, Ezeehealth shall not markup, retain or modify the
                    'Fee' for 'distinct clinical services' in any manner and shall remit the same to {hosp}.
                </p>
            </div>

            <p className="mb-3 ml-4">
                <b>b.</b> The Fee to <b>{hosp}</b> is for 'distinct clinical services' only and does not constitute a
                referral commission, in line with the Medical Council of India (Professional Conduct, Etiquette
                and Ethics) Regulations, 2002
            </p>

            <p className="mb-3 ml-4">
                <b>c.</b> Applicable taxes (including GST) shall be levied and paid as per Indian law
            </p>

            <div className="mb-4 ml-4">
                <p className="mb-2"><b>d.</b> Bank details of the {hosp} is as follows:</p>
                <div className="ml-4 space-y-1">
                    <p><b>Bank Account number:</b> {bankAcct}</p>
                    <p><b>Bank Name:</b> {bName}</p>
                    <p><b>Branch:</b> {bBranch}</p>
                    <p><b>IFS code:</b> {bIfsc}</p>
                    <p><b>Address:</b> {bAddr}</p>
                </div>
            </div>

            {/* 4. CONFIDENTIALITY */}
            <p className="font-bold text-gray-900 mt-4 mb-2">4. CONFIDENTIALITY</p>
            <p className="mb-4">
                Both Parties shall keep confidential all proprietary information, including patient records,
                treatment details and business data. Exceptions apply only where disclosure is required by law
                or regulatory authorities. Both parties shall comply with the Digital Personal Data Protection
                Act, 2023.
            </p>

            {/* 5. BRANDING */}
            <p className="font-bold text-gray-900 mt-4 mb-2">5. BRANDING</p>
            <p className="mb-4">
                Either party will be allowed to use the other party's logo on social media or offices during
                the period of this agreement.
            </p>

            {/* 6. TERMINATION */}
            <p className="font-bold text-gray-900 mt-4 mb-2">6. TERMINATION</p>
            <p className="mb-4">
                Either Party may terminate this Agreement with 90 (ninety) days written notice. Upon
                termination: Pending dues shall be settled. Each Party shall return confidential materials.
                Patient services already in process shall be completed in good faith. All patient cases under
                active treatment shall be completed without EH incurring additional liability.
            </p>

            {/* 7. FORCE MAJEURE */}
            <p className="font-bold text-gray-900 mt-4 mb-2">7. FORCE MAJEURE</p>
            <p className="mb-4">
                Neither Party shall be liable for failure to perform obligations due to events beyond their
                reasonable control (including pandemics, natural disasters or government restrictions).
            </p>

            {/* 8. INDEMNITY */}
            <p className="font-bold text-gray-900 mt-4 mb-2">8. INDEMNITY</p>
            <p className="mb-4">
                EH shall indemnify the Hospital only for direct losses arising solely from EH's proven breach
                of this Agreement, and not for actions or omissions of the Hospital. No indemnity shall apply
                to medical negligence or clinical errors by the Hospital.
            </p>

            {/* 9. LIMITATION OF LIABILITY */}
            <p className="font-bold text-gray-900 mt-4 mb-2">9. LIMITATION OF LIABILITY</p>
            <p className="mb-4">
                Neither Party shall be liable for indirect or consequential damages. Ezeehealth's liability
                shall not exceed the total service fees received under this Agreement in the preceding
                12 months.
            </p>

            {/* 10. DISPUTE RESOLUTION */}
            <p className="font-bold text-gray-900 mt-4 mb-2">10. DISPUTE RESOLUTION</p>
            <p className="mb-4">
                Any dispute shall be resolved by arbitration under the Arbitration and Conciliation Act, 1996.
                The seat of arbitration shall be Bengaluru, Karnataka, and the language shall be English.
                Courts at Bengaluru shall have exclusive jurisdiction.
            </p>

            {/* 11. AUTHORIZATION */}
            <p className="font-bold text-gray-900 mt-4 mb-2">11. AUTHORIZATION</p>
            <p className="mb-4">
                All regulatory authorizations, approvals, registrations, etc. required by the
                <b> "{hosp}"</b> and the <b>Ezeehealth (EH)</b> to enable it to carry on its business as it is being
                carried on from time to time and to lawfully enter into this Agreement and comply with its
                obligations under this Agreement have been obtained or effected and are in full force and
                effect.
            </p>

            {/* 12. NOTICES */}
            <p className="font-bold text-gray-900 mt-4 mb-2">12. NOTICES</p>
            <p className="mb-4">
                All notices to any Party shall be in writing properly addressed to the registered office of the
                Party, or to such other addresses as may be provided from time to time by the Party, by
                registered mail or courier or through digital medium like email to a registered email id.
            </p>

            {/* 13. SEVERABILITY */}
            <p className="font-bold text-gray-900 mt-4 mb-2">13. SEVERABILITY</p>
            <p className="mb-4">
                The illegality, invalidity or unenforceability or any provision of this Agreement shall not be
                deemed to prejudice the enforceability of the remainder of this Agreement, which shall be
                severable there from unless such illegality or invalidity of such part is material to this
                Agreement.
            </p>

            <p className="font-bold text-gray-900 mb-4">
                THE PARTIES HAVE EXECUTED THIS AGREEMENT AS OF THE DATE FIRST SET FORTH ABOVE.
            </p>

            {/* Signature Blocks */}
            <div className="grid grid-cols-2 gap-6 mt-6 mb-6">
                <div>
                    <p className="font-bold mb-1">SIGNED &nbsp;&nbsp; and &nbsp;&nbsp; DELIVERED</p>
                    <p className="mb-1"><b>For Dual Mirror Healthcare Pvt. Ltd.</b></p>
                    <p className="mb-1">(Ezeehealth)</p>
                    <p className="mb-1">through its authorized representative</p>
                    <p className="font-bold">Name: MR. JYOTI SWARUP</p>
                    <p className="mt-2">Signature: ____________________</p>
                </div>
                <div>
                    <p className="font-bold mb-1">SIGNED &nbsp;&nbsp; and &nbsp;&nbsp; DELIVERED</p>
                    <p className="mb-1"><b>For {hosp}</b></p>
                    <p className="mb-1">&nbsp;</p>
                    <p className="mb-1">through its authorized representative</p>
                    <p className="font-bold">Name: MR. {signatory.toUpperCase()}</p>
                    <p className="mt-2 text-gray-400 italic">Signature will be captured below</p>
                </div>
            </div>

            {/* Appendix A */}
            <div className="border-t border-gray-200 pt-4 mt-6">
                <p className="font-bold text-gray-900 text-center mb-1">Appendix A</p>
                <p className="font-bold text-gray-900 text-center mb-3">Distinct Clinical Services</p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>
                        <b>Pre-Admission Clinical Optimization:</b> Formulating a treatment plan, stabilizing the
                        patient for transport, or conducting pre-operative assessments required by the receiving
                        hospital.
                    </li>
                    <li>
                        <b>Consultation &amp; Case Management:</b> Visit the patient in the hospital to monitor
                        progress, adjust medications, or coordinate with the Tertiary Hospital's internal team.
                    </li>
                    <li>
                        <b>Post-Discharge Planning &amp; Counseling:</b> Detailed clinical briefing of the patient on
                        post-op care, wound management, or long-term medication titration
                    </li>
                    <li>
                        <b>Emergency Stabilization:</b> Providing immediate life-saving care before or during the
                        transfer to a tertiary center.
                    </li>
                </ol>
            </div>

            {/* Appendix B */}
            <div className="border-t border-gray-200 pt-4 mt-6">
                <p className="font-bold text-gray-900 text-center mb-1">Appendix B</p>
                <p className="font-bold text-gray-900 text-center mb-3">EZEEHEALTH RESPONSIBILITIES AND UNDERTAKINGS</p>

                <div className="ml-4 mb-3">
                    <p className="mb-2">
                        <b>a.</b> Ezeehealth shall provide <b>"{hosp}"</b> a digital platform, patient concierge services and
                        it's ecosystem of Co-managing Hospitals, processes and back-end support for
                    </p>
                    <div className="ml-6 mb-3 space-y-1">
                        <p><b>i.</b> Receiving a patient needing specialized treatment</p>
                        <p><b>ii.</b> Sending a patient needing specialized treatment</p>
                        <p><b>iii.</b> Handholding of such Patients during their treatment</p>
                        <p><b>iv.</b> Updates on the status of a patient under treatment</p>
                    </div>
                </div>

                <div className="ml-4 mb-3">
                    <p className="mb-2">
                        <b>b.</b> The Ezeehealth's team with digitally enabled processes will follow-up with the patients and
                        all concerned to ensure that
                    </p>
                    <div className="ml-6 mb-3 space-y-1">
                        <p><b>i.</b> Patient's journey is hassle free</p>
                        <p><b>ii.</b> There is transparency in the treatment process along with continuous updates</p>
                        <p><b>iii.</b> All concerned with the co-management of the treatment are kept in the loop so that patients experience seamless care</p>
                    </div>
                </div>

                <p className="ml-4 mb-3">
                    Ezeehealth shall provide complete assistance through its Backend team to the
                    <b> "{hosp}"</b> in their billing process.
                </p>
                <p className="ml-4 mb-3">
                    The <b>"{hosp}"</b> shall permit the officers and representatives of the
                    <b> Ezeehealth (EH)</b> during business hours, to enter upon the <b>"{hosp}"</b> office or hospital
                    and work in hospital premise (area provided by <b>"{hosp}"</b>).
                </p>

                <div className="ml-4 space-y-3 mb-3">
                    <p>
                        <b>c.</b> If a case (episode) is brought through Ezeehealth platform or its representative, the patient
                        will be considered as Ezeehealth's patient irrespective of the patients having a prior
                        hospital's UHID from previous visits.
                    </p>
                    <p>
                        <b>d.</b> Ezeehealth shall not be liable for delays, failures, or actions of the Hospital or its staff
                        and does not provide medical advice, diagnosis, or treatment.
                    </p>
                </div>
            </div>

            {/* Appendix C */}
            <div className="border-t border-gray-200 pt-4 mt-6">
                <p className="font-bold text-gray-900 text-center mb-1">Appendix C</p>
                <p className="font-bold text-gray-900 text-center mb-3">PROFESSIONAL FEE DISCLOSURE FORM</p>
                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left w-16">Sl. No.</th>
                            <th className="border border-gray-300 px-3 py-2 text-left">Particulars</th>
                            <th className="border border-gray-300 px-3 py-2 text-left w-32">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2">1</td>
                            <td className="border border-gray-300 px-3 py-2">
                                Distinct Clinical Services Fee payable to {hosp}<br/>
                                <span className="text-gray-500 text-xs">Paid by Tertiary hospital to Ezeehealth as a facilitator or pure agent</span>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">{fee}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MOUContent;
