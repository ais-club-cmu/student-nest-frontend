'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { nestRequest } from '@/lib/api';
import type {
  AdminListingDetail,
  ApplicationResponse,
  ApplicationSummary,
  CalendarEntry,
  DraftListResponse,
  HouseRules,
  ListingDashboardResponse,
  ListingDraftResponse,
  ListingLifecycleResponse,
  ListingModerationQueueItem,
  ListingSubmitResponse,
  ListingType,
  MediaDeleteResponse,
  MediaReorderItem,
  MessageResponse,
  ModerationApproveResponse,
  ModerationRejectResponse,
  NeighborhoodResponse,
  PropertyType,
  PublicListing,
  ScamReportResponse,
  Step1IdentityRequest,
  Step1IdentityResponse,
  Step2PricingRequest,
  Step2PricingResponse,
  Step3CompleteResponse,
} from '@/lib/types/api.types';

function afterListingMutation(listingId?: string) {
  revalidateTag('listings', 'default');
  revalidatePath('/landlord/listings');
  if (listingId) revalidatePath(`/landlord/listings/${listingId}`);
}

export async function getNeighborhoodsAction() {
  return nestRequest<NeighborhoodResponse[]>('/api/v1/listings/neighborhoods', {
    method: 'GET',
    next: { revalidate: 3600, tags: ['neighborhoods'] },
  });
}

export async function createDraftAction(accessToken: string, listingType?: ListingType) {
  const body = listingType ? JSON.stringify({ listing_type: listingType }) : '{}';
  return nestRequest<ListingDraftResponse>('/api/v1/listings/drafts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body,
    cache: 'no-store',
  });
}

export async function getMyDraftsAction(accessToken: string) {
  return nestRequest<DraftListResponse>('/api/v1/listings/drafts/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
}

export async function getDraftAction(accessToken: string, listingId: string) {
  return nestRequest<ListingDraftResponse>(
    `/api/v1/listings/drafts/${encodeURIComponent(listingId)}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
}

export async function updateDraftStep1Action(
  accessToken: string,
  listingId: string,
  body: Step1IdentityRequest
) {
  const result = await nestRequest<Step1IdentityResponse>(
    `/api/v1/listings/drafts/${encodeURIComponent(listingId)}/step-1`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
      cache: 'no-store',
    }
  );
  if (result.data) afterListingMutation(listingId);
  return result;
}

export async function updateDraftStep2Action(
  accessToken: string,
  listingId: string,
  body: Step2PricingRequest
) {
  const result = await nestRequest<Step2PricingResponse>(
    `/api/v1/listings/drafts/${encodeURIComponent(listingId)}/step-2`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
      cache: 'no-store',
    }
  );
  if (result.data) afterListingMutation(listingId);
  return result;
}

export async function reorderDraftMediaAction(
  accessToken: string,
  listingId: string,
  items: MediaReorderItem[]
) {
  const result = await nestRequest<ListingDraftResponse>(
    `/api/v1/listings/drafts/${encodeURIComponent(listingId)}/media/reorder`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ items }),
      cache: 'no-store',
    }
  );
  if (result.data) afterListingMutation(listingId);
  return result;
}

export async function deleteDraftMediaAction(
  accessToken: string,
  listingId: string,
  mediaId: string
) {
  const result = await nestRequest<MediaDeleteResponse>(
    `/api/v1/listings/drafts/${encodeURIComponent(listingId)}/media/${encodeURIComponent(mediaId)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
  if (result.data) afterListingMutation(listingId);
  return result;
}

export async function completeDraftStep3Action(accessToken: string, listingId: string) {
  const result = await nestRequest<Step3CompleteResponse>(
    `/api/v1/listings/drafts/${encodeURIComponent(listingId)}/step-3/complete`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
  if (result.data) afterListingMutation(listingId);
  return result;
}

export async function updateDraftStep4Action(
  accessToken: string,
  listingId: string,
  calendar: CalendarEntry[]
) {
  const result = await nestRequest<ListingDraftResponse>(
    `/api/v1/listings/drafts/${encodeURIComponent(listingId)}/step-4`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ calendar }),
      cache: 'no-store',
    }
  );
  if (result.data) afterListingMutation(listingId);
  return result;
}

export async function updateDraftStep5Action(
  accessToken: string,
  listingId: string,
  body: HouseRules
) {
  const result = await nestRequest<ListingDraftResponse>(
    `/api/v1/listings/drafts/${encodeURIComponent(listingId)}/step-5`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
      cache: 'no-store',
    }
  );
  if (result.data) afterListingMutation(listingId);
  return result;
}

