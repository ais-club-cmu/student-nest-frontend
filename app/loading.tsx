import { FullPageLoader } from '@/components/ui/Loader';

// Next.js automatically wraps this route's page in a Suspense boundary with this UI
export default function Loading() {
    return <FullPageLoader />;
}
