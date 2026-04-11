'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Eye, EyeOff, ChevronRight, ChevronLeft } from 'lucide-react'
import { formatPrice } from '../../../lib/format'
import { addToCart, getCartCount } from '../../../lib/cart'
import styles from './ProductPage.module.css'

type StoreLang = 'ar' | 'en' | 'ku'

type ProductRow = {
  id: string
  slug: string
  sku: string | null

  name_ar: string | null
  name_en: string | null
  name_ku: string | null

  description_ar: string | null
  description_en: string | null
  description_ku: string | null

  price_amount: number
  currency_code: string

  featured_image: string | null

  is_sensitive: boolean | null
  is_auction: boolean | null

  status: string | null
  is_available: boolean | null

  artist_name: string | null
  year_text: string | null

  material_ar: string | null
  material_en: string | null
  material_ku: string | null

  condition_ar: string | null
  condition_en: string | null
  condition_ku: string | null

  dimensions_ar: string | null
  dimensions_en: string | null
  dimensions_ku: string | null

  period_ar: string | null
  period_en: string | null
  period_ku: string | null

  origin_country: string | null
  signed: boolean | null

  category_slug: string | null
}

type ProductImageRow = {
  image_url: string
  alt_ar: string | null
  alt_en: string | null
  alt_ku: string | null
  sort_order: number
}

type SimilarProductRow = {
  id: string
  slug: string
  featured_image: string | null
  name_ar: string | null
  name_en: string | null
  name_ku: string | null
  price_amount: number
  currency_code: string
  sku: string | null
  is_sensitive?: boolean | null
}

type ProductNavItem = {
  id: string
  slug: string
  name_ar: string | null
  name_en: string | null
  name_ku: string | null
  featured_image: string | null
  status: string | null
  is_available: boolean | null
}

type Props = {
  product: ProductRow
  gallery: ProductImageRow[]
  closeMatches: SimilarProductRow[]
  styleMatches: SimilarProductRow[]
  extendedMatches: SimilarProductRow[]
  prevProduct?: ProductNavItem | null
  nextProduct?: ProductNavItem | null
}

const FAVORITES_KEY = 'hoa_favorites_v1'
const LANG_KEY = 'store_lang'

function pickLang(
  ar?: string | null,
  en?: string | null,
  ku?: string | null,
  lang: StoreLang = 'ar'
) {
  if (lang === 'ar') return ar || en || ku || ''
  if (lang === 'ku') return ku || ar || en || ''
  return en || ar || ku || ''
}

function getFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveFavoriteIds(ids: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
}

function formatCategory(category?: string | null) {
  if (!category) return 'Collection'
  return category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

function getCategoryLabel(categorySlug?: string | null, lang: StoreLang = 'ar') {
  const labels: Record<string, { ar: string; en: string; ku: string }> = {
    paintings: { ar: 'لوحات', en: 'Paintings', ku: 'تابلۆ' },
    artworks: { ar: 'أعمال فنية', en: 'Artworks', ku: 'کارە هونەرییەکان' },
    accessories: { ar: 'إكسسوارات', en: 'Accessories', ku: 'ئاکسسوارات' },
    copper: { ar: 'نحاس', en: 'Copper', ku: 'مس' },
    silver: { ar: 'فضة', en: 'Silver', ku: 'زیو' },
    crystal: { ar: 'كريستال', en: 'Crystal', ku: 'کریستاڵ' },
    wood: { ar: 'خشب', en: 'Wood', ku: 'دار' },
    carpets: { ar: 'سجاد', en: 'Carpets', ku: 'قالی' },
    furniture: { ar: 'أثاث', en: 'Furniture', ku: 'کەلوپەل' },
    vases: { ar: 'فازات', en: 'Vases', ku: 'گوڵدان' },
  }

  if (!categorySlug) {
    return lang === 'ar' ? 'المجموعة' : lang === 'ku' ? 'کۆمەڵە' : 'Collection'
  }

  return labels[categorySlug]?.[lang] || formatCategory(categorySlug)
}

function getStatusLabel(
  status?: string | null,
  isAvailable?: boolean | null,
  lang: StoreLang = 'ar'
) {
  if (status === 'sold' || isAvailable === false) {
    return lang === 'ar' ? 'مباعة' : lang === 'ku' ? 'فرۆشراو' : 'Sold'
  }

  if (status === 'reserved') {
    return lang === 'ar' ? 'محجوزة' : lang === 'ku' ? 'حەجزکراو' : 'Reserved'
  }

  return lang === 'ar' ? 'متوفرة' : lang === 'ku' ? 'بەردەستە' : 'Available'
}

export default function ProductDetailClient({
  product,
  gallery,
  closeMatches,
  styleMatches,
  extendedMatches,
  prevProduct,
  nextProduct,
}: Props) {
  const router = useRouter()

  const [lang, setLang] = useState<StoreLang>('ar')
  const [activeIndex, setActiveIndex] = useState(0)
  const [favorite, setFavorite] = useState(false)
  const [copied, setCopied] = useState(false)
  const [cartAdded, setCartAdded] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [showSensitive, setShowSensitive] = useState(false)

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANG_KEY) as StoreLang | null
      if (savedLang === 'ar' || savedLang === 'en' || savedLang === 'ku') {
        setLang(savedLang)
      }
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl'
  }, [lang])

  const t = useMemo(
    () => ({
      back: lang === 'ar' ? 'رجوع' : lang === 'ku' ? 'گەڕانەوە' : 'Back',
      cart: lang === 'ar' ? 'السلة' : lang === 'ku' ? 'سەبەتە' : 'Cart',
      favorite: lang === 'ar' ? 'مفضلة' : lang === 'ku' ? 'دڵخوازە' : 'Favorite',
      addToFavorites:
        lang === 'ar'
          ? 'أضف للمفضلة'
          : lang === 'ku'
          ? 'زیادکردن بۆ دڵخوازەکان'
          : 'Add to favorites',
      copyLink:
        lang === 'ar'
          ? 'نسخ الرابط'
          : lang === 'ku'
          ? 'لەینک کۆپی بکە'
          : 'Copy link',
      noDescription:
        lang === 'ar'
          ? 'لا يوجد وصف حالياً.'
          : lang === 'ku'
          ? 'وەسف نییە.'
          : 'No description available.',
      sold: lang === 'ar' ? 'تم البيع' : lang === 'ku' ? 'فرۆشرا' : 'Sold',
      addToCart:
        lang === 'ar'
          ? 'أضف إلى السلة'
          : lang === 'ku'
          ? 'زیادکردن بۆ سەبەتە'
          : 'Add to cart',
      code: lang === 'ar' ? 'الكود' : lang === 'ku' ? 'کۆد' : 'Code',
      artist: lang === 'ar' ? 'الفنان' : lang === 'ku' ? 'هونەرمەند' : 'Artist',
      year: lang === 'ar' ? 'السنة' : lang === 'ku' ? 'ساڵ' : 'Year',
      dimensions: lang === 'ar' ? 'الأبعاد' : lang === 'ku' ? 'قەبارە' : 'Dimensions',
      material: lang === 'ar' ? 'الخامة' : lang === 'ku' ? 'ماددە' : 'Material',
      condition: lang === 'ar' ? 'الحالة' : lang === 'ku' ? 'دۆخ' : 'Condition',
      sensitiveLabel:
        lang === 'ar'
          ? 'محتوى حساس'
          : lang === 'ku'
          ? 'ناوەڕۆکی هەستیار'
          : 'Sensitive Content',
      hiddenPreview:
        lang === 'ar'
          ? 'معاينة مخفية'
          : lang === 'ku'
          ? 'پێشبینینی شاردراو'
          : 'Hidden Preview',
      explicitText:
        lang === 'ar'
          ? 'هذا العمل يحتوي على محتوى بصري صريح.'
          : lang === 'ku'
          ? 'ئەم کارە ناوەڕۆکی بینراوی هەستیاری تێدایە.'
          : 'This artwork contains explicit visual content.',
      reveal:
        lang === 'ar'
          ? 'إظهار المحتوى'
          : lang === 'ku'
          ? 'پیشاندانی ناوەڕۆک'
          : 'Reveal Content',
      similar:
        lang === 'ar' ? 'قطع مشابهة' : lang === 'ku' ? 'پارچەی هاوشێوە' : 'Similar pieces',
      similarSub:
        lang === 'ar'
          ? 'الأقرب لهذه القطعة من نفس الطابع أو النوع أو الخامة.'
          : lang === 'ku'
          ? 'نزیکترین پارچەکان لەم کارە لە هەمان شێواز یان جۆر یان ماددە.'
          : 'The closest pieces by style, type, or material.',
      sameMood:
        lang === 'ar'
          ? 'من نفس الجو العام'
          : lang === 'ku'
          ? 'لە هەمان هەواودا'
          : 'Same overall mood',
      sameMoodSub:
        lang === 'ar'
          ? 'قطع قريبة من الأسلوب بدون ما تكون نسخة مباشرة.'
          : lang === 'ku'
          ? 'پارچەی نزیک لە شێوازدا بەبێ ئەوەی وەک یەک بن.'
          : 'Pieces with a similar spirit, not direct duplicates.',
      extended:
        lang === 'ar'
          ? 'استكشاف ممتد'
          : lang === 'ku'
          ? 'گەڕانێکی فراوانتر'
          : 'Extended exploration',
      extendedSub:
        lang === 'ar'
          ? 'استمر بالتصفح داخل نفس الطابع العام للقطع.'
          : lang === 'ku'
          ? 'بەردەوام بە لە گەڕان لە هەمان کەشی گشتی پارچەکان.'
          : 'Keep browsing within the same general atmosphere.',
      noSimilar:
        lang === 'ar'
          ? 'لا توجد قطع مشابهة حالياً'
          : lang === 'ku'
          ? 'هێشتا پارچەی هاوشێوە نییە'
          : 'No similar pieces at the moment.',
      linkCopied:
        lang === 'ar'
          ? 'تم نسخ الرابط'
          : lang === 'ku'
          ? 'لەینکەکە کۆپی کرا'
          : 'Link copied',
      addedToCart:
        lang === 'ar'
          ? 'تمت الإضافة إلى السلة'
          : lang === 'ku'
          ? 'خرایە سەبەتەکە'
          : 'Added to cart',
      sensitiveShort:
        lang === 'ar'
          ? 'محتوى حساس'
          : lang === 'ku'
          ? 'ناوەڕۆکی هەستیار'
          : 'Sensitive content',
      image:
        lang === 'ar' ? 'صورة' : lang === 'ku' ? 'وێنە' : 'Image',
      previous:
        lang === 'ar' ? 'السابق' : lang === 'ku' ? 'پێشوو' : 'Previous',
      next:
        lang === 'ar' ? 'التالي' : lang === 'ku' ? 'داهاتوو' : 'Next',
    }),
    [lang]
  )

  const title = pickLang(product.name_ar, product.name_en, product.name_ku, lang)

  const description = pickLang(
    product.description_ar,
    product.description_en,
    product.description_ku,
    lang
  )

  const categoryName = useMemo(() => {
    return getCategoryLabel(product.category_slug, lang)
  }, [product.category_slug, lang])

  const detailsList = useMemo(
    () => [
      { label: t.code, value: product.sku || '—' },
      { label: t.artist, value: product.artist_name || '—' },
      { label: t.year, value: product.year_text || '—' },
      {
        label: t.dimensions,
        value:
          pickLang(
            product.dimensions_ar,
            product.dimensions_en,
            product.dimensions_ku,
            lang
          ) || '—',
      },
      {
        label: t.material,
        value:
          pickLang(
            product.material_ar,
            product.material_en,
            product.material_ku,
            lang
          ) || '—',
      },
      {
        label: t.condition,
        value:
          pickLang(
            product.condition_ar,
            product.condition_en,
            product.condition_ku,
            lang
          ) || '—',
      },
    ],
    [product, lang, t]
  )

  const currentImage =
    gallery[activeIndex]?.image_url ||
    product.featured_image ||
    'https://placehold.co/1200x1200?text=House+of+Antiques'

  const isSensitive = product.is_sensitive === true
  const isSold = product.status === 'sold' || product.is_available === false
  const statusLabel = getStatusLabel(product.status, product.is_available, lang)

  useEffect(() => {
    const ids = getFavoriteIds()
    setFavorite(ids.includes(product.id))
  }, [product.id])

  useEffect(() => {
    const refreshCart = () => setCartCount(getCartCount())

    refreshCart()
    window.addEventListener('hoa-cart-updated', refreshCart as EventListener)

    return () => {
      window.removeEventListener('hoa-cart-updated', refreshCart as EventListener)
    }
  }, [])

  function handleFavorite() {
    const ids = getFavoriteIds()
    let next: string[]

    if (ids.includes(product.id)) {
      next = ids.filter((id) => id !== product.id)
      setFavorite(false)
    } else {
      next = [...ids, product.id]
      setFavorite(true)
    }

    saveFavoriteIds(next)
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {}
  }

  function handleAddToCart() {
    if (isSold) return

    addToCart({
      id: product.id,
      slug: product.slug,
      sku: product.sku || null,
      name: title,
      image: currentImage,
      price: Number(product.price_amount || 0),
      currency: product.currency_code || 'USD',
      qty: 1,
    })

    setCartAdded(true)
    window.setTimeout(() => setCartAdded(false), 1600)
  }

  function handleBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }
    router.push('/')
  }

  const prevTitle = prevProduct
    ? pickLang(prevProduct.name_ar, prevProduct.name_en, prevProduct.name_ku, lang)
    : ''

  const nextTitle = nextProduct
    ? pickLang(nextProduct.name_ar, nextProduct.name_en, nextProduct.name_ku, lang)
    : ''

  return (
    <main className={styles.page} dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className={styles.wrap}>
        <div className={`${styles.productTopbar} ${styles.fadeUp}`}>
          <button
            type="button"
            className={styles.topbarBack}
            onClick={handleBack}
            aria-label={t.back}
            title={t.back}
          >
            ←
          </button>

          <div className={styles.topbarCenter}>
            <span className={styles.topbarLabel}>{categoryName}</span>
          </div>

          <div className={styles.topbarActions}>
            <Link
              href="/cart"
              className={styles.topbarCart}
              aria-label={t.cart}
              title={t.cart}
              id="store-cart-button"
            >
              <ShoppingBag size={17} />
              {cartCount > 0 ? (
                <span className={styles.topbarCartCount}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              className={
                favorite
                  ? `${styles.topbarFav} ${styles.topbarFavActive}`
                  : styles.topbarFav
              }
              onClick={handleFavorite}
              aria-label={t.favorite}
              title={t.addToFavorites}
            >
              ♥
            </button>
          </div>
        </div>

        <section className={styles.productLayout}>
          <div className={styles.viewerCol}>
            <div className={styles.viewerFrame}>
              <div className={styles.imageWrapper}>
                <img
                  src={currentImage}
                  alt={title}
                  className={`${styles.mainImage} ${
                    isSensitive && !showSensitive ? styles.blurImage : ''
                  }`}
                />

                {isSensitive && !showSensitive ? (
                  <div className={styles.sensitiveOverlay}>
                    <div className={styles.sensitiveBox}>
                      <div className={styles.sensitiveIconWrap}>
                        <EyeOff size={22} />
                      </div>

                      <div className={styles.sensitiveEyebrow}>{t.sensitiveLabel}</div>
                      <div className={styles.sensitiveTitle}>{t.hiddenPreview}</div>

                      <p className={styles.sensitiveText}>{t.explicitText}</p>

                      <button
                        type="button"
                        className={styles.sensitiveBtn}
                        onClick={() => setShowSensitive(true)}
                      >
                        <Eye size={16} />
                        {t.reveal}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {(prevProduct || nextProduct) ? (
              <div className={styles.productNavArrows}>
                {nextProduct ? (
                  <Link
                    href={`/product/${nextProduct.slug}`}
                    className={styles.productNavArrow}
                    aria-label={t.next}
                    title={nextTitle}
                  >
                    <ChevronRight size={18} />
                    <span className={styles.productNavText}>{nextTitle}</span>
                  </Link>
                ) : (
                  <div />
                )}

                {prevProduct ? (
                  <Link
                    href={`/product/${prevProduct.slug}`}
                    className={styles.productNavArrow}
                    aria-label={t.previous}
                    title={prevTitle}
                  >
                    <span className={styles.productNavText}>{prevTitle}</span>
                    <ChevronLeft size={18} />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            ) : null}

            {gallery.length > 1 ? (
              <div className={styles.thumbRail}>
                {gallery.map((item, index) => {
                  const alt =
                    pickLang(item.alt_ar, item.alt_en, item.alt_ku, lang) ||
                    `${t.image} ${index + 1}`

                  return (
                    <button
                      key={`${item.image_url}-${index}`}
                      type="button"
                      className={
                        activeIndex === index
                          ? `${styles.thumbBtn} ${styles.thumbBtnActive}`
                          : styles.thumbBtn
                      }
                      onClick={() => setActiveIndex(index)}
                      aria-label={`${t.image} ${index + 1}`}
                    >
                      <img
                        src={item.image_url}
                        alt={alt}
                        className={`${styles.thumbImage} ${
                          isSensitive && !showSensitive ? styles.blurThumbImage : ''
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
            ) : null}

            <div className={`${styles.descriptionBox} ${styles.fadeUp} ${styles.delay1}`}>
              <p className={styles.descriptionText}>{description || t.noDescription}</p>
            </div>
          </div>

          <div className={styles.infoCol}>
            <div className={styles.topActions}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={handleCopyLink}
                aria-label={t.copyLink}
                title={t.copyLink}
              >
                ⧉
              </button>
            </div>

            <div className={`${styles.titleBlock} ${styles.fadeUp} ${styles.delay1}`}>
              <h1 className={styles.title}>{title}</h1>

              <div className={styles.metaLine}>
                <span>{statusLabel}</span>
                <span>•</span>
                <span>{product.sku || '—'}</span>

                {isSensitive ? (
                  <>
                    <span>•</span>
                    <span>{t.sensitiveShort}</span>
                  </>
                ) : null}
              </div>
            </div>

            <div className={`${styles.priceRow} ${styles.fadeUp} ${styles.delay2}`}>
              <div className={styles.pricePill}>
                {formatPrice(product.price_amount, product.currency_code || 'USD')}
              </div>
            </div>

            <div className={`${styles.ctaRow} ${styles.fadeUp} ${styles.delay3}`}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleAddToCart}
                disabled={isSold}
              >
                {isSold ? t.sold : t.addToCart}
              </button>
            </div>

            <div className={`${styles.detailsGrid} ${styles.fadeUp} ${styles.delay4}`}>
              {detailsList.map((item) => (
                <div key={item.label} className={styles.detailItem}>
                  <span className={styles.detailLabel}>{item.label}</span>
                  <span className={styles.detailValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.similarSection} ${styles.fadeUp} ${styles.delay4}`}>
          <div className={styles.similarHead}>
            <h2 className={styles.similarTitle}>{t.similar}</h2>
            <p className={styles.similarSubtitle}>{t.similarSub}</p>
          </div>

          {closeMatches.length === 0 ? (
            <div className={styles.empty}>{t.noSimilar}</div>
          ) : (
            <div className={styles.similarGrid}>
              {closeMatches.map((item) => {
                const itemTitle = pickLang(
                  item.name_ar,
                  item.name_en,
                  item.name_ku,
                  lang
                )
                const itemSensitive = item.is_sensitive === true

                return (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    className={styles.similarCard}
                  >
                    <div className={styles.similarImageWrap}>
                      <div className={styles.similarImageBox}>
                        <img
                          src={
                            item.featured_image ||
                            'https://placehold.co/800x1000?text=House+of+Antiques'
                          }
                          alt={itemTitle}
                          className={`${styles.similarImage} ${
                            itemSensitive ? styles.blurSimilarImage : ''
                          }`}
                        />

                        {itemSensitive ? (
                          <div className={styles.similarSensitiveOverlay}>
                            <span className={styles.similarSensitiveLabel}>
                              {t.sensitiveShort}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className={styles.similarBody}>
                      <div className={styles.similarName}>{itemTitle}</div>
                      <div className={styles.similarPrice}>
                        {formatPrice(item.price_amount, item.currency_code || 'USD')}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        <section className={`${styles.similarSection} ${styles.fadeUp} ${styles.delay4}`}>
          <div className={styles.similarHead}>
            <h2 className={styles.similarTitle}>{t.sameMood}</h2>
            <p className={styles.similarSubtitle}>{t.sameMoodSub}</p>
          </div>

          {styleMatches.length === 0 ? null : (
            <div className={styles.similarGrid}>
              {styleMatches.map((item) => {
                const itemTitle = pickLang(
                  item.name_ar,
                  item.name_en,
                  item.name_ku,
                  lang
                )
                const itemSensitive = item.is_sensitive === true

                return (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    className={styles.similarCard}
                  >
                    <div className={styles.similarImageWrap}>
                      <div className={styles.similarImageBox}>
                        <img
                          src={
                            item.featured_image ||
                            'https://placehold.co/800x1000?text=House+of+Antiques'
                          }
                          alt={itemTitle}
                          className={`${styles.similarImage} ${
                            itemSensitive ? styles.blurSimilarImage : ''
                          }`}
                        />

                        {itemSensitive ? (
                          <div className={styles.similarSensitiveOverlay}>
                            <span className={styles.similarSensitiveLabel}>
                              {t.sensitiveShort}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className={styles.similarBody}>
                      <div className={styles.similarName}>{itemTitle}</div>
                      <div className={styles.similarPrice}>
                        {formatPrice(item.price_amount, item.currency_code || 'USD')}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        <section className={`${styles.similarSection} ${styles.fadeUp} ${styles.delay4}`}>
          <div className={styles.similarHead}>
            <h2 className={styles.similarTitle}>{t.extended}</h2>
            <p className={styles.similarSubtitle}>{t.extendedSub}</p>
          </div>

          {extendedMatches.length === 0 ? null : (
            <div className={styles.similarGrid}>
              {extendedMatches.map((item) => {
                const itemTitle = pickLang(
                  item.name_ar,
                  item.name_en,
                  item.name_ku,
                  lang
                )
                const itemSensitive = item.is_sensitive === true

                return (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    className={styles.similarCard}
                  >
                    <div className={styles.similarImageWrap}>
                      <div className={styles.similarImageBox}>
                        <img
                          src={
                            item.featured_image ||
                            'https://placehold.co/800x1000?text=House+of+Antiques'
                          }
                          alt={itemTitle}
                          className={`${styles.similarImage} ${
                            itemSensitive ? styles.blurSimilarImage : ''
                          }`}
                        />

                        {itemSensitive ? (
                          <div className={styles.similarSensitiveOverlay}>
                            <span className={styles.similarSensitiveLabel}>
                              {t.sensitiveShort}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className={styles.similarBody}>
                      <div className={styles.similarName}>{itemTitle}</div>
                      <div className={styles.similarPrice}>
                        {formatPrice(item.price_amount, item.currency_code || 'USD')}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {copied ? <div className={styles.toast}>{t.linkCopied}</div> : null}
        {cartAdded ? <div className={styles.toastAlt}>{t.addedToCart}</div> : null}
      </div>
    </main>
  )
}