export async function submitDraftAction(accessToken: string, listingId: string) {
  const result = await nestRequest<ListingSubmitResponse>(
    `/api/v1/listings/drafts/${encodeURIComponent(listingId)}/submit`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
  if (result.data) afterListingMutation(listingId);
  return result;
}

export async function getPublicListingDetailAction(listingId: string) {
  return nestRequest<PublicListing>(`/api/v1/listings/${encodeURIComponent(listingId)}`, {
    method: 'GET',
    next: { revalidate: 60, tags: ['listings'] },
  });
}

export async function getAdminListingDetailAction(accessToken: string, listingId: string) {
  // Try the admin endpoint first (returns owner info), fall back to draft for pending_review items
  const result = await nestRequest<AdminListingDetail>(
    `/api/v1/listings/admin/${encodeURIComponent(listingId)}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
  if (result.data || result.error?.status !== 404) return result;
  return nestRequest<AdminListingDetail>(
    `/api/v1/listings/drafts/${encodeURIComponent(listingId)}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
}

export async function applyToListingAction(
  accessToken: string,
  listingId: string,
  message?: string
) {
  return nestRequest<ApplicationResponse>(
    `/api/v1/listings/${encodeURIComponent(listingId)}/apply`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ message: message ?? '' }),
      cache: 'no-store',
    }
  );
}

export async function getListingApplicationsAction(accessToken: string, listingId: string) {
  return nestRequest<ApplicationSummary[]>(
    `/api/v1/listings/${encodeURIComponent(listingId)}/applications`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
}

export async function getListingReviewQueueAction(accessToken: string) {
  return nestRequest<ListingModerationQueueItem[]>('/api/v1/listings/admin/review-queue', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
}

export async function approveListingAction(accessToken: string, listingId: string) {
  const result = await nestRequest<ModerationApproveResponse>(
    `/api/v1/listings/admin/${encodeURIComponent(listingId)}/approve`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
  if (result.data) afterListingMutation(listingId);
  return result;
}

export async function rejectListingAction(
  accessToken: string,
  listingId: string,
  reason: string
) {
  const result = await nestRequest<ModerationRejectResponse>(
    `/api/v1/listings/admin/${encodeURIComponent(listingId)}/reject`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ reason }),
      cache: 'no-store',
    }
  );
  if (result.data) afterListingMutation(listingId);
  return result;
}

export async function reportScamAction(
  accessToken: string,
  listingId: string,
  reason: string
) {
  return nestRequest<ScamReportResponse>(
    `/api/v1/listings/${encodeURIComponent(listingId)}/report-scam`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ reason }),
      cache: 'no-store',
    }
  );
}

export async function getListingDashboardAction(accessToken: string) {
  return nestRequest<ListingDashboardResponse>('/api/v1/listings/me/dashboard', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
}

export async function markFilledAction(accessToken: string, listingId: string) {
  const result = await nestRequest<ListingLifecycleResponse>(
    `/api/v1/listings/${encodeURIComponent(listingId)}/mark-filled`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
  if (result.data) afterListingMutation(listingId);
  return result;
}

export async function archiveListingAction(accessToken: string, listingId: string) {
  const result = await nestRequest<ListingLifecycleResponse>(
    `/api/v1/listings/${encodeURIComponent(listingId)}/archive`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
  if (result.data) afterListingMutation(listingId);
  return result;
}

export async function deleteDraftListingAction(accessToken: string, listingId: string) {
  const result = await nestRequest<ListingLifecycleResponse>(
    `/api/v1/listings/drafts/${encodeURIComponent(listingId)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
  if (result.data) {
    revalidateTag('listings', 'default');
    revalidatePath('/landlord/listings');
  }
  return result;
}

export async function getPublicListingsAction(params?: {
  property_type?: PropertyType;
  neighborhood_id?: string;
}) {
  const query = new URLSearchParams();
  if (params?.property_type) query.set('property_type', params.property_type);
  if (params?.neighborhood_id) query.set('neighborhood_id', params.neighborhood_id);
  const qs = query.toString();
  return nestRequest<PublicListing[]>(`/api/v1/listings${qs ? `?${qs}` : ''}`, {
    method: 'GET',
    next: { revalidate: 60, tags: ['listings'] },
  });
}

export async function getListingsHealthAction() {
  return nestRequest<Record<string, unknown>>('/api/v1/listings/health', {
    method: 'GET',
    next: { revalidate: 300, tags: ['health'] },
  });
}

export async function getNotificationsHealthAction() {
  return nestRequest<Record<string, unknown>>('/api/v1/notifications/health', {
    method: 'GET',
    next: { revalidate: 300, tags: ['health'] },
  });
}

export async function getNotificationsAction(accessToken: string) {
  return nestRequest<import('@/lib/types/api.types').NotificationResponse[]>(
    '/api/v1/notifications/me',
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
}

export async function markNotificationReadAction(
  accessToken: string,
  notificationId: string
) {
  return nestRequest<MessageResponse>(
    `/api/v1/notifications/${encodeURIComponent(notificationId)}/read`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
}
