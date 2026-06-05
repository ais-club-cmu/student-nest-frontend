'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getConversationsAction,
    getConversationMessagesAction,
    sendMessageAction,
} from '@/app/actions/conversationsActions';
import { getUserProfileAction } from '@/app/actions/nestActions';
import { handleAuthError } from '@/lib/auth-redirect';
import type { ConversationSummary, Message } from '@/lib/types/api.types';

function fmtTime(iso: string | null | undefined) {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ConversationsPane() {
    const router = useRouter();

    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [loadingConvs, setLoadingConvs] = useState(true);
    const [convError, setConvError] = useState<string | null>(null);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [msgsError, setMsgsError] = useState<string | null>(null);

    // Use a ref so the value is always current inside callbacks without re-triggering effects
    const myUserIdRef = useRef<string | null>(null);
    const [myUserIdReady, setMyUserIdReady] = useState(false);

    const [draft, setDraft] = useState('');
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);
    const [newMessageToast, setNewMessageToast] = useState(false);

    const [mobileView, setMobileView] = useState<'list' | 'thread'>('list');

    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const prevMessageCountRef = useRef(0);

    // Fetch user ID once on mount so it's ready before messages render
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        getUserProfileAction(token).then((r) => {
            if (r.data) {
                myUserIdRef.current = r.data.id;
                setMyUserIdReady(true);
            }
        });
    }, []);

    const loadConversations = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }
        setLoadingConvs(true);
        setConvError(null);
        const result = await getConversationsAction(token);
        setLoadingConvs(false);
        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            setConvError(result.error.message);
            return;
        }
        setConversations(result.data ?? []);
    }, [router]);

    useEffect(() => { loadConversations(); }, [loadConversations]);

    const loadMessages = useCallback(async (convId: string) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        setLoadingMsgs(true);
        setMsgsError(null);
        const result = await getConversationMessagesAction(token, convId);
        setLoadingMsgs(false);
        if (result.error) {
            setMsgsError(result.error.message);
            return;
        }
        setMessages(result.data ?? []);
        // Mark as read once messages are loaded
        localStorage.setItem(`lastReadAt_${convId}`, new Date().toISOString());
    }, []);

    useEffect(() => {
        if (selectedId) loadMessages(selectedId);
    }, [selectedId, loadMessages]);

    // Poll conversation list every 15 s so new threads appear without a manual refresh
    useEffect(() => {
        const interval = setInterval(() => loadConversations(), 15000);
        return () => clearInterval(interval);
    }, [loadConversations]);

    useEffect(() => {
        const isNewMessage = messages.length > prevMessageCountRef.current && prevMessageCountRef.current > 0;
        prevMessageCountRef.current = messages.length;
        if (isNewMessage) {
            setNewMessageToast(true);
            setTimeout(() => setNewMessageToast(false), 3000);
        }
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        // Stamp as read so the header badge clears for this conversation
        localStorage.setItem(`lastReadAt_${id}`, new Date().toISOString());
        setMessages([]);
        setMsgsError(null);
        setSendError(null);
        setDraft('');
        setNewMessageToast(false);
        prevMessageCountRef.current = 0;
        setMobileView('thread');
    };

    const handleSend = async () => {
        if (!draft.trim() || !selectedId) return;
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        setSending(true);
        setSendError(null);
        const result = await sendMessageAction(token, selectedId, draft.trim());
        setSending(false);
        if (result.error) { setSendError(result.error.message); return; }
        const sent = draft.trim();
        setDraft('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.focus();
        }
        setConversations((prev) =>
            prev.map((c) =>
                c.id === selectedId
                    ? { ...c, last_message_preview: sent, last_message_at: new Date().toISOString() }
                    : c
            )
        );
        // Sender has obviously read the conversation
        localStorage.setItem(`lastReadAt_${selectedId}`, new Date().toISOString());
        await loadMessages(selectedId);
    };

    const selectedConv = conversations.find((c) => c.id === selectedId);

    function otherName(c: ConversationSummary) {
        return myUserIdRef.current === c.landlord_user_id ? c.student_name : c.landlord_name;
    }

    return (
        <div className="flex h-full min-h-0 w-full">

            {/* ── Thread list ── */}
            <div className={`${mobileView === 'thread' ? 'hidden' : 'flex'} md:flex w-full md:w-80 lg:w-96 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900`}>
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                    <h2 className="font-bold text-slate-900 dark:text-white">Conversations</h2>
                    <button
                        onClick={loadConversations}
                        disabled={loadingConvs}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
                    >
                        <span className={`material-symbols-outlined text-lg ${loadingConvs ? 'animate-spin' : ''}`}>refresh</span>
                    </button>
                </div>

                {loadingConvs ? (
                    <div className="flex items-center justify-center flex-1">
                        <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
                    </div>
                ) : convError ? (
                    <div className="flex flex-col items-center justify-center flex-1 gap-3 p-6 text-center">
                        <span className="material-symbols-outlined text-4xl text-red-300">error</span>
                        <p className="text-sm text-slate-500">{convError}</p>
                        <button onClick={loadConversations} className="text-xs text-primary hover:underline">Retry</button>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 gap-3 p-6 text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">chat</span>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No conversations yet</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                            Conversations open automatically when a student applies to a listing.
                        </p>
                    </div>
                ) : (
                    <ul className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {conversations.map((c) => (
                            <li key={c.id}>
                                <button
                                    onClick={() => handleSelect(c.id)}
                                    className={`w-full text-left px-4 py-4 flex gap-3 items-start transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                                        selectedId === c.id
                                            ? 'bg-primary/5 dark:bg-primary/10 border-l-2 border-primary'
                                            : 'border-l-2 border-transparent'
                                    }`}
                                >
                                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                        {otherName(c).slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1 mb-0.5">
                                            <p className="text-sm truncate font-semibold text-slate-800 dark:text-slate-200">
                                                {otherName(c)}
                                            </p>
                                            <p className="text-[10px] text-slate-400 shrink-0">{fmtTime(c.last_message_at)}</p>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.listing_address ?? 'Listing'}</p>
                                        {c.last_message_preview && (
                                            <p className="text-xs text-slate-400 truncate mt-0.5">{c.last_message_preview}</p>
                                        )}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* ── Message view ── */}
            <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} md:flex flex-1 flex-col min-w-0 bg-slate-50 dark:bg-slate-950/50`}>
                {!selectedId ? (
                    <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center p-8">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">forum</span>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-600 dark:text-slate-400">No conversation selected</p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Choose a thread from the list to start reading</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Conversation header */}
                        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3 shrink-0">
                            <button
                                onClick={() => setMobileView('list')}
                                className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                {selectedConv ? otherName(selectedConv).slice(0, 2).toUpperCase() : ''}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate">
                                    {selectedConv ? otherName(selectedConv) : ''}
                                </p>
                                <p className="text-xs text-slate-400 truncate">{selectedConv?.listing_address ?? 'Listing'}</p>
                            </div>
                            <button
                                onClick={() => loadMessages(selectedId)}
                                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Refresh"
                            >
                                <span className="material-symbols-outlined text-lg">refresh</span>
                            </button>
                        </div>

                        {/* New message toast */}
                        {newMessageToast && (
                            <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary text-xs font-medium rounded-lg border border-primary/20 animate-pulse">
                                <span className="material-symbols-outlined text-sm">mark_unread_chat_alt</span>
                                New message received
                            </div>
                        )}

                        {/* Message history */}
                        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-2">
                            {loadingMsgs ? (
                                <div className="flex items-center justify-center flex-1">
                                    <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
                                </div>
                            ) : msgsError ? (
                                <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
                                    <span className="material-symbols-outlined text-4xl text-red-300">error</span>
                                    <p className="text-sm text-slate-500">{msgsError}</p>
                                    <button onClick={() => loadMessages(selectedId)} className="text-xs text-primary hover:underline">Retry</button>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700">chat_bubble</span>
                                    <p className="text-sm text-slate-400">No messages yet — say hello!</p>
                                </div>
                            ) : (
                                <>
                                    {messages.map((m, i) => {
                                        const isMine = myUserIdRef.current !== null && m.sender_user_id === myUserIdRef.current;
                                        const showName = !isMine && (i === 0 || messages[i - 1].sender_user_id !== m.sender_user_id);
                                        return (
                                            <div key={m.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                                {showName && (
                                                    <p className="text-[10px] text-slate-400 px-1 mb-1">{m.sender_name}</p>
                                                )}
                                                <div className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                                                    isMine
                                                        ? 'bg-primary text-white rounded-br-none'
                                                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                                                }`}>
                                                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                                                    <p className={`text-[10px] mt-1 ${isMine ? 'text-white/60 text-right' : 'text-slate-400'}`}>
                                                        {fmtTime(m.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Compose box */}
                        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 shrink-0">
                            {sendError && (
                                <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">error</span>
                                    {sendError}
                                </p>
                            )}
                            <div className="flex items-end gap-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                <textarea
                                    ref={textareaRef}
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    onInput={(e) => {
                                        const t = e.currentTarget;
                                        t.style.height = 'auto';
                                        t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
                                    }}
                                    maxLength={2000}
                                    rows={2}
                                    placeholder="Type a message… (Enter to send)"
                                    className="flex-1 resize-none bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none overflow-y-auto"
                                    style={{ minHeight: '44px', maxHeight: '120px' }}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!draft.trim() || sending}
                                    className="shrink-0 w-9 h-9 rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors disabled:opacity-40 shadow-sm shadow-primary/20 mb-0.5"
                                >
                                    {sending ? (
                                        <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-base">send</span>
                                    )}
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1.5 px-1">Shift+Enter for new line</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
