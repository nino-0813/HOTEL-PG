'use client';

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import type { BlogPost, SectionContent } from '../types';
import { BLOG_POSTS, CONTENT } from '../constants';
import * as cmsSupabase from '../lib/cms-supabase';

const CMS_STORAGE_KEY = 'hotel-pg-cms';

export type CmsContent = {
  concept: SectionContent;
  rooms: SectionContent;
  dining: SectionContent;
  activity: SectionContent;
};

type CmsPayload = {
  blogPosts: BlogPost[];
  content: CmsContent;
};

function loadFromStorage(): CmsPayload | null {
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CmsPayload>;
    if (parsed.blogPosts == null && parsed.content == null) return null;
    return {
      blogPosts: normalizeBlogPosts(parsed.blogPosts),
      content: normalizeContent(parsed.content),
    };
  } catch {
    return null;
  }
}

function writeToStorage(p: CmsPayload): void {
  try {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

const defaultPayload: CmsPayload = {
  blogPosts: BLOG_POSTS,
  content: CONTENT,
};

/** localStorage / 部分的な保存でもトップがクラッシュしないよう、欠損キーは constants の CONTENT で埋める */
function normalizeContent(raw: Partial<CmsContent> | null | undefined): CmsContent {
  return {
    concept: raw?.concept ?? CONTENT.concept,
    rooms: raw?.rooms ?? CONTENT.rooms,
    dining: raw?.dining ?? CONTENT.dining,
    activity: raw?.activity ?? CONTENT.activity,
  };
}

function normalizeBlogPosts(posts: unknown): BlogPost[] {
  return Array.isArray(posts) ? posts : BLOG_POSTS;
}

type CmsPayloadPartial = Partial<{ blogPosts: BlogPost[]; content: CmsContent }>;
type CmsContextValue = {
  blogPosts: BlogPost[];
  content: CmsContent;
  setBlogPosts: (posts: BlogPost[] | ((prev: BlogPost[]) => BlogPost[])) => void;
  setContent: (content: CmsContent | ((prev: CmsContent) => CmsContent)) => void;
  save: (override?: CmsPayloadPartial) => Promise<void>;
  load: () => Promise<void>;
  isSupabaseConfigured: boolean;
  isInitialLoading: boolean;
  saveError: string | null;
};

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<CmsPayload>(defaultPayload);
  const [isInitialLoading, setIsInitialLoading] = useState(cmsSupabase.isSupabaseConfigured());
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (cmsSupabase.isSupabaseConfigured()) {
      setIsInitialLoading(true);
      const remote = await cmsSupabase.fetchAll();
      setIsInitialLoading(false);
      if (remote) {
        const content = normalizeContent({
          concept: remote.concept,
          rooms: remote.rooms,
          dining: remote.dining,
          activity: remote.activity,
        });
        const blogPosts = normalizeBlogPosts(remote.blog_posts);
        setPayload({ blogPosts, content });
        writeToStorage({ blogPosts, content });
        return;
      }
    }
    setPayload(loadFromStorage() ?? defaultPayload);
  }, []);

  useEffect(() => {
    if (cmsSupabase.isSupabaseConfigured()) {
      let cancelled = false;
      (async () => {
        const remote = await cmsSupabase.fetchAll();
        if (cancelled) return;
        setIsInitialLoading(false);
        if (remote) {
          const content = normalizeContent({
            concept: remote.concept,
            rooms: remote.rooms,
            dining: remote.dining,
            activity: remote.activity,
          });
          const blogPosts = normalizeBlogPosts(remote.blog_posts);
          setPayload({ blogPosts, content });
          writeToStorage({ blogPosts, content });
        } else {
          setPayload(loadFromStorage() ?? defaultPayload);
        }
      })();
      return () => { cancelled = true; };
    } else {
      setPayload(loadFromStorage() ?? defaultPayload);
      setIsInitialLoading(false);
    }
  }, []);

  const save = useCallback(async (override?: Partial<CmsPayload>) => {
    setSaveError(null);
    const toSave: CmsPayload = override
      ? { blogPosts: override.blogPosts ?? payload.blogPosts, content: override.content ?? payload.content }
      : payload;
    if (cmsSupabase.isSupabaseConfigured()) {
      const okPosts = await cmsSupabase.saveBlogPosts(toSave.blogPosts);
      const okContent = await cmsSupabase.saveContent(toSave.content);
      if (!okPosts || !okContent) {
        setSaveError('Supabase への保存に失敗しました。');
        return;
      }
    }
    writeToStorage(toSave);
  }, [payload]);

  const setBlogPosts = useCallback((updater: BlogPost[] | ((prev: BlogPost[]) => BlogPost[])) => {
    setPayload((p) => ({
      ...p,
      blogPosts: typeof updater === 'function' ? updater(p.blogPosts) : updater,
    }));
  }, []);

  const setContent = useCallback((updater: CmsContent | ((prev: CmsContent) => CmsContent)) => {
    setPayload((p) => ({
      ...p,
      content: typeof updater === 'function' ? updater(p.content) : updater,
    }));
  }, []);

  const value = useMemo<CmsContextValue>(
    () => ({
      blogPosts: payload.blogPosts,
      content: payload.content,
      setBlogPosts,
      setContent,
      save,
      load,
      isSupabaseConfigured: cmsSupabase.isSupabaseConfigured(),
      isInitialLoading,
      saveError,
    }),
    [payload.blogPosts, payload.content, setBlogPosts, setContent, save, load, isInitialLoading, saveError]
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used within CmsProvider');
  return ctx;
}
