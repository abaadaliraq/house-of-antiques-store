'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Eye, EyeOff } from "lucide-react";
import { formatPrice } from '../../../lib/format'
import { addToCart, getCartCount } from '../../../lib/cart'
import styles from './ProductPage.module.css'

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

type Props = {
  product: ProductRow
  gallery: ProductImageRow[]
  similarProducts: SimilarProductRow[]
}

function pickLang(
  ar?: string | null,
  en?: string | null,
  ku?: string | null,
  lang: 'ar' | 'en' | 'ku' = 'ar'
) {
  if (lang === 'ar') return ar || en || ku || ''
  if (lang === 'ku') return ku || ar || en || ''
  return en || ar || ku || ''
}

function getFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem('store_favorites')
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveFavoriteIds(ids: string[]) {
  localStorage.setItem('store_favorites', JSON.stringify(ids))
}

function formatCategory(category?: string | null) {
  if (!category) return 'Collection'
  return category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

export default function ProductDetailClient({
  product,
  gallery,
  similarProducts,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [favorite, setFavorite] = useState(false)
  const [copied, setCopied] = useState(false)
  const [cartAdded, setCartAdded] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [showSensitive, setShowSensitive] = useState(false)
  
  const title = pickLang(product.name_ar, product.name_en, product.name_ku, 'ar')
  const description = pickLang(
    product.description_ar,
    product.description_en,
    product.description_ku,
    'ar'
  )

  const categoryName = useMemo(() => {
    if (product.category_slug === 'paintings') return 'لوحات'
    if (product.category_slug === 'artworks') return 'أعمال فنية'
    if (product.category_slug === 'accessories') return 'إكسسوارات'
    if (product.category_slug === 'copper') return 'نحاس'
    if (product.category_slug === 'silver') return 'فضة'
    if (product.category_slug === 'crystal') return 'كريستال'
    if (product.category_slug === 'wood') return 'خشب'
    if (product.category_slug === 'carpets') return 'سجاد'
    if (product.category_slug === 'furniture') return 'أثاث'
    if (product.category_slug === 'vases') return 'فازات'
    return formatCategory(product.category_slug)
  }, [product.category_slug])

  const detailsList = useMemo(
    () => [
      { label: 'الكود', value: product.sku || '—' },
      { label: 'الفنان', value: product.artist_name || '—' },
      { label: 'السنة', value: product.year_text || '—' },
      {
        label: 'الأبعاد',
        value:
          pickLang(
            product.dimensions_ar,
            product.dimensions_en,
            product.dimensions_ku,
            'ar'
          ) || '—',
      },
      {
        label: 'الخامة',
        value:
          pickLang(
            product.material_ar,
            product.material_en,
            product.material_ku,
            'ar'
          ) || '—',
      },
      {
        label: 'الحالة',
        value:
          pickLang(
            product.condition_ar,
            product.condition_en,
            product.condition_ku,
            'ar'
          ) || '—',
      },
    ],
    [product]
  )

  const currentImage =
    gallery[activeIndex]?.image_url ||
    product.featured_image ||
    'https://placehold.co/1200x1200?text=House+of+Antiques'

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
    addToCart({
      id: product.id,
      slug: product.slug,
      sku: product.sku || null,
      name: title,
      image: currentImage,
      price: Number(product.price_amount || 0),
      currency: 'USD',
      qty: 1,
    })

    setCartAdded(true)
    window.setTimeout(() => setCartAdded(false), 1600)
  }

  function handleBack() {
    if (window.history.length > 1) {
      window.history.back()
      return
    }
    window.location.href = '/'
  }

  const isSensitive = product.is_sensitive === true

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <div className={`${styles.productTopbar} ${styles.fadeUp}`}>
          <button
            type="button"
            className={styles.topbarBack}
            onClick={handleBack}
            aria-label="رجوع"
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
              aria-label="السلة"
              title="السلة"
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
              aria-label="مفضلة"
              title="أضف للمفضلة"
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
            isSensitive && !showSensitive ? styles.blurImage : ""
          }`}
        />

        {isSensitive && !showSensitive ? (
          <div className={styles.sensitiveOverlay}>
            <div className={styles.sensitiveBox}>
              <div className={styles.sensitiveIconWrap}>
                <EyeOff size={22} />
              </div>

              <div className={styles.sensitiveEyebrow}>Sensitive Content</div>
              <div className={styles.sensitiveTitle}>Hidden Preview</div>

              <p className={styles.sensitiveText}>
                This artwork contains explicit visual content.
              </p>

              <button
                type="button"
                className={styles.sensitiveBtn}
                onClick={() => setShowSensitive(true)}
              >
                <Eye size={16} />
                Reveal Content
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>

            {gallery.length > 1 ? (
              <div className={styles.thumbRail}>
                {gallery.map((item, index) => {
                  const alt =
                    item.alt_ar || item.alt_en || item.alt_ku || `${title} ${index + 1}`

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
                      aria-label={`image ${index + 1}`}
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
              <p className={styles.descriptionText}>
                {description || 'لا يوجد وصف حالياً.'}
              </p>
            </div>
          </div>

          <div className={styles.infoCol}>
            <div className={styles.topActions}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={handleCopyLink}
                aria-label="copy link"
                title="نسخ الرابط"
              >
                ⧉
              </button>
            </div>

            <div className={`${styles.titleBlock} ${styles.fadeUp} ${styles.delay1}`}>
              <h1 className={styles.title}>{title}</h1>
              <div className={styles.metaLine}>
                <span>متوفرة</span>
                <span>•</span>
                <span>{product.sku || '—'}</span>
                {isSensitive ? (
                  <>
                    <span>•</span>
                    <span>محتوى حساس</span>
                  </>
                ) : null}
              </div>
            </div>

            <div className={`${styles.priceRow} ${styles.fadeUp} ${styles.delay2}`}>
              <div className={styles.pricePill}>
                {formatPrice(product.price_amount, 'USD')}
              </div>
            </div>

            <div className={`${styles.ctaRow} ${styles.fadeUp} ${styles.delay3}`}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleAddToCart}
              >
                أضف إلى السلة
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
            <h2 className={styles.similarTitle}>قطع مشابهة</h2>
          </div>

          {similarProducts.length === 0 ? (
            <div className={styles.empty}>لا توجد قطع مشابهة حالياً</div>
          ) : (
            <div className={styles.similarRail}>
              {similarProducts.map((item) => {
                const itemTitle = pickLang(
                  item.name_ar,
                  item.name_en,
                  item.name_ku,
                  'ar'
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
                              محتوى حساس
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className={styles.similarBody}>
                      <div className={styles.similarName}>{itemTitle}</div>
                      <div className={styles.similarPrice}>
                        {formatPrice(item.price_amount, 'USD')}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {copied ? <div className={styles.toast}>تم نسخ الرابط</div> : null}
        {cartAdded ? <div className={styles.toastAlt}>تمت الإضافة إلى السلة</div> : null}
      </div>
    </main>
  )
}