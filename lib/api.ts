import 'server-only';
import { cache } from 'react';

/**
 * DATA FETCHING IN NEXT.JS APP ROUTER
 * 
 * 1. ALWAYS use the native `fetch` API in Server Components when possible.
 *    Next.js extends `fetch` to automatically memoize requests and add caching/revalidation capabilities.
 * 
 * 2. ONLY use API Routes (`app/api/...`) if you are building an endpoint for EXTERNAL consumers 
 *    (like a mobile app or third-party webhooks). For first-party data fetching, call functions like this directly in Server Components.
 * 
 * 3. Use React's `cache` to manually memoize data if you are using an ORM (like Prisma) or a database client
 *    instead of `fetch()`. This prevents the same query from running multiple times if called in different components.
 * 
 * Below is an example of a tailored caching strategy using Incremental Static Regeneration (ISR).
 */

export const getHousingData = cache(async () => {
    try {
        // Example tailored caching strategy: Revalidate every 60 seconds (ISR)
        // const res = await fetch('https://api.example.com/housing', {
        //     next: { revalidate: 60 },
        // });
        // return res.json();

        // Return mock data for demo
        return [
            { id: 1, title: 'Luxury Villa 1', price: 1200000 },
            { id: 2, title: 'Luxury Villa 2', price: 1500000 },
            { id: 3, title: 'Luxury Villa 3', price: 900000 },
        ];
    } catch {
        return [];
    }
});
