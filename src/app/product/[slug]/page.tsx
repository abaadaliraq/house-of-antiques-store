import { notFound } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import ProductDetailClient from './ProductDetailClient'

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
  is_sensitive: boolean | null
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data: product, error } = await supabase
    .from('products_with_category')
    .select(`
      id,
      slug,
      sku,
      name_ar,
      name_en,
      name_ku,
      description_ar,
      description_en,
      description_ku,
      price_amount,
      currency_code,
      featured_image,
      is_sensitive,
      is_auction,
      status,
      is_available,
      artist_name,
      year_text,
      material_ar,
      material_en,
      material_ku,
      condition_ar,
      condition_en,
      condition_ku,
      dimensions_ar,
      dimensions_en,
      dimensions_ku,
      period_ar,
      period_en,
      period_ku,
      origin_country,
      signed,
      category_slug
    `)
    .eq('slug', slug)
    .single<ProductRow>()

  if (error || !product) notFound()

  const { data: images } = await supabase
    .from('product_images')
    .select(`
      image_url,
      alt_ar,
      alt_en,
      alt_ku,
      sort_order
    `)
    .eq('product_id', product.id)
    .order('sort_order', { ascending: true })

  const gallery: ProductImageRow[] =
    images && images.length
      ? images
      : product.featured_image
        ? [
            {
              image_url: product.featured_image,
              alt_ar: product.name_ar,
              alt_en: product.name_en,
              alt_ku: product.name_ku,
              sort_order: 0,
            },
          ]
        : []

  const { data: similarProducts } = await supabase
    .from('products_with_category')
    .select(`
      id,
      slug,
      featured_image,
      name_ar,
      name_en,
      name_ku,
      price_amount,
      currency_code,
      sku,
      is_sensitive
    `)
    .eq('is_available', true)
    .eq('category_slug', product.category_slug ?? '')
    .neq('id', product.id)
    .limit(8)

  return (
    <ProductDetailClient
      product={product}
      gallery={gallery}
      similarProducts={(similarProducts ?? []) as SimilarProductRow[]}
    />
  )
}