'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { Lang } from './i18n'
import { t as translate, type TranslationKey } from './i18n'

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey) => string
  isRTL: boolean
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
  isRTL: false,
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('rebat_lang') as Lang | null
    if (saved) setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('rebat_lang', l)
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = l
  }

  const value: LangContextValue = {
    lang,
    setLang,
    t: (key: TranslationKey) => translate(key, lang),
    isRTL: lang === 'ar',
  }

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
