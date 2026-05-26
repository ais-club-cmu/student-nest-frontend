import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Prevent 'server-only' from throwing in the jsdom test environment
vi.mock('server-only', () => ({}));

// Silence Next.js router warnings that appear in jsdom
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
    cache: (fn: unknown) => fn,
}));
