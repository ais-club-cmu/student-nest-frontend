import { describe, it, expect } from 'vitest';
import {
    validateField,
    friendlyApiError,
    PASSWORD_RULES,
} from '@/lib/utils/registerValidation';

// ── PASSWORD_RULES ────────────────────────────────────────────────────────────

describe('PASSWORD_RULES', () => {
    it('has 4 rules', () => {
        expect(PASSWORD_RULES).toHaveLength(4);
    });

    it('len: passes for 8+ characters', () => {
        const rule = PASSWORD_RULES.find((r) => r.id === 'len')!;
        expect(rule.test('12345678')).toBe(true);
        expect(rule.test('1234567')).toBe(false);
    });

    it('upper: passes when at least one uppercase letter present', () => {
        const rule = PASSWORD_RULES.find((r) => r.id === 'upper')!;
        expect(rule.test('Password')).toBe(true);
        expect(rule.test('password')).toBe(false);
    });

    it('number: passes when at least one digit present', () => {
        const rule = PASSWORD_RULES.find((r) => r.id === 'number')!;
        expect(rule.test('pass1word')).toBe(true);
        expect(rule.test('password')).toBe(false);
    });

    it('special: passes when at least one non-alphanumeric character present', () => {
        const rule = PASSWORD_RULES.find((r) => r.id === 'special')!;
        expect(rule.test('pass!word')).toBe(true);
        expect(rule.test('passw0rd')).toBe(false);
    });
});

// ── validateField – full_name ─────────────────────────────────────────────────

describe('validateField – full_name', () => {
    it('returns error for empty string', () => {
        expect(validateField('full_name', '')).toBe('Full name is required.');
    });

    it('returns error for a single character', () => {
        expect(validateField('full_name', 'J')).toBe('Name must be at least 2 characters.');
    });

    it('returns error when no space (single word)', () => {
        expect(validateField('full_name', 'Jane')).toBe('Please enter your first and last name.');
    });

    it('returns empty string for first + last name', () => {
        expect(validateField('full_name', 'Jane Doe')).toBe('');
    });

    it('accepts names with multiple words', () => {
        expect(validateField('full_name', 'Jane Anne Doe')).toBe('');
    });

    it('trims leading/trailing whitespace before checking', () => {
        expect(validateField('full_name', '  Jane Doe  ')).toBe('');
    });
});

// ── validateField – email ─────────────────────────────────────────────────────

describe('validateField – email', () => {
    it('returns error for empty string', () => {
        expect(validateField('email', '')).toBe('Email address is required.');
    });

    it('returns error when @ is missing', () => {
        expect(validateField('email', 'janedoe.com')).toBe('Please enter a valid email address.');
    });

    it('returns error when domain is missing', () => {
        expect(validateField('email', 'jane@')).toBe('Please enter a valid email address.');
    });

    it('returns error for email with spaces', () => {
        expect(validateField('email', 'jane @andrew.cmu.edu')).toBe('Please enter a valid email address.');
    });

    it('returns empty string for a valid email', () => {
        expect(validateField('email', 'jane@andrew.cmu.edu')).toBe('');
    });

    it('accepts emails with subdomains', () => {
        expect(validateField('email', 'jane@mail.example.co.uk')).toBe('');
    });
});

// ── validateField – phone ─────────────────────────────────────────────────────

describe('validateField – phone', () => {
    it('returns empty string for empty value (field is optional)', () => {
        expect(validateField('phone', '')).toBe('');
    });

    it('returns error for alphabetic input', () => {
        expect(validateField('phone', 'abcdefg')).toBe('Please enter a valid phone number.');
    });

    it('returns error for too-short number', () => {
        expect(validateField('phone', '123')).toBe('Please enter a valid phone number.');
    });

    it('accepts international format with +', () => {
        expect(validateField('phone', '+250 700 000 000')).toBe('');
    });

    it('accepts plain 10-digit number', () => {
        expect(validateField('phone', '0700000000')).toBe('');
    });
});

