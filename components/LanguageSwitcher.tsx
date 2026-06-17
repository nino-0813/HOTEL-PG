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

/** クッキーを現在ホストと、ドット付きドメイン両方にセット/削除（翻訳ウィジェットが拾えるように） */
function setGoogtrans(value: string | null) {
  const host = window.location.hostname;
  const domains = ['', host, `.${host}`];
  for (const d of domains) {
    const base = `${COOKIE}=`;
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
    if (lang === 'en') {
      // 英語 → 日本語: 翻訳を完全に解除して“元のサイト（英語見出し混在のオリジナル）”に戻す。
      //  combo を 'ja' にすると元々英語だった見出しまで翻訳されてしまうため、必ずリセット(再描画)する。
      setGoogtrans(null);
      setLang('ja');
      const clean = window.location.pathname + window.location.search;
      if (window.location.hash) {
        window.location.href = clean; // #googtrans 等を除去してクリーンに再読込
      } else {
        window.location.reload();
      }
      return;
    }

    // 日本語 → 英語: クッキー同期 ＋ ウィジェットの combo をその場で切替（即時反映）
    setGoogtrans('/ja/en');
    setLang('en');

    const applyEnViaCombo = (): boolean => {
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (!combo) return false;
      combo.value = 'en';
      combo.dispatchEvent(new Event('change'));
      return true;
    };

    if (applyEnViaCombo()) return;

    // ウィジェット初期化前なら少し待ってリトライ。それでも無理ならリロードでクッキー反映
    let tries = 0;
    const iv = window.setInterval(() => {
      tries += 1;
      if (applyEnViaCombo() || tries > 25) {
        window.clearInterval(iv);
        if (tries > 25) window.location.reload();
      }
    }, 120);
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
