/**
 * Types derived from StudentNest OpenAPI 3.1 schemas
 * (https://student-nest-backend-205p.onrender.com/openapi.json)
 */

export type AcademicYear = 'year_1' | 'year_2' | 'year_3+' | 'graduating';

export type EducationLevel = 'undergrad' | 'masters' | 'phd' | 'other';

export type KYCStatus = 'not_required' | 'pending' | 'approved' | 'rejected';

export type UserRole = 'student' | 'landlord' | 'moderator' | 'uni_admin' | 'super_admin';

export type UserStatus = 'pending' | 'active' | 'suspended' | 'banned';

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface LandlordRegisterRequest {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  business_name?: string | null;
  national_id: string;
  address: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  access_token: string;
  logout_all_devices?: boolean;
}

export interface MessageResponse {
  message: string;
}

export interface PasswordResetConfirm {
  access_token: string;
  new_password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RegisterResponse {
  user_id: string;
  message: string;
  requires_confirmation: boolean;
}

export interface StudentProfileUpdateRequest {
  cohort_year?: number | null;
  home_country?: string | null;
  program?: string | null;
  bio?: string | null;
  education_level?: EducationLevel | null;
  academic_year?: AcademicYear | null;
  housing_prefs?: Record<string, unknown> | null;
  is_seeking?: boolean | null;
  arrival_date?: string | null;
  departure_date?: string | null;
}

export interface StudentRegisterRequest {
  full_name: string;
  email: string;
  phone?: string | null;
  password: string;
  occupation_type?: string | null;
  educational_type?: string | null;
  education_level?: EducationLevel | null;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in: number;
  user_id: string;
  role: UserRole;
}

export interface UserProfileResponse {
  id: string;
  full_name: string;
  email_verified: boolean;
  email_verified_at: string | null;
  phone: string | null;
  phone_verified: boolean;
  role: UserRole;
  status: UserStatus;
  kyc_status: KYCStatus;
  mfa_enabled: boolean;
  last_login_at: string | null;
  created_at: string;
}
