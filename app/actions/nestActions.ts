'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { nestRequest } from '@/lib/api';
import type {
  ChangePasswordRequest,
  LandlordRegisterRequest,
  LoginRequest,
  LogoutRequest,
  MessageResponse,
  PasswordResetConfirm,
  PasswordResetRequest,
  RefreshRequest,
  RegisterResponse,
  StudentProfileUpdateRequest,
  StudentRegisterRequest,
  TokenResponse,
} from '@/lib/types/api.types';

function afterAuthMutation() {
  revalidateTag('auth', 'default');
  revalidateTag('profile', 'default');
  revalidatePath('/');
  revalidatePath('/login');
}

function afterProfileMutation() {
  revalidateTag('profile', 'default');
  revalidatePath('/');
  revalidatePath('/profile');
}

function afterAdminKycMutation() {
  revalidatePath('/');
  revalidatePath('/admin');
}

/**
 * Register a new student account.
 *
 * **Endpoint:** `POST /api/v1/auth/register/student`
 *
 * On success the backend sends a confirmation email; the account activates
 * when the link is clicked. Invalidates `auth` / `profile` cache tags and
 * revalidates `/` and `/login`.
 *
 * @param body  Student registration payload (full_name, CMU email, password, etc.).
 * @returns `ApiResult<RegisterResponse>` with the new `user_id` and confirmation flag.
 */
export async function registerStudentAction(body: StudentRegisterRequest) {
  const result = await nestRequest<RegisterResponse>('/api/v1/auth/register/student', {
    method: 'POST',
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (result.data) afterAuthMutation();
  return result;
}

/**
 * Register a new landlord account (created in `pending_kyc` status).
 *
 * **Endpoint:** `POST /api/v1/auth/register/landlord`
 *
 * The account is not usable until an admin approves KYC documents.
 *
 * @param body  Landlord registration payload (full_name, email, phone, national_id, address, etc.).
 * @returns `ApiResult<RegisterResponse>`.
 */
export async function registerLandlordAction(body: LandlordRegisterRequest) {
  const result = await nestRequest<RegisterResponse>('/api/v1/auth/register/landlord', {
    method: 'POST',
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (result.data) afterAuthMutation();
  return result;
}

/**
 * Authenticate with email and password.
 *
 * **Endpoint:** `POST /api/v1/auth/login`
 *
 * Returns a JWT pair on success. Enforces account lockout after repeated
 * failed attempts (server-side).
 *
 * @param body  `{ email, password }`.
 * @returns `ApiResult<TokenResponse>` containing access/refresh tokens, user_id, and role.
 */
export async function loginAction(body: LoginRequest) {
  const result = await nestRequest<TokenResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (result.data) afterAuthMutation();
  return result;
}

/**
 * Exchange a refresh token for a new JWT pair.
 *
 * **Endpoint:** `POST /api/v1/auth/refresh`
 *
 * Does **not** invalidate any cache — the caller should store the new tokens.
 *
 * @param body  `{ refresh_token }`.
 * @returns `ApiResult<TokenResponse>`.
 */
export async function refreshTokensAction(body: RefreshRequest) {
  return nestRequest<TokenResponse>('/api/v1/auth/refresh', {
    method: 'POST',
    body: JSON.stringify(body),
    cache: 'no-store',
  });
}

/**
 * Invalidate the current session server-side.
 *
 * **Endpoint:** `POST /api/v1/auth/logout`
 *
 * Optionally logs out all devices when `logout_all_devices` is `true`.
 *
 * @param body  `{ access_token, logout_all_devices? }`.
 * @returns `ApiResult<MessageResponse>`.
 */
export async function logoutAction(body: LogoutRequest) {
  const result = await nestRequest<MessageResponse>('/api/v1/auth/logout', {
    method: 'POST',
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (result.data) afterAuthMutation();
  return result;
}

/**
 * Request a password-reset email.
 *
 * **Endpoint:** `POST /api/v1/auth/password/reset-request`
 *
 * Always returns success to prevent user-enumeration attacks.
 *
 * @param body  `{ email }`.
 * @returns `ApiResult<MessageResponse>`.
 */
export async function requestPasswordResetAction(body: PasswordResetRequest) {
  const result = await nestRequest<MessageResponse>('/api/v1/auth/password/reset-request', {
    method: 'POST',
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (result.data) {
    revalidatePath('/login');
  }
  return result;
}

/**
 * Set a new password using the token received via the reset email.
 *
 * **Endpoint:** `POST /api/v1/auth/password/reset-confirm`
 *
 * @param body  `{ access_token, new_password }` — `access_token` here is the
 *              one-time reset token from the email link.
 * @returns `ApiResult<MessageResponse>`.
 */
export async function confirmPasswordResetAction(body: PasswordResetConfirm) {
  const result = await nestRequest<MessageResponse>('/api/v1/auth/password/reset-confirm', {
    method: 'POST',
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (result.data) afterAuthMutation();
  return result;
}

/**
 * Change the password for an already-authenticated user.
 *
 * **Endpoint:** `POST /api/v1/auth/password/change` (bearer-protected)
 *
 * @param accessToken  JWT access token.
 * @param body         `{ current_password, new_password }`.
 * @returns `ApiResult<MessageResponse>`.
 */
export async function changePasswordAction(accessToken: string, body: ChangePasswordRequest) {
  const result = await nestRequest<MessageResponse>('/api/v1/auth/password/change', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (result.data) {
    afterAuthMutation();
    revalidatePath('/settings');
  }
  return result;
}

/**
 * Partially update the authenticated student's profile.
 *
 * **Endpoint:** `PATCH /api/v1/auth/me/student-profile` (bearer-protected)
 *
 * All fields in the body are optional — only provided fields are updated.
 *
 * @param accessToken  JWT access token.
 * @param body         Partial student profile fields to update.
 * @returns `ApiResult<MessageResponse>`.
 */
export async function updateStudentProfileAction(accessToken: string, body: StudentProfileUpdateRequest) {
  const result = await nestRequest<MessageResponse>('/api/v1/auth/me/student-profile', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (result.data) afterProfileMutation();
  return result;
}

/**
 * Approve a landlord's KYC submission (admin only).
 *
 * **Endpoint:** `POST /api/v1/auth/admin/kyc/approve/{user_id}` (bearer-protected)
 *
 * @param accessToken  Admin JWT access token.
 * @param userId       UUID of the landlord account to approve.
 * @returns `ApiResult<MessageResponse>`.
 */
export async function approveLandlordKycAction(accessToken: string, userId: string) {
  const path = `/api/v1/auth/admin/kyc/approve/${encodeURIComponent(userId)}`;
  const result = await nestRequest<MessageResponse>(path, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (result.data) afterAdminKycMutation();
  return result;
}

/**
 * Reject a landlord's KYC submission (admin only).
 *
 * **Endpoint:** `POST /api/v1/auth/admin/kyc/reject/{user_id}?reason=...` (bearer-protected)
 *
 * @param accessToken  Admin JWT access token.
 * @param userId       UUID of the landlord account to reject.
 * @param reason       Human-readable rejection reason (sent as query param).
 * @returns `ApiResult<MessageResponse>`.
 */
export async function rejectLandlordKycAction(
  accessToken: string,
  userId: string,
  reason: string
) {
  const path = `/api/v1/auth/admin/kyc/reject/${encodeURIComponent(userId)}?reason=${encodeURIComponent(reason)}`;
  const result = await nestRequest<MessageResponse>(path, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (result.data) afterAdminKycMutation();
  return result;
}
