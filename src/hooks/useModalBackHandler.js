import { useEffect, useRef } from 'react';

/**
 * Stack of active modal close handlers.
 * The Capacitor back-button handler in App.jsx calls closeTopModal()
 * to directly dismiss the topmost modal without relying on popstate.
 */
const modalStack = [];

export function isModalOpen() {
    return modalStack.length > 0;
}

/**
 * Directly close the topmost modal (used by Capacitor back-button).
 * Returns true if a modal was closed.
 */
export function closeTopModal() {
    if (modalStack.length === 0) return false;
    const top = modalStack[modalStack.length - 1];
    top.onClose();
    return true;
}

/**
 * Intercepts the hardware/browser back button while a modal is open.
 * Instead of navigating away, it calls onClose() to dismiss the modal.
 */
export default function useModalBackHandler(onClose) {
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        const entry = {
            onClose: () => onCloseRef.current(),
            poppedByBack: false,
        };
        modalStack.push(entry);

        // Push a modal entry into history so browser back has something to pop
        history.pushState({ modal: true }, '');

        const handlePopState = () => {
            // The history entry was already popped by the browser — don't pop again in cleanup
            entry.poppedByBack = true;
            onCloseRef.current();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            const idx = modalStack.indexOf(entry);
            if (idx !== -1) modalStack.splice(idx, 1);
            window.removeEventListener('popstate', handlePopState);
            // If closed via X button or closeTopModal(), the history entry
            // is still on the stack — pop it so back-button works normally.
            if (!entry.poppedByBack) {
                history.back();
            }
        };
    }, []);
}
