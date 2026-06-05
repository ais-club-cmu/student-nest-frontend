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

export interface KycDocument {
  id: string;
  doc_type: string;
  file_url: string;
  uploaded_at: string;
}

export interface PendingKycUser {
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  kyc_status: KYCStatus;
  submitted_at: string;
  documents: KycDocument[];
}

/** Actual response shape from GET /api/v1/auth/admin/kyc/{user_id} */
export interface LandlordKycDetail {
  user_id: string;
  full_name: string;
  landlord_email: string | null;
  phone: string | null;
  national_id: string;
  address: string;
  business_name: string | null;
  kyc_status: KYCStatus;
  docs_uploaded: string[];
  /** Keys are doc type slugs (e.g. "national_id"), values are signed URL paths */
  doc_signed_urls: Record<string, string>;
  submitted_at: string;
  docs_still_required: string[];
}

export interface KycUploadResponse {
  doc_type: string;
  message: string;
  docs_uploaded: string[];
  docs_still_required: string[];
  ready_for_review: boolean;
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
  has_security_question?: boolean;
}

export interface SecurityQuestionSetRequest {
  question: string;
  answer: string;
}

export interface SecurityQuestionFetchResponse {
  question: string;
  has_security_question: boolean;
}

export interface SecurityQuestionVerifyResponse {
  reset_token: string;
  expires_in: number;
}

// ── Listings ──────────────────────────────────────────────────────────────────

export type PropertyType = 'single_room' | 'shared_room' | 'self_contained_studio' | 'full_apartment';
export type FloorLevel = 'ground' | 'first' | 'second' | 'third' | 'fourth_plus';
export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'filled' | 'archived';
export type ListingType = 'standard' | 'torch_pass';
export type CalendarStatus = 'available' | 'occupied' | 'unavailable';
export type UtilityType = 'electricity' | 'water' | 'gas' | 'security' | 'garbage';
export type LeaseDuration = '1_month' | '3_months' | '6_months' | '12_months' | 'flexible';
export type SmokingPolicy = 'allowed' | 'no_smoking' | 'outside_only';
export type GenderPreference = 'female_only' | 'male_only' | 'no_preference';
export type VisitorPolicy = 'visitors_allowed' | 'no_visitors' | 'no_overnight_visitors';

export interface NeighborhoodResponse {
  id: string;
  name: string;
  sort_order: number;
}

export interface ListingMedia {
  id: string;
  url: string;
  display_order: number;
  is_cover: boolean;
  width_px?: number;
  height_px?: number;
}

export interface ListingProgress {
  step_1_completed: boolean;
  step_2_completed: boolean;
  step_3_completed: boolean;
  step_4_completed: boolean;
  step_5_completed: boolean;
  next_step: number;
  can_submit: boolean;
}

export interface CalendarEntry {
  month: number;
  year: number;
  status: CalendarStatus;
}

export type PetsAllowed = 'yes' | 'no' | 'negotiable';

export interface HouseRules {
  pets_allowed?: PetsAllowed | null;
  smoking_policy?: SmokingPolicy | null;
  gender_preference?: GenderPreference | null;
  visitor_policy?: VisitorPolicy | null;
  quiet_hours_start_utc?: string | null;
  quiet_hours_end_utc?: string | null;
  additional_rules?: string | null;
  virtual_tour_url?: string | null;
}

export interface ListingDraftResponse {
  id: string;
  listing_type: ListingType;
  status: ListingStatus;
  created_at: string;
  full_address?: string | null;
  neighborhood_id?: string | null;
  property_type?: PropertyType | null;
  floor_level?: FloorLevel | null;
  monthly_rent_rwf?: number | null;
  security_deposit_rwf?: number | null;
  utilities?: UtilityType[] | null;
  lease_durations?: LeaseDuration[] | null;
  house_rules?: HouseRules | null;
  calendar?: CalendarEntry[] | null;
  media: ListingMedia[];
  progress: ListingProgress;
}

export interface DraftListResponse {
  drafts: ListingDraftResponse[];
}

export interface Step1IdentityRequest {
  listing_type?: ListingType;
  full_address: string;
  neighborhood_id: string;
  property_type: PropertyType;
  floor_level: FloorLevel;
}

export interface Step1IdentityResponse {
  draft: ListingDraftResponse;
  warning?: string | null;
}

export interface Step2PricingRequest {
  monthly_rent_rwf: number;
  security_deposit_rwf?: number | null;
  utilities?: UtilityType[] | null;
  lease_durations?: LeaseDuration[] | null;
  confirm_above_average?: boolean;
}

