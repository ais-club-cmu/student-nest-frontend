import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Mocks (hoisted before imports) ───────────────────────────────────────────

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush, replace: vi.fn(), back: vi.fn(), prefetch: vi.fn() }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/register',
}));

vi.mock('next/link', () => ({
    default: ({ children, href, target }: { children: React.ReactNode; href: string; target?: string }) => (
        <a href={href} target={target}>{children}</a>
    ),
}));

vi.mock('@/app/actions/nestActions', () => ({
    registerStudentAction: vi.fn(),
}));

import RegisterPage from '@/app/register/page';
import { registerStudentAction } from '@/app/actions/nestActions';

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockRegister = vi.mocked(registerStudentAction);

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/student email/i), 'jane@andrew.cmu.edu');
    await user.type(screen.getByLabelText(/^password/i), 'Secure1!');
    await user.selectOptions(screen.getByLabelText(/education level/i), 'masters');
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RegisterPage', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ── Rendering ─────────────────────────────────────────────────────────────

    describe('rendering', () => {
        it('renders the page heading', () => {
            render(<RegisterPage />);
            expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
        });

        it('renders all required input fields', () => {
            render(<RegisterPage />);
            expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/student email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/education level/i)).toBeInTheDocument();
        });

        it('renders optional fields', () => {
            render(<RegisterPage />);
            expect(screen.getByLabelText(/occupation type/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/educational type/i)).toBeInTheDocument();
        });

        it('renders the submit button', () => {
            render(<RegisterPage />);
            expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
        });

        it('renders the terms of service and privacy policy links', () => {
            render(<RegisterPage />);
            expect(screen.getByRole('link', { name: /terms of service/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument();
        });

        it('renders the sign in link', () => {
            render(<RegisterPage />);
            expect(screen.getByRole('link', { name: /log in here/i })).toBeInTheDocument();
        });
    });

    // ── Submit validation ─────────────────────────────────────────────────────

    describe('empty form submission', () => {
        it('shows required field errors without calling the API', async () => {
            render(<RegisterPage />);
            await user.click(screen.getByRole('button', { name: /create account/i }));

            expect(screen.getByText('Full name is required.')).toBeInTheDocument();
            expect(screen.getByText('Email address is required.')).toBeInTheDocument();
            expect(screen.getByText('Password is required.')).toBeInTheDocument();
            expect(screen.getByText('Please select your education level.')).toBeInTheDocument();
            expect(mockRegister).not.toHaveBeenCalled();
        });
    });

    // ── Field-level validation on blur ────────────────────────────────────────

    describe('full name validation', () => {
        it('shows error when user enters only a first name and tabs away', async () => {
            render(<RegisterPage />);
            await user.type(screen.getByLabelText(/full name/i), 'Jane');
            await user.tab();
            expect(screen.getByText('Please enter your first and last name.')).toBeInTheDocument();
        });

        it('clears the error once a valid full name is typed', async () => {
            render(<RegisterPage />);
            const input = screen.getByLabelText(/full name/i);
            await user.type(input, 'Jane');
            await user.tab();
            expect(screen.getByText('Please enter your first and last name.')).toBeInTheDocument();

            await user.clear(input);
            await user.type(input, 'Jane Doe');
            expect(screen.queryByText('Please enter your first and last name.')).not.toBeInTheDocument();
        });

        it('shows error for empty field on blur', async () => {
            render(<RegisterPage />);
            await user.click(screen.getByLabelText(/full name/i));
            await user.tab();
            expect(screen.getByText('Full name is required.')).toBeInTheDocument();
        });
    });

    describe('email validation', () => {
        it('shows error for an invalid email on blur', async () => {
            render(<RegisterPage />);
            await user.type(screen.getByLabelText(/student email/i), 'notanemail');
            await user.tab();
            expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
        });

        it('clears the error when a valid email is entered', async () => {
            render(<RegisterPage />);
            const input = screen.getByLabelText(/student email/i);
            await user.type(input, 'bad');
            await user.tab();
            expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();

            await user.clear(input);
            await user.type(input, 'jane@andrew.cmu.edu');
            expect(screen.queryByText('Please enter a valid email address.')).not.toBeInTheDocument();
        });
    });

    describe('phone validation', () => {
        it('shows error for a non-numeric phone on blur', async () => {
            render(<RegisterPage />);
            await user.type(screen.getByLabelText(/phone number/i), 'abc');
            await user.tab();
            expect(screen.getByText('Please enter a valid phone number.')).toBeInTheDocument();
        });

        it('shows no error when phone is left empty (optional)', async () => {
            render(<RegisterPage />);
            await user.click(screen.getByLabelText(/phone number/i));
            await user.tab();
            expect(screen.queryByText('Please enter a valid phone number.')).not.toBeInTheDocument();
        });

        it('accepts an international phone number', async () => {
            render(<RegisterPage />);
            await user.type(screen.getByLabelText(/phone number/i), '+250700000000');
            await user.tab();
            expect(screen.queryByText('Please enter a valid phone number.')).not.toBeInTheDocument();
        });
    });

    // ── Password checklist ────────────────────────────────────────────────────

    describe('password requirements checklist', () => {
        it('shows all four requirement labels when the password field is focused', async () => {
            render(<RegisterPage />);
            await user.click(screen.getByLabelText(/^password/i));
            expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
            expect(screen.getByText('At least one uppercase letter')).toBeInTheDocument();
            expect(screen.getByText('At least one number')).toBeInTheDocument();
            expect(screen.getByText('At least one special character')).toBeInTheDocument();
        });

        it('checklist remains visible after blur when password has content', async () => {
            render(<RegisterPage />);
            const input = screen.getByLabelText(/^password/i);
            await user.type(input, 'partial');
            await user.tab();
            // touched + non-empty → checklist stays visible
            expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
        });

        it('does not show checklist before the field is touched', () => {
            render(<RegisterPage />);
            expect(screen.queryByText('At least 8 characters')).not.toBeInTheDocument();
        });
    });

    // ── Education level ───────────────────────────────────────────────────────

    describe('education level validation', () => {
        it('shows error when no option is selected and form is submitted', async () => {
            render(<RegisterPage />);
            await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
            await user.type(screen.getByLabelText(/student email/i), 'jane@andrew.cmu.edu');
            await user.type(screen.getByLabelText(/^password/i), 'Secure1!');
            // skip education level
            await user.click(screen.getByRole('button', { name: /create account/i }));
            expect(screen.getByText('Please select your education level.')).toBeInTheDocument();
            expect(mockRegister).not.toHaveBeenCalled();
        });
    });

    // ── Successful submission ─────────────────────────────────────────────────

    describe('successful registration', () => {
        it('calls registerStudentAction with the correct payload', async () => {
            mockRegister.mockResolvedValueOnce({
                data: { user_id: 'u1', message: 'check email', requires_confirmation: true },
                error: null,
            });

            render(<RegisterPage />);
            await fillRequiredFields(user);
            await user.click(screen.getByRole('button', { name: /create account/i }));

            await waitFor(() => {
                expect(mockRegister).toHaveBeenCalledWith(
                    expect.objectContaining({
                        full_name: 'Jane Doe',
                        email: 'jane@andrew.cmu.edu',
                        password: 'Secure1!',
                        education_level: 'masters',
                    })
                );
            });
        });

        it('redirects to /verify after successful registration', async () => {
            mockRegister.mockResolvedValueOnce({
                data: { user_id: 'u1', message: 'check email', requires_confirmation: true },
                error: null,
            });

            render(<RegisterPage />);
            await fillRequiredFields(user);
            await user.click(screen.getByRole('button', { name: /create account/i }));

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/verify');
            });
        });

        it('shows a loading state while the request is in flight', async () => {
            let resolve: (v: unknown) => void;
            mockRegister.mockImplementationOnce(
                () => new Promise((r) => { resolve = r; })
            );

            render(<RegisterPage />);
            await fillRequiredFields(user);
            await user.click(screen.getByRole('button', { name: /create account/i }));

            expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();

            resolve!({
                data: { user_id: 'u1', message: 'ok', requires_confirmation: true },
                error: null,
            });
        });
    });

    // ── API error handling ────────────────────────────────────────────────────

    describe('API error handling', () => {
        it('displays a friendly message when the email is already taken', async () => {
            mockRegister.mockResolvedValueOnce({
                data: null,
                error: { message: 'email already exists' },
            });

            render(<RegisterPage />);
            await fillRequiredFields(user);
            await user.click(screen.getByRole('button', { name: /create account/i }));

            await waitFor(() => {
                expect(
                    screen.getByText('An account with this email already exists.')
                ).toBeInTheDocument();
            });
            expect(mockPush).not.toHaveBeenCalled();
        });

        it('displays a friendly message for Pydantic password length errors', async () => {
            mockRegister.mockResolvedValueOnce({
                data: null,
                error: { message: 'String should have at least 8 characters' },
            });

            render(<RegisterPage />);
            await fillRequiredFields(user);
            await user.click(screen.getByRole('button', { name: /create account/i }));

            await waitFor(() => {
                expect(
                    screen.getByText('Password must be at least 8 characters.')
                ).toBeInTheDocument();
            });
        });

        it('clears the API error when the user starts typing again', async () => {
            mockRegister.mockResolvedValueOnce({
                data: null,
                error: { message: 'email already exists' },
            });

            render(<RegisterPage />);
            await fillRequiredFields(user);
            await user.click(screen.getByRole('button', { name: /create account/i }));

            await waitFor(() => {
                expect(
                    screen.getByText('An account with this email already exists.')
                ).toBeInTheDocument();
            });

            // Typing in any field should clear the API-level error
            await user.type(screen.getByLabelText(/full name/i), ' Jr');
            expect(
                screen.queryByText('An account with this email already exists.')
            ).not.toBeInTheDocument();
        });
    });
});
