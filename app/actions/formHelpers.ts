'use client';

/**
 * MUTATIONS & DATA UPDATES IN NEXT.JS APP ROUTER
 * 
 * We use Server Actions (`use server`) for handling data mutations instead of building REST/API endpoints.
 * This skips the need to manage client-side fetching libraries like React Query or SWR for standard form submissions.
 * 
 * 1. Define async functions with the `"use server"` directive at the top of the file (or function block).
 * 2. You can pass these functions directly into the `action` prop of a native `<form>` element, 
 *    or call them procedurally as an async function in a Client Component (like `HousingListClient.tsx`).
 * 3. Use `revalidatePath('...')` or `revalidateTag('...')` from `next/cache` inside your server action
 *    to automatically tell Next.js to purge the cached UI segments so the client sees the updated data instantly.
 */

import { revalidatePath } from 'next/cache';

// Example server action taking FormData for a housing inquiry
export async function submitHousingInquiry(formData: FormData) {
    const name = formData.get('name');
    const message = formData.get('message');

    // Simulate validation
    if (!name || !message) {
        return { error: 'Name and message are required.' };
    }

    // Process the data (e.g., save to DB via ORM)
    console.log(`Inquiry received from ${name}: ${message}`);

    // Revalidate a route path so updated data on that page is refreshed
    revalidatePath('/');

    return { success: true, message: 'Inquiry submitted successfully.' };
}
