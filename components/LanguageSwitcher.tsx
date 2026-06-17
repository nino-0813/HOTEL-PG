'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Globe } from 'lucide-react';

/**
 * Google翻訳ウィジェット（在地翻訳）を使った簡易な日英切り替え。
 * - 画面右上などに置いたボタンで JP <-> EN を切り替える
 * - 仕組み: googtrans クッキーをセットしてリロードすると、ウィジェットがその言語で再翻訳する
 */

declare global {
  interface Window {
    google?: { translate?: { TranslateElement?: unknown } };
    googleTranslateElementInit?: () => void;
  }
}

const COOKIE = 'googtrans';

/** googtrans クッキー or URLハッシュから現在の言語を判定（en へ翻訳中なら 'en'） */
function readLang(): 'ja' | 'en' {
  if (typeof document === 'undefined') return 'ja';
  const m = document.cookie.match(/googtrans=([^;]+)/);
  if (m && decodeURIComponent(m[1]).endsWith('/en')) return 'en';
  if (typeof window !== 'undefined' && /googtrans\(.*\/en\)/i.test(window.location.hash)) return 'en';
  return 'ja';
}

/** 対象ホストから、考えられる cookie ドメイン候補をすべて列挙（親ドメイン含む） */
function domainVariants(): string[] {
  const host = window.location.hostname;
  const variants = new Set<string>(['']); // ドメイン指定なし（ホスト限定）
  variants.add(host);
  variants.add(`.${host}`);
  const parts = host.split('.');
  // a.b.example.com -> .b.example.com, .example.com など親ドメインも対象
  for (let i = 1; i < parts.length - 1; i++) {
    variants.add(`.${parts.slice(i).join('.')}`);
  }
  return Array.from(variants);
}

/** googtrans クッキーをセット/削除（翻訳ウィジェットが確実に拾える/消えるように全ドメイン階層へ） */
function setGoogtrans(value: string | null) {
  const base = `${COOKIE}=`;
  for (const d of domainVariants()) {
    const domainPart = d ? `;domain=${d}` : '';
    if (value === null) {
      document.cookie = `${base};expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/${domainPart}`;
    } else {
      document.cookie = `${base}${value};path=/${domainPart}`;
    }
  }
}

let scriptInjected = false;

function injectWidget() {
  if (scriptInjected || typeof document === 'undefined') return;
  scriptInjected = true;

  // ウィジェットのマウント先（非表示）
  if (!document.getElementById('google_translate_element')) {
    const el = document.createElement('div');
    el.id = 'google_translate_element';
    el.style.display = 'none';
    document.body.appendChild(el);
  }

  window.googleTranslateElementInit = () => {
    const g = window.google as unknown as {
      translate?: { TranslateElement?: new (opts: object, el: string) => void };
    };
    if (g?.translate?.TranslateElement) {
      new g.translate.TranslateElement(
        { pageLanguage: 'ja', includedLanguages: 'en,ja', autoDisplay: false },
        'google_translate_element',
      );
    }
  };

  const s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  document.body.appendChild(s);
}

type Props = {
  className?: string;
};

const LanguageSwitcher: React.FC<Props> = ({ className = '' }) => {
  const [lang, setLang] = useState<'ja' | 'en'>('ja');

  useEffect(() => {
    setLang(readLang());
    injectWidget();
  }, []);

  const toggle = useCallback(() => {
    // 既存クッキーを全ドメイン階層で確実に削除してから、必要なら再セット
    setGoogtrans(null);

    if (lang === 'ja') {
      // 日本語 → 英語
      setGoogtrans('/ja/en');
    }
    // 英語 → 日本語はクッキー削除のみ（翻訳を完全解除し、元のサイトに戻す）

    setLang(lang === 'ja' ? 'en' : 'ja');

    // 翻訳状態を保持する #googtrans ハッシュも除去してクリーンに再読込
    if (/googtrans/i.test(window.location.hash)) {
      window.location.href = window.location.pathname + window.location.search;
    } else {
      window.location.reload();
    }
  }, [lang]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === 'ja' ? 'Switch to English' : '日本語に切り替え'}
      className={`inline-flex items-center gap-1.5 ${className}`}
      // 翻訳対象から除外（ボタン自身は翻訳しない）
      translate="no"
    >
      <Globe size={15} strokeWidth={1.75} className="shrink-0" />
      <span className="font-display text-[12px] tracking-[0.12em] leading-none">
        {lang === 'ja' ? 'EN' : '日本語'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
