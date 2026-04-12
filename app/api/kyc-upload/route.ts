import { type NextRequest, NextResponse } from 'next/server';
import { NEST_API_BASE_URL } from '@/lib/api';

// Allow up to 10 MB through this route handler
export const maxDuration = 30;

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const docType = req.nextUrl.searchParams.get('doc_type');
    if (!docType) {
        return NextResponse.json({ message: 'doc_type query param is required' }, { status: 400 });
    }

    // Forward the raw multipart body directly to the backend
    const formData = await req.formData();
    const backendUrl = `${NEST_API_BASE_URL}/api/v1/auth/me/kyc-documents?doc_type=${encodeURIComponent(docType)}`;

    const backendRes = await fetch(backendUrl, {
        method: 'POST',
        headers: { Authorization: authHeader },
        body: formData,
    });

    const text = await backendRes.text();
    const payload = text.trim() ? JSON.parse(text) : null;

    return NextResponse.json(payload, { status: backendRes.status });
}