// ── validateField – password ──────────────────────────────────────────────────

describe('validateField – password', () => {
    it('returns error for empty string', () => {
        expect(validateField('password', '')).toBe('Password is required.');
    });

    it('returns error when shorter than 8 characters', () => {
        expect(validateField('password', 'Ab1!')).toBe('Password must be at least 8 characters.');
    });

    it('returns error when no uppercase letter', () => {
        expect(validateField('password', 'abcdefg1!')).toBe('Add at least one uppercase letter.');
    });

    it('returns error when no digit', () => {
        expect(validateField('password', 'Abcdefgh!')).toBe('Add at least one number.');
    });

    it('returns error when no special character', () => {
        expect(validateField('password', 'Abcdefg1')).toBe('Add at least one special character.');
    });

    it('returns empty string for a strong password', () => {
        expect(validateField('password', 'Secure1!')).toBe('');
    });

    it('returns empty string for a longer strong password', () => {
        expect(validateField('password', 'MyP@ssw0rd123')).toBe('');
    });
});

// ── validateField – education_level ──────────────────────────────────────────

describe('validateField – education_level', () => {
    it('returns error for empty string', () => {
        expect(validateField('education_level', '')).toBe('Please select your education level.');
    });

    it('returns empty string for a valid selection', () => {
        expect(validateField('education_level', 'masters')).toBe('');
        expect(validateField('education_level', 'undergrad')).toBe('');
        expect(validateField('education_level', 'phd')).toBe('');
        expect(validateField('education_level', 'other')).toBe('');
    });
});

// ── validateField – unknown field ─────────────────────────────────────────────

describe('validateField – unknown field name', () => {
    it('returns empty string (no validation rule defined)', () => {
        expect(validateField('occupation_type', 'anything')).toBe('');
        expect(validateField('occupation_type', '')).toBe('');
    });
});

// ── friendlyApiError ──────────────────────────────────────────────────────────

describe('friendlyApiError', () => {
    it('maps Pydantic min_length message (at least 8 chars) to password error', () => {
        // 'at least 8' matches the first condition, which returns the password-specific message
        expect(friendlyApiError('String should have at least 8 characters')).toBe(
            'Password must be at least 8 characters.'
        );
    });

    it('maps min_length keyword to password error', () => {
        expect(friendlyApiError('min_length constraint failed')).toBe(
            'Password must be at least 8 characters.'
        );
    });

    it('maps generic "too short" message to field error', () => {
        expect(friendlyApiError('string should have at least 3 characters')).toBe(
            'One or more fields are too short — please check your input.'
        );
    });

    it('maps invalid email from Pydantic', () => {
        expect(friendlyApiError('value is not a valid email')).toBe(
            'Please enter a valid email address.'
        );
    });

    it('maps email + valid combination', () => {
        expect(friendlyApiError('Please enter a valid email address')).toBe(
            'Please enter a valid email address.'
        );
    });

    it('maps duplicate email – already exists', () => {
        expect(friendlyApiError('email already exists')).toBe(
            'An account with this email already exists.'
        );
    });

    it('maps duplicate email – exist keyword', () => {
        expect(friendlyApiError('A user with this email does exist')).toBe(
            'An account with this email already exists.'
        );
    });

    it('maps 422 unprocessable entity', () => {
        expect(friendlyApiError('422 unprocessable entity')).toBe(
            'Some fields are invalid — please review your input below.'
        );
    });

    it('maps network error', () => {
        expect(friendlyApiError('network request failed')).toBe(
            'Network error — please check your connection and try again.'
        );
    });

    it('returns the original message when no mapping matches', () => {
        expect(friendlyApiError('Something completely unexpected happened')).toBe(
            'Something completely unexpected happened'
        );
    });

    it('is case-insensitive', () => {
        expect(friendlyApiError('EMAIL ALREADY EXISTS')).toBe(
            'An account with this email already exists.'
        );
    });
});
