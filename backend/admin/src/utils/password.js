// Shared by Login, Register and ResetPassword so the rules can't drift apart.

// Same pattern the API validates with (libs/validator)
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The User model's minlength: the API's own check is looser (6), but the save would fail below 8
export const MIN_PASSWORD_LENGTH = 8;
export const MIN_PASSWORD_SCORE = 3;

const PASSWORD_STRENGTHS = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Very Weak', color: 'danger' },
    { score: 2, label: 'Weak', color: 'warning' },
    { score: 3, label: 'Fair', color: 'info' },
    { score: 4, label: 'Good', color: 'primary' },
    { score: 5, label: 'Strong', color: 'success' },
];

export const calculatePasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    return PASSWORD_STRENGTHS[score];
};