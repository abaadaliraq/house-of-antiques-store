'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { StoreLang } from '../../lib/storeCategories'

type PolicyLangBlock = {
  lang: StoreLang
  label: string
  note?: string
  content: React.ReactNode
}

type PolicyPageProps = {
  title: string
  meta: string
  updatedAt: string
  intro: string
  blocks: PolicyLangBlock[]
}

export default function PolicyPage({
  title,
  meta,
  updatedAt,
  intro,
  blocks,
}: PolicyPageProps) {
  const [lang, setLang] = useState<StoreLang>('ar')

  useEffect(() => {
    const savedLang = localStorage.getItem('store_lang') as StoreLang | null
    if (savedLang === 'ar' || savedLang === 'en' || savedLang === 'ku') {
      setLang(savedLang)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl'
    document.documentElement.lang = lang === 'ku' ? 'ku' : lang
    localStorage.setItem('store_lang', lang)
  }, [lang])

  const activeBlock = useMemo(() => {
    return blocks.find((block) => block.lang === lang) ?? blocks[0]
  }, [blocks, lang])

  const backLabel =
    lang === 'ar'
      ? 'الرجوع للمتجر'
      : lang === 'ku'
      ? 'گەڕانەوە بۆ فرۆشگا'
      : 'Back to store'

  const termsLabel =
    lang === 'ar'
      ? 'الشروط'
      : lang === 'ku'
      ? 'مەرجەکان'
      : 'Terms'

  const privacyLabel =
    lang === 'ar'
      ? 'الخصوصية'
      : lang === 'ku'
      ? 'تایبەتمەندی'
      : 'Privacy'

  const shippingLabel =
    lang === 'ar'
      ? 'الشحن'
      : lang === 'ku'
      ? 'ناردن'
      : 'Shipping'

  const returnsLabel =
    lang === 'ar'
      ? 'الاسترجاع'
      : lang === 'ku'
      ? 'گەڕاندنەوە'
      : 'Returns'

  const updatedLabel =
    lang === 'ar'
      ? 'آخر تحديث'
      : lang === 'ku'
      ? 'دوایین نوێکردنەوە'
      : 'Last updated'

  return (
    <main
      className="policy-page"
      dir={lang === 'en' ? 'ltr' : 'rtl'}
    >
      <div className="policy-wrap">
        <div className="policy-top">
          <div className="policy-brand">
            <img
              src="/logo.png"
              alt="House of Antiques"
              className="policy-brand__logo"
            />

            <div className="policy-brand__content">
              <h1 className="policy-title">{title}</h1>
              <div className="policy-meta">{meta}</div>
              <div className="policy-small">
                {updatedLabel}: {updatedAt}
              </div>
            </div>
          </div>

          <div className="policy-top__side">
            <div className="policy-langSwitch">
              <select
                className="policy-langSelect"
                value={lang}
                onChange={(e) => setLang(e.target.value as StoreLang)}
                aria-label="Language"
              >
                <option value="ar">AR</option>
                <option value="en">EN</option>
                <option value="ku">KU</option>
              </select>
            </div>

            <div className="policy-actions">
              <Link href="/" className="policy-btn">
                ↩ {backLabel}
              </Link>
              <Link href="/terms" className="policy-btn">
                {termsLabel}
              </Link>
              <Link href="/privacy" className="policy-btn">
                {privacyLabel}
              </Link>
              <Link href="/shipping" className="policy-btn">
                {shippingLabel}
              </Link>
              <Link href="/returns" className="policy-btn">
                {returnsLabel}
              </Link>
            </div>
          </div>
        </div>

        <section className="policy-card">
          <p className="policy-intro">{intro}</p>

          <section className={`policy-block policy-block--${activeBlock.lang}`}>
            <div className="policy-block__head">
              <span className="policy-tag">{activeBlock.label}</span>
              {activeBlock.note ? (
                <span className="policy-note">{activeBlock.note}</span>
              ) : null}
            </div>

            <div className="policy-content">
              {activeBlock.content}
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}