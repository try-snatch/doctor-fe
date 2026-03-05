import React, { useRef, useEffect } from 'react';
import { sanitizeOtpInput } from '../utils/validation';

const OTPInput = ({
    length = 6,
    value = '',
    onChange,
    onComplete,
    disabled = false,
    error = false,
    autoFocus = true,
}) => {
    const inputRefs = useRef([]);
    const digits = value.split('').concat(Array(length - value.length).fill(''));

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    const handleChange = (index, inputValue) => {
        const sanitized = sanitizeOtpInput(inputValue);
        const newDigits = [...digits];
        newDigits[index] = sanitized.slice(-1) || '';
        const newValue = newDigits.join('').substring(0, length);

        onChange(newValue);

        if (sanitized && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newValue.length === length) {
            onComplete?.(newValue);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = sanitizeOtpInput(e.clipboardData.getData('text'));
        if (pasted.length > 0) {
            const newValue = pasted.substring(0, length);
            onChange(newValue);
            const focusIndex = Math.min(newValue.length, length) - 1;
            inputRefs.current[focusIndex]?.focus();
            if (newValue.length === length) {
                onComplete?.(newValue);
            }
        }
    };

    return (
        <div className="flex justify-center gap-2">
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={disabled}
                    className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
            ))}
        </div>
    );
};

export default OTPInput;
