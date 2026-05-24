'use server';

import { revalidatePath } from 'next/cache';

import { nestRequest } from '@/lib/api';
import type {
  ApplicationDetail,
  ApplicationResponse,
} from '@/lib/types/api.types';

export async function getApplicationDetailAction(
  accessToken: string,
  applicationId: string
) {
  return nestRequest<ApplicationDetail>(
    `/api/v1/applications/${encodeURIComponent(applicationId)}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
}

export async function approveApplicationAction(
  accessToken: string,
  applicationId: string
) {
  const result = await nestRequest<ApplicationResponse>(
    `/api/v1/applications/${encodeURIComponent(applicationId)}/approve`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
  if (result.data) revalidatePath('/landlord/listings');
  return result;
}

export async function rejectApplicationAction(
  accessToken: string,
  applicationId: string
) {
  const result = await nestRequest<ApplicationResponse>(
    `/api/v1/applications/${encodeURIComponent(applicationId)}/reject`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
  if (result.data) revalidatePath('/landlord/listings');
  return result;
}
