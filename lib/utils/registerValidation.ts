export const PASSWORD_RULES = [
    { id: 'len',     label: 'At least 8 characters',         test: (p: string) => p.length >= 8 },
    { id: 'upper',   label: 'At least one uppercase letter',  test: (p: string) => /[A-Z]/.test(p) },
    { id: 'number',  label: 'At least one number',            test: (p: string) => /[0-9]/.test(p) },
    { id: 'special', label: 'At least one special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export function friendlyApiError(msg: string): string {
    const m = msg.toLowerCase();
    if (m.includes('at least 8') || m.includes('min_length'))      return 'Password must be at least 8 characters.';
    if (m.includes('email') && m.includes('valid'))                return 'Please enter a valid email address.';
    if (m.includes('email') && m.includes('already'))              return 'An account with this email already exists.';
    if (m.includes('email') && m.includes('exist'))                return 'An account with this email already exists.';
    if (m.includes('phone') && m.includes('valid'))                return 'Please enter a valid phone number.';
    if (m.includes('string should have at least'))                 return 'One or more fields are too short — please check your input.';
    if (m.includes('value is not a valid email'))                  return 'Please enter a valid email address.';
    if (m.includes('field required'))                              return 'Please fill in all required fields.';
    if (m.includes('422') || m.includes('unprocessable'))          return 'Some fields are invalid — please review your input below.';
    if (m.includes('network') || m.includes('fetch'))             return 'Network error — please check your connection and try again.';
    return msg;
}

export function validateField(name: string, value: string): string {
    switch (name) {
        case 'full_name':
            if (!value.trim()) return 'Full name is required.';
            if (value.trim().length < 2) return 'Name must be at least 2 characters.';
            if (!/\s/.test(value.trim())) return 'Please enter your first and last name.';
            return '';
        case 'email':
            if (!value.trim()) return 'Email address is required.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
            return '';
        case 'phone':
            if (value && !/^\+?[\d\s\-().]{7,20}$/.test(value)) return 'Please enter a valid phone number.';
            return '';
        case 'password':
            if (!value) return 'Password is required.';
            if (value.length < 8) return 'Password must be at least 8 characters.';
            if (!/[A-Z]/.test(value)) return 'Add at least one uppercase letter.';
            if (!/[0-9]/.test(value)) return 'Add at least one number.';
            if (!/[^A-Za-z0-9]/.test(value)) return 'Add at least one special character.';
            return '';
        case 'education_level':
            if (!value) return 'Please select your education level.';
            return '';
        default:
            return '';
    }
}
