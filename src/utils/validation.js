// Phone number validation (supports Indian format)
export const validatePhone = (phone) => {
    const errors = [];
    const cleanPhone = phone.replace(/\D/g, '');

    if (!phone.trim()) {
        errors.push('validation:mobileRequired');
        return { isValid: false, errors, cleanPhone };
    }

    const indianPhoneRegex = /^(?:\+?91)?[0-9]\d{9}$/;

    if (!indianPhoneRegex.test(cleanPhone)) {
        if (cleanPhone.length < 10) {
            errors.push('validation:mobileMinDigits');
        } else if (cleanPhone.length > 10) {
            errors.push('validation:mobileTooLong');
        } else {
            errors.push('validation:mobileInvalid');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanPhone,
    };
};

// OTP validation
export const validateOtp = (otp) => {
    const errors = [];
    const cleanOtp = otp.replace(/\D/g, '');

    if (!otp.trim()) {
        errors.push('validation:otpRequired');
        return { isValid: false, errors, cleanOtp };
    }

    if (cleanOtp.length !== 6) {
        errors.push('validation:otpMustBe6');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanOtp,
    };
};

// Doctor name validation
export const validateDoctorName = (name) => {
    const errors = [];
    const trimmedName = name.trim();

    if (!trimmedName) {
        errors.push('validation:doctorNameRequired');
        return { isValid: false, errors, cleanName: trimmedName };
    }

    if (trimmedName.length < 2) {
        errors.push('validation:nameMin2');
    }

    if (trimmedName.length > 100) {
        errors.push('validation:nameMax100');
    }

    // Check for valid characters (letters, spaces, dots, hyphens)
    const nameRegex = /^[a-zA-Z\s.\-']+$/;
    if (!nameRegex.test(trimmedName)) {
        errors.push('validation:nameInvalidChars');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanName: trimmedName,
    };
};

// Email validation
export const validateEmail = (email, required = false) => {
    const errors = [];
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
        if (required) {
            errors.push('validation:emailRequired');
        }
        return { isValid: !required, errors, cleanEmail: trimmedEmail };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        errors.push('validation:emailInvalid');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanEmail: trimmedEmail,
    };
};

// Registration number validation
export const validateRegistrationNumber = (regNum, required = false) => {
    const errors = [];
    const trimmedRegNum = regNum.trim().toUpperCase();

    if (!trimmedRegNum) {
        if (required) {
            errors.push('validation:regNumRequired');
        }
        return { isValid: !required, errors, cleanRegNum: trimmedRegNum };
    }

    if (trimmedRegNum.length < 4) {
        errors.push('validation:regNumMin4');
    }

    if (trimmedRegNum.length > 30) {
        errors.push('validation:regNumMax30');
    }

    // Allow alphanumeric with hyphens and slashes
    const regNumRegex = /^[a-zA-Z0-9\-\/]+$/;
    if (!regNumRegex.test(trimmedRegNum)) {
        errors.push('validation:regNumInvalidChars');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanRegNum: trimmedRegNum,
    };
};

// Clinic name validation
export const validateClinicName = (name, required = false) => {
    const errors = [];
    const trimmedName = name.trim();

    if (!trimmedName) {
        if (required) {
            errors.push('validation:clinicRequired');
        }
        return { isValid: !required, errors, cleanName: trimmedName };
    }

    if (trimmedName.length < 2) {
        errors.push('validation:clinicMin2');
    }

    if (trimmedName.length > 150) {
        errors.push('validation:clinicMax150');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanName: trimmedName,
    };
};

// Validate entire registration form
export const validateRegistrationForm = (formData) => {
    const errors = {};
    let isValid = true;

    // Doctor name (required)
    const doctorNameValidation = validateDoctorName(formData.doctor_name || '');
    if (!doctorNameValidation.isValid) {
        errors.doctor_name = doctorNameValidation.errors[0];
        isValid = false;
    }

    // Phone (required)
    const phoneValidation = validatePhone(formData.mobile || '');
    if (!phoneValidation.isValid) {
        errors.mobile = phoneValidation.errors[0];
        isValid = false;
    }

    // Registration number (optional)
    const regNumValidation = validateRegistrationNumber(formData.registration_number || '', false);
    if (!regNumValidation.isValid) {
        errors.registration_number = regNumValidation.errors[0];
        isValid = false;
    }

    // Clinic name (optional)
    const clinicValidation = validateClinicName(formData.clinic_name || '', false);
    if (!clinicValidation.isValid) {
        errors.clinic_name = clinicValidation.errors[0];
        isValid = false;
    }

    // Email (optional)
    const emailValidation = validateEmail(formData.email || '', false);
    if (!emailValidation.isValid) {
        errors.email = emailValidation.errors[0];
        isValid = false;
    }

    // Password (required)
    const passwordValidation = validatePassword(formData.password || '');
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors[0];
        isValid = false;
    }

    return {
        isValid,
        errors,
        cleanData: {
            doctor_name: doctorNameValidation.cleanName,
            mobile: phoneValidation.cleanPhone,
            registration_number: regNumValidation.cleanRegNum,
            clinic_name: clinicValidation.cleanName,
            email: emailValidation.cleanEmail,
            password: passwordValidation.cleanPassword || '',
        },
    };
};

