/**
 * useTranslate — auto-translates dynamic text (e.g. plant descriptions)
 * from English to the current app language using the free Google Translate API.
 *
 * Usage:
 *   const translated = useTranslate(englishText);
 *   // returns translated string for current lang, falls back to englishText
 */

import { useState, useEffect, useRef } from 'react';
import { useLang } from './LanguageContext';

// In-memory cache: { "te:some text" -> "అనువదించిన వచనం" }
const cache = {};

// Google Translate free API (no key required for moderate use)
const TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';

async function translateText(text, targetLang) {
  if (!text || !text.trim()) return text;
  if (targetLang === 'en') return text;

  const cacheKey = `${targetLang}:${text}`;
  if (cache[cacheKey]) return cache[cacheKey];

  // Map app lang codes → Google lang codes
  const langMap = { te: 'te', hi: 'hi', en: 'en' };
  const tl = langMap[targetLang] || targetLang;

  try {
    const params = new URLSearchParams({
      client: 'gtx',
      sl: 'en',
      tl,
      dt: 't',
      q: text,
    });
    const res = await fetch(`${TRANSLATE_URL}?${params}`);
    if (!res.ok) throw new Error('translate failed');
    const json = await res.json();
    // Response structure: [[["translated","original",...],...],...]
    const translated = json[0]
      .filter(Boolean)
      .map((chunk) => chunk[0])
      .join('');
    cache[cacheKey] = translated;
    return translated;
  } catch {
    // Network error or rate-limit — return original English
    return text;
  }
}

export function useTranslate(text) {
  const { lang } = useLang();
  const [translated, setTranslated] = useState(text);
  const lastText = useRef(text);
  const lastLang = useRef(lang);

  useEffect(() => {
    // Reset immediately to English while fetching (avoids stale text flash)
    if (lastText.current !== text || lastLang.current !== lang) {
      lastText.current = text;
      lastLang.current = lang;
      setTranslated(text); // show English immediately
    }

    if (!text || lang === 'en') {
      setTranslated(text);
      return;
    }

    let cancelled = false;
    translateText(text, lang).then((result) => {
      if (!cancelled) setTranslated(result);
    });
    return () => { cancelled = true; };
  }, [text, lang]);

  return translated;
}
