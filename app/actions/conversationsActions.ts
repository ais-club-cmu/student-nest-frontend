'use server';

import { nestRequest } from '@/lib/api';
import type {
  ConversationSummary,
  Message,
  SendMessageResponse,
} from '@/lib/types/api.types';

export async function getConversationsAction(accessToken: string) {
  return nestRequest<ConversationSummary[]>('/api/v1/conversations', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
}

export async function getConversationMessagesAction(
  accessToken: string,
  conversationId: string
) {
  return nestRequest<Message[]>(
    `/api/v1/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );
}

export async function sendMessageAction(
  accessToken: string,
  conversationId: string,
  body: string
) {
  return nestRequest<SendMessageResponse>(
    `/api/v1/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ body }),
      cache: 'no-store',
    }
  );
}