// Format phone number for display
export const formatPhoneDisplay = (phone) => {
    const clean = phone.replace(/\D/g, '');

    if (clean.length >= 10) {
        const last10 = clean.slice(-10);
        return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
    }

    return phone;
};

// Sanitize phone input (allow only valid characters)
export const sanitizePhoneInput = (value) => {
    return value;
};

// Sanitize OTP input (only digits)
export const sanitizeOtpInput = (value) => {
    return value.replace(/\D/g, '').slice(0, 6);
};

// Sanitize name input
export const sanitizeNameInput = (value) => {
    return value.replace(/[^a-zA-Z\s.\-']/g, '');
};

// Sanitize registration number input
export const sanitizeRegNumInput = (value) => {
    return value.replace(/[^a-zA-Z0-9\-\/]/g, '').toUpperCase();
};


export const validatePatientName = (name) => {
    const errors = [];
    const trimmedName = name?.trim() || '';

    if (!trimmedName) {
        errors.push('validation:patientNameRequired');
        return { isValid: false, errors, cleanName: trimmedName };
    }

    if (trimmedName.length < 2) {
        errors.push('validation:nameMin2');
    }

    if (trimmedName.length > 100) {
        errors.push('validation:nameMax100');
    }

    // Check for valid characters
    const nameRegex = /^[a-zA-Z\s.\-']+$/;
    if (!nameRegex.test(trimmedName)) {
        errors.push('validation:nameInvalidChars');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanName: trimmedName,
    };
};

// Gender validation
export const validateGender = (gender) => {
    const errors = [];
    const validGenders = ['male', 'female', 'other'];

    if (!gender) {
        errors.push('validation:selectGender');
        return { isValid: false, errors };
    }

    if (!validGenders.includes(gender.toLowerCase())) {
        errors.push('validation:genderInvalid');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Age validation
export const validateAge = (age) => {
    const errors = [];

    if (age === '' || age === null || age === undefined) {
        errors.push('validation:ageRequired');
        return { isValid: false, errors, cleanAge: null };
    }

    const numAge = parseInt(age, 10);

    if (isNaN(numAge)) {
        errors.push('validation:ageInvalid');
        return { isValid: false, errors, cleanAge: null };
    }

    if (numAge < 0) {
        errors.push('validation:ageNegative');
    }

    if (numAge > 150) {
        errors.push('validation:ageRange');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanAge: numAge,
    };
};

// Phone validation for patients (can be different from doctor registration)
export const validatePatientPhone = (phone) => {
    const errors = [];
    const cleanPhone = phone?.replace(/\D/g, '') || '';

    if (!phone?.trim()) {
        errors.push('validation:phoneRequired');
        return { isValid: false, errors, cleanPhone: '' };
    }

    if (cleanPhone.length < 10) {
        errors.push('validation:phoneMinDigits');
    }

    if (cleanPhone.length > 10) {
        errors.push('validation:phoneTooLong');
    }

    // Basic validation for Indian phone numbers
    if (cleanPhone.length >= 10) {
        const last10 = cleanPhone.slice(-10);
        if (!/^[0-9]\d{9}$/.test(last10)) {
            errors.push('validation:phoneInvalid');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanPhone,
    };
};

// Hospital/Specialty validation (optional field)
export const validateHospital = (hospital) => {
    const errors = [];
    const trimmed = hospital?.trim() || '';

    if (trimmed && trimmed.length > 100) {
        errors.push('validation:hospitalMax100');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanHospital: trimmed,
    };
};

// Diagnosis validation (optional field)
export const validateDiagnosis = (diagnosis) => {
    const errors = [];
    const trimmed = diagnosis?.trim() || '';

    if (trimmed && trimmed.length > 500) {
        errors.push('validation:diagnosisMax500');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanDiagnosis: trimmed,
    };
};

// Validate entire referral form
export const validateReferralForm = (formData) => {
    const errors = {};
    let isValid = true;

    // Patient name (required)
    const nameValidation = validatePatientName(formData.name);
    if (!nameValidation.isValid) {
        errors.name = nameValidation.errors[0];
        isValid = false;
    }

    // Gender (required)
    const genderValidation = validateGender(formData.gender);
    if (!genderValidation.isValid) {
        errors.gender = genderValidation.errors[0];
        isValid = false;
    }

    // Age (required)
    const ageValidation = validateAge(formData.age);
    if (!ageValidation.isValid) {
        errors.age = ageValidation.errors[0];
        isValid = false;
    }

    // Phone (required)
    const phoneValidation = validatePatientPhone(formData.phone);
    if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.errors[0];
        isValid = false;
    }

    // Hospital (optional)
    const hospitalValidation = validateHospital(formData.hospital);
    if (!hospitalValidation.isValid) {
        errors.hospital = hospitalValidation.errors[0];
        isValid = false;
    }

    // Diagnosis (optional)
    const diagnosisValidation = validateDiagnosis(formData.diagnosis);
    if (!diagnosisValidation.isValid) {
        errors.diagnosis = diagnosisValidation.errors[0];
        isValid = false;
    }

    return {
        isValid,
        errors,
        cleanData: {
            name: nameValidation.cleanName,
            gender: formData.gender,
            age: ageValidation.cleanAge,
            phone: phoneValidation.cleanPhone,
            hospital: hospitalValidation.cleanHospital,
            diagnosis: diagnosisValidation.cleanDiagnosis,
        },
    };
};

// ============== STATUS VALIDATION ==============

// Validate patient status
export const validateStatus = (status) => {
    const errors = [];
    const validStatuses = ['referred', 'admitted', 'ongoing', 'discharged', 'billing_received'];

    if (!status) {
        errors.push('validation:selectStatus');
        return { isValid: false, errors };
    }

    if (!validStatuses.includes(status)) {
        errors.push('validation:statusInvalid');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// ============== INPUT SANITIZERS ==============

// Sanitize patient name input
export const sanitizePatientNameInput = (value) => {
    return value.replace(/[^a-zA-Z\s.\-']/g, '');
};

// Sanitize age input (only digits)
export const sanitizeAgeInput = (value) => {
    return value.replace(/\D/g, '').slice(0, 3);
};

// Sanitize phone input for patients
export const sanitizePatientPhoneInput = (value) => {
    return value.replace(/[^\d+\s\-]/g, '');
};

// ============== STAFF VALIDATIONS ==============

// First name validation
export const validateFirstName = (name) => {
    const errors = [];
    const trimmedName = name?.trim() || '';

    if (!trimmedName) {
        errors.push('validation:firstNameRequired');
        return { isValid: false, errors, cleanName: trimmedName };
    }

    if (trimmedName.length < 2) {
        errors.push('validation:firstNameMin2');
    }

    if (trimmedName.length > 50) {
        errors.push('validation:firstNameMax50');
    }

    // Check for valid characters (letters and spaces only)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(trimmedName)) {
        errors.push('validation:firstNameInvalidChars');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanName: trimmedName,
    };
};

// Last name validation
export const validateLastName = (name) => {
    const errors = [];
    const trimmedName = name?.trim() || '';

    if (!trimmedName) {
        errors.push('validation:lastNameRequired');
        return { isValid: false, errors, cleanName: trimmedName };
    }

    if (trimmedName.length < 2) {
        errors.push('validation:lastNameMin2');
    }

    if (trimmedName.length > 50) {
        errors.push('validation:lastNameMax50');
    }

    // Check for valid characters (letters and spaces only)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(trimmedName)) {
        errors.push('validation:lastNameInvalidChars');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanName: trimmedName,
    };
};

// Staff mobile validation
export const validateStaffMobile = (phone, isRequired = true) => {
    const errors = [];
    const cleanPhone = phone?.replace(/\D/g, '') || '';

    if (!phone?.trim()) {
        if (isRequired) {
            errors.push('validation:mobileRequired');
        }
        return { isValid: !isRequired, errors, cleanPhone: '' };
    }

    if (cleanPhone.length < 10) {
        errors.push('validation:mobileMinDigits');
    }

    if (cleanPhone.length > 10) {
        errors.push('validation:mobileTooLong');
    }

    // Basic validation for Indian phone numbers
    if (cleanPhone.length >= 10) {
        const last10 = cleanPhone.slice(-10);
        if (!/^[0-9]\d{9}$/.test(last10)) {
            errors.push('validation:staffMobileInvalid');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanPhone,
    };
};

// Staff email validation (optional field)
export const validateStaffEmail = (email) => {
    const errors = [];
    const trimmedEmail = email?.trim().toLowerCase() || '';

    if (!trimmedEmail) {
        // Email is optional
        return { isValid: true, errors: [], cleanEmail: '' };
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        errors.push('validation:staffEmailInvalid');
    }

    if (trimmedEmail.length > 100) {
        errors.push('validation:emailMax100');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanEmail: trimmedEmail,
    };
};

// Staff registration number validation (optional field)
export const validateStaffRegNumber = (regNum) => {
    const errors = [];
    const trimmed = regNum?.trim().toUpperCase() || '';

    if (!trimmed) {
        // Registration number is optional
        return { isValid: true, errors: [], cleanRegNum: '' };
    }

    if (trimmed.length < 3) {
        errors.push('validation:staffRegNumMin3');
    }

    if (trimmed.length > 30) {
        errors.push('validation:regNumMax30');
    }

    // Allow alphanumeric with hyphens and slashes
    const regNumRegex = /^[a-zA-Z0-9\-\/]+$/;
    if (!regNumRegex.test(trimmed)) {
        errors.push('validation:regNumInvalidChars');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanRegNum: trimmed,
    };
};

// Staff role validation
export const validateStaffRole = (role) => {
    const errors = [];
    const validRoles = ['receptionist', 'nurse', 'assistant', 'other'];

    if (!role) {
        errors.push('validation:selectRole');
        return { isValid: false, errors };
    }

    if (!validRoles.includes(role.toLowerCase())) {
        errors.push('validation:roleInvalid');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Validate entire staff form
export const validateStaffForm = (formData, isEdit = false) => {
    const errors = {};
    let isValid = true;

    // First name (required)
    const firstNameValidation = validateFirstName(formData.first_name);
    if (!firstNameValidation.isValid) {
        errors.first_name = firstNameValidation.errors[0];
        isValid = false;
    }

    // Last name (required)
    const lastNameValidation = validateLastName(formData.last_name);
    if (!lastNameValidation.isValid) {
        errors.last_name = lastNameValidation.errors[0];
        isValid = false;
    }

    // Mobile (required for new staff, not editable for existing)
    if (!isEdit) {
        const mobileValidation = validateStaffMobile(formData.mobile, true);
        if (!mobileValidation.isValid) {
            errors.mobile = mobileValidation.errors[0];
            isValid = false;
        }
    }

    // Email (optional)
    const emailValidation = validateStaffEmail(formData.email);
    if (!emailValidation.isValid) {
        errors.email = emailValidation.errors[0];
        isValid = false;
    }

    // Registration number (optional)
    const regNumValidation = validateStaffRegNumber(formData.registration_number);
    if (!regNumValidation.isValid) {
        errors.registration_number = regNumValidation.errors[0];
        isValid = false;
    }

    // Role (required)
    const roleValidation = validateStaffRole(formData.role);
    if (!roleValidation.isValid) {
        errors.role = roleValidation.errors[0];
        isValid = false;
    }

    return {
        isValid,
        errors,
        cleanData: {
            first_name: firstNameValidation.cleanName || formData.first_name?.trim(),
            last_name: lastNameValidation.cleanName || formData.last_name?.trim(),
            mobile: isEdit ? formData.mobile : (validateStaffMobile(formData.mobile).cleanPhone || formData.mobile),
            email: emailValidation.cleanEmail || '',
            registration_number: regNumValidation.cleanRegNum || '',
            role: formData.role,
            can_view_financial: formData.can_view_financial || false,
        },
    };
};

// ============== INPUT SANITIZERS FOR STAFF ==============

// Sanitize name input (only letters and spaces)
export const sanitizeStaffNameInput = (value) => {
    return value.replace(/[^a-zA-Z\s]/g, '');
};

// Sanitize mobile input
export const sanitizeStaffMobileInput = (value) => {
    return value.replace(/[^\d+\s\-]/g, '');
};

// Sanitize registration number input
export const sanitizeStaffRegNumInput = (value) => {
    return value.replace(/[^a-zA-Z0-9\-\/]/g, '').toUpperCase();
};

export const validatePassword = (password) => {
    const errors = [];
    const trimmed = (password || '').trim();

    if (!trimmed) {
        errors.push('validation:passwordRequired');
        return { isValid: false, errors };
    }

    if (trimmed.length < 8) {
        errors.push('validation:passwordMin8');
    }

    // Optionally add more checks: digits, special char, uppercase
    return { isValid: errors.length === 0, errors, cleanPassword: trimmed };
};

export const sanitizePasswordInput = (value) => {
    // allow most characters but trim spaces at ends
    return value.replace(/\s{2,}/g, ' ').slice(0, 128);
};

// ============== NEW VALIDATION FUNCTIONS FOR AUTHENTICATION ==============

// Verification code validation (6-digit)
export const validateVerificationCode = (code) => {
    const errors = [];
    const cleanCode = (code || '').replace(/\D/g, '');

    if (!code || !code.trim()) {
        errors.push('validation:verificationCodeRequired');
        return { isValid: false, errors, cleanCode };
    }

    if (cleanCode.length !== 6) {
        errors.push('validation:verificationCodeMust6');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanCode,
    };
};

// Sanitize verification code input (only digits, max 6)
export const sanitizeVerificationCodeInput = (value) => {
    return (value || '').replace(/\D/g, '').slice(0, 6);
};

// Email or phone validation (for login)
export const validateEmailOrPhone = (identifier) => {
    const errors = [];
    const trimmed = (identifier || '').trim();

    if (!trimmed) {
        errors.push('validation:emailOrMobileRequired');
        return { isValid: false, errors };
    }

    // Check if it looks like an email
    if (trimmed.includes('@')) {
        const emailValidation = validateEmail(trimmed, true);
        return emailValidation;
    }

    // Otherwise treat as phone
    const phoneValidation = validatePhone(trimmed);
    return phoneValidation;
};

// Sanitize email input
export const sanitizeEmailInput = (value) => {
    // Remove leading/trailing spaces, convert to lowercase
    return (value || '').trim().toLowerCase();
};
