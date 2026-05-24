'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function Redirect() {
    const router = useRouter();
    useEffect(() => { router.replace('/add-listing/step-4'); }, [router]);
    return null;
}
