import { type NextRequest, NextResponse } from 'next/server';
import { NEST_API_BASE_URL } from '@/lib/api';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const listingId = req.nextUrl.searchParams.get('listing_id');
    if (!listingId) {
        return NextResponse.json({ message: 'listing_id query param is required' }, { status: 400 });
    }

    const formData = await req.formData();
    const backendUrl = `${NEST_API_BASE_URL}/api/v1/listings/drafts/${encodeURIComponent(listingId)}/media`;

    const backendRes = await fetch(backendUrl, {
        method: 'POST',
        headers: { Authorization: authHeader },
        body: formData,
    });

    const text = await backendRes.text();
    const payload = text.trim() ? JSON.parse(text) : null;

    if (!backendRes.ok) {
        console.error(`[listing-media] Backend error ${backendRes.status}:`, payload);
    }

    return NextResponse.json(payload, { status: backendRes.status });
}