export interface Step2PricingResponse {
  draft: ListingDraftResponse;
  usd_equivalent?: number | null;
  rate_used_rwf_per_usd?: number | null;
  using_cached_rate?: boolean;
  neighborhood_average_rwf?: number | null;
  warning?: string | null;
}

export interface MediaUploadResponse {
  id: string;
  display_order: number;
  is_cover: boolean;
  url: string;
  width_px: number;
  height_px: number;
  total_uploaded: number;
  can_proceed: boolean;
}

export interface MediaReorderItem {
  media_id: string;
  display_order: number;
}

export interface MediaDeleteResponse {
  message: string;
  total_uploaded: number;
  can_proceed: boolean;
}

export interface Step3CompleteResponse {
  draft: ListingDraftResponse;
  total_uploaded: number;
}

export interface ListingSubmitResponse {
  listing_id: string;
  status: ListingStatus;
  message: string;
  duplicate_flags: string[];
}

export interface ListingModerationQueueItem {
  listing_id: string;
  full_address: string;
  neighborhood_name?: string | null;
  property_type: PropertyType;
  monthly_rent_rwf: number;
  owner_name: string;
  owner_email: string;
  submitted_at: string;
  media_count: number;
  cover_url?: string | null;
}

export interface AdminListingDetail {
  id: string;
  status: ListingStatus;
  listing_type: ListingType;
  full_address?: string | null;
  neighborhood_name?: string | null;
  property_type?: PropertyType | null;
  floor_level?: FloorLevel | null;
  monthly_rent_rwf?: number | null;
  security_deposit_rwf?: number | null;
  utilities?: UtilityType[] | null;
  lease_durations?: LeaseDuration[] | null;
  house_rules?: HouseRules | null;
  calendar?: CalendarEntry[] | null;
  media: ListingMedia[];
  owner_name?: string | null;
  owner_email?: string | null;
  submitted_at?: string | null;
  verified_badge?: boolean;
}

export interface ModerationApproveResponse {
  listing_id: string;
  status: ListingStatus;
  verified_badge: boolean;
  message: string;
}

export interface ModerationRejectResponse {
  listing_id: string;
  status: ListingStatus;
  message: string;
}

export interface ScamReportResponse {
  listing_id: string;
  total_reports: number;
  escalated: boolean;
  message: string;
}

export interface ListingDashboardCard {
  id: string;
  full_address?: string | null;
  neighborhood_name?: string | null;
  property_type?: PropertyType | null;
  monthly_rent_rwf?: number | null;
  status: ListingStatus;
  cover_url?: string | null;
}

export interface ListingDashboardSummary {
  active: number;
  pending_review: number;
  filled: number;
  archived: number;
  drafts: number;
}

export interface ListingDashboardResponse {
  summary: ListingDashboardSummary;
  active: ListingDashboardCard[];
  pending_review: ListingDashboardCard[];
  filled: ListingDashboardCard[];
  archived: ListingDashboardCard[];
  drafts: ListingDashboardCard[];
}

export interface ListingLifecycleResponse {
  listing_id: string;
  status: ListingStatus;
  message: string;
}

export interface PublicListing {
  id: string;
  full_address?: string | null;
  neighborhood_name?: string | null;
  property_type?: PropertyType | null;
  floor_level?: FloorLevel | null;
  monthly_rent_rwf?: number | null;
  security_deposit_rwf?: number | null;
  utilities?: UtilityType[] | null;
  lease_durations?: LeaseDuration[] | null;
  cover_url?: string | null;
  media?: ListingMedia[];
  calendar?: CalendarEntry[] | null;
  house_rules?: HouseRules | null;
  status: ListingStatus;
  verified_badge?: boolean;
}

// ── Applications ──────────────────────────────────────────────────────────────

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export interface ApplicationResponse {
  application_id: string;
  listing_id: string;
  status: ApplicationStatus;
  message: string;
}

export interface ApplicationSummary {
  application_id: string;
  applicant_name: string;
  status: ApplicationStatus;
  message?: string | null;
  created_at: string;
}

export interface ApplicationDetail {
  application_id: string;
  listing_id: string;
  applicant_name: string;
  applicant_email: string;
  program?: string | null;
  home_country?: string | null;
  message?: string | null;
  status: ApplicationStatus;
  created_at: string;
}

// ── Conversations ─────────────────────────────────────────────────────────────

export interface ConversationSummary {
  id: string;
  listing_id: string;
  listing_address: string | null;
  application_id: string | null;
  landlord_user_id: string;
  landlord_name: string;
  student_user_id: string;
  student_name: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count?: number;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  sender_name: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface SendMessageResponse {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  body: string;
  created_at: string;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export interface NotificationResponse {
  id: string;
  title: string;
  body: string;
  entity_type?: string | null;
  entity_id?: string | null;
  is_read: boolean;
}
