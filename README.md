# Next.js App Router: Housing App

Welcome to the Housing App project! This repository follows modern Next.js 14+ architectural patterns. Before contributing, please review the guidelines on architecture, styling, and how to fetch or mutate data effectively using React Server Components (RSC) and Server Actions.

**IMPORTANT:** Before submitting a PR, please read our [Contributing Guidelines](./CONTRIBUTING.md).

---

## Project Resources

- [Project Documentation](https://docs.google.com/document/d/18LSgpdrAMlSPjhV9TC2E5KHJUaXUuSPK/edit)
- [Project Tasks](https://docs.google.com/spreadsheets/d/19fOP3oQnLaUQ4bfNvKcPVFjN-Q9V6io0/edit?gid=315764263#gid=315764263)
- [Contributing Guidelines](./CONTRIBUTING.md)

---

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Architecture & Directory Structure

We strictly use the **Next.js App Router** paradigm.

- `app/`: Routing layer containing all Pages (`page.tsx`), Layouts (`layout.tsx`), and Loading UIs (`loading.tsx`). Defaults strictly to Server Components.
- `app/actions/`: Contains reusable **Server Actions**. For example `formHelpers.ts`, which bypasses the need to attach API endpoints to form requests.
- `components/ui/`: Contains agnostic, atom-level reusable UI parts like Buttons, Loaders, and Cards heavily utilizing Tailwind CSS.
- `components/features/`: Contains feature-specific components linked to Domain Logic, like `HousingListClient.tsx`. These are usually `use client` files.
- `lib/`: Contains utilities, backend integrations, ORM configurations, and pure Data Fetching wrappers like `api.ts`.
- `store/`: For global **client state** only, handled by lightweight, modular stores using `zustand`.

---

## Contributor Philosophy

### 1. Data Fetching (Queries)
**Avoid client-side fetching as much as possible.** 
* When making queries, keep them in **Server Components**. 
* Next.js automatically enhances the native `fetch` API to cache duplicated requests in the component tree.
* If you are calling a database directly without `fetch` (e.g. Prisma), wrap your query functions in React's native `cache()`.
* **See `lib/api.ts`** for a documented example showcasing caching rules & ISR (Incremental Static Regeneration).

### 2. Mutations (Updating Data)
**Do not use external networking tools like React Query, Axios or standard `POST` API Routes (`app/api/*`) for standard operations.**
* We exclusively use **Server Actions**. 
* Server actions are defined as standard `async` functions with the `'use server'` directive either at the top of the file, or the top of the function.
* You should use Server Actions inside your Client Component event handlers, or pass them natively to `<form action={myServerAction}>`.
* Once data is successfully saved to a database, call Next.js `revalidatePath(...)` or `revalidateTag(...)` from `next/cache` inside your server action to auto-purge the cache, prompting an instant UI refresh on the client without manual network refetching logic.
* **See `app/actions/formHelpers.ts`** for a complete documented example.

### 3. State Management
* **Server State**: Managed strictly by Server Components (via URL Query Params for search/filter, and dynamic routing).
* **Local UI State**: Managed via native `useState` / `useReducer` in individual components.
* **Global Client State**: Used sparingly! We implement `zustand` strictly for features that *must* be globally available to the client outside of the standard URL, like a persistent 'Favorites' cart. 
* **See `store/useHousingStore.ts`** for an example.

### 4. UI & Styling
* Use **Tailwind CSS** directly in `className` tags.
* Leverage `components/ui` for primitives. Do not redefine common buttons or cards; import and extend `components/ui/Button` or `components/ui/Card`.
* Next.js automatically manages font loading via `next/font/google` and image lazy-loading optimizations via `<Image />` (`next/image`).

Happy building!
