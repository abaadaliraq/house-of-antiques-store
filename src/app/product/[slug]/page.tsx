import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import ProductDetailClient from "./ProductDetailClient";

type ProductRow = {
  id: string;
  slug: string;
  sku: string | null;

  name_ar: string | null;
  name_en: string | null;
  name_ku: string | null;

  description_ar: string | null;
  description_en: string | null;
  description_ku: string | null;

  price_amount: number;
  currency_code: string;

  featured_image: string | null;

  is_sensitive: boolean | null;
  is_auction: boolean | null;

  status: string | null;
  is_available: boolean | null;

  artist_name: string | null;
  year_text: string | null;

  material_ar: string | null;
  material_en: string | null;
  material_ku: string | null;

  condition_ar: string | null;
  condition_en: string | null;
  condition_ku: string | null;

  dimensions_ar: string | null;
  dimensions_en: string | null;
  dimensions_ku: string | null;

  period_ar: string | null;
  period_en: string | null;
  period_ku: string | null;

  origin_country: string | null;
  signed: boolean | null;

  category_slug: string | null;
  source_category: string | null;
  created_at?: string | null;
};

type ProductImageRow = {
  image_url: string;
  alt_ar: string | null;
  alt_en: string | null;
  alt_ku: string | null;
  sort_order: number;
};

type SimilarProductRow = {
  id: string;
  slug: string;
  featured_image: string | null;
  name_ar: string | null;
  name_en: string | null;
  name_ku: string | null;
  price_amount: number;
  currency_code: string;
  sku: string | null;
  is_sensitive: boolean | null;
  category_slug?: string | null;
  source_category?: string | null;
  material_ar?: string | null;
  material_en?: string | null;
  material_ku?: string | null;
  year_text?: string | null;
  period_ar?: string | null;
  period_en?: string | null;
  period_ku?: string | null;
  created_at?: string | null;
  status?: string | null;
  is_available?: boolean | null;
};

type ProductNavItem = {
  id: string;
  slug: string;
  name_ar: string | null;
  name_en: string | null;
  name_ku: string | null;
  featured_image: string | null;
  status: string | null;
  is_available: boolean | null;
};

function normalizeText(value?: string | null) {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function uniqueById(items: SimilarProductRow[]) {
  const map = new Map<string, SimilarProductRow>();
  for (const item of items) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values());
}

function includesAny(text: string, needles: string[]) {
  return needles.some((needle) => needle && text.includes(needle));
}

function getFamilyCategories(product: ProductRow) {
  const category = normalizeText(product.category_slug);
  const material = normalizeText(
    [product.material_ar, product.material_en, product.material_ku]
      .filter(Boolean)
      .join(" ")
  );
  const source = normalizeText(product.source_category);

  if (category === "furniture" || category === "wood") {
    return ["furniture", "wood"];
  }

  if (category === "silver") {
    return ["silver", "accessories"];
  }

  if (category === "copper") {
    return ["copper", "accessories"];
  }

  if (category === "accessories") {
    if (material.includes("فضة") || material.includes("silver")) {
      return ["accessories", "silver"];
    }
    if (material.includes("نحاس") || material.includes("copper")) {
      return ["accessories", "copper"];
    }
    return ["accessories"];
  }

  if (category === "artworks" || category === "paintings") {
    return ["artworks", "paintings"];
  }

  if (category === "crystal") {
    return ["crystal", "vases"];
  }

  if (category === "vases") {
    return ["vases", "crystal"];
  }

  if (category === "carpets") {
    return ["carpets"];
  }

  if (source.includes("مرآ") || source.includes("mirror")) {
    return ["furniture", "wood"];
  }

  return category
    ? [category]
    : ["furniture", "wood", "accessories", "silver", "copper"];
}

function scoreProduct(candidate: SimilarProductRow, current: ProductRow) {
  let score = 0;

  const currentCategory = normalizeText(current.category_slug);
  const currentSource = normalizeText(current.source_category);
  const currentMaterial = normalizeText(
    [current.material_ar, current.material_en, current.material_ku]
      .filter(Boolean)
      .join(" ")
  );
  const currentYear = normalizeText(current.year_text);
  const currentPeriod = normalizeText(
    [current.period_ar, current.period_en, current.period_ku]
      .filter(Boolean)
      .join(" ")
  );

  const candidateCategory = normalizeText(candidate.category_slug);
  const candidateSource = normalizeText(candidate.source_category);
  const candidateMaterial = normalizeText(
    [candidate.material_ar, candidate.material_en, candidate.material_ku]
      .filter(Boolean)
      .join(" ")
  );
  const candidateYear = normalizeText(candidate.year_text);
  const candidatePeriod = normalizeText(
    [candidate.period_ar, candidate.period_en, candidate.period_ku]
      .filter(Boolean)
      .join(" ")
  );

  if (candidateCategory && candidateCategory === currentCategory) score += 120;
  if (candidateSource && currentSource && candidateSource === currentSource) score += 140;
  if (candidateMaterial && currentMaterial && candidateMaterial === currentMaterial) score += 110;
  if (candidateYear && currentYear && candidateYear === currentYear) score += 45;
  if (candidatePeriod && currentPeriod && candidatePeriod === currentPeriod) score += 40;

  const currentTextBlob = normalizeText(
    [
      current.name_ar,
      current.name_en,
      current.name_ku,
      current.source_category,
      current.material_ar,
      current.material_en,
      current.material_ku,
      current.period_ar,
      current.period_en,
      current.period_ku,
    ]
      .filter(Boolean)
      .join(" ")
  );

  const candidateTextBlob = normalizeText(
    [
      candidate.name_ar,
      candidate.name_en,
      candidate.name_ku,
      candidate.source_category,
      candidate.material_ar,
      candidate.material_en,
      candidate.material_ku,
      candidate.period_ar,
      candidate.period_en,
      candidate.period_ku,
    ]
      .filter(Boolean)
      .join(" ")
  );

  const furnitureWords = ["مرآ", "mirror", "كرسي", "chair", "طاولة", "table", "كونسول", "bench", "مقعد"];
  const silverWords = ["فنجان", "ابريق", "إبريق", "silver", "فضة", "سوار", "ولاعة", "وعاء"];
  const copperWords = ["نحاس", "copper", "دلة", "ابريق", "إبريق", "وعاء"];
  const accessoryWords = ["اكسسوار", "إكسسوار", "accessory", "belt", "حزام", "سوار", "قلادة", "ولاعة"];

  if (includesAny(currentTextBlob, furnitureWords) && includesAny(candidateTextBlob, furnitureWords)) score += 55;
  if (includesAny(currentTextBlob, silverWords) && includesAny(candidateTextBlob, silverWords)) score += 55;
  if (includesAny(currentTextBlob, copperWords) && includesAny(candidateTextBlob, copperWords)) score += 55;
  if (includesAny(currentTextBlob, accessoryWords) && includesAny(candidateTextBlob, accessoryWords)) score += 45;

  return score;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: product, error } = await supabase
    .from("products_with_category")
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
      category_slug,
      source_category,
      created_at
    `)
    .eq("slug", slug)
    .single<ProductRow>();

  if (error || !product) notFound();

  const { data: images } = await supabase
    .from("product_images")
    .select(`
      image_url,
      alt_ar,
      alt_en,
      alt_ku,
      sort_order
    `)
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });

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
      : [];

  const familyCategories = getFamilyCategories(product);

  const { data: familyPool } = await supabase
    .from("products_with_category")
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
      is_sensitive,
      category_slug,
      source_category,
      material_ar,
      material_en,
      material_ku,
      year_text,
      period_ar,
      period_en,
      period_ku,
      created_at,
      status,
      is_available
    `)
    .neq("id", product.id)
    .in("category_slug", familyCategories)
    .order("created_at", { ascending: false })
    .limit(180);

  const { data: sameCategoryPool } = await supabase
    .from("products_with_category")
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
      is_sensitive,
      category_slug,
      source_category,
      material_ar,
      material_en,
      material_ku,
      year_text,
      period_ar,
      period_en,
      period_ku,
      created_at,
      status,
      is_available
    `)
    .neq("id", product.id)
    .eq("category_slug", product.category_slug ?? "")
    .order("created_at", { ascending: false })
    .limit(120);

  const { data: sameMaterialPool } = await supabase
    .from("products_with_category")
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
      is_sensitive,
      category_slug,
      source_category,
      material_ar,
      material_en,
      material_ku,
      year_text,
      period_ar,
      period_en,
      period_ku,
      created_at,
      status,
      is_available
    `)
    .neq("id", product.id)
    .eq("material_ar", product.material_ar ?? "")
    .order("created_at", { ascending: false })
    .limit(100);

  const rawPool = uniqueById([
    ...((sameCategoryPool ?? []) as SimilarProductRow[]),
    ...((sameMaterialPool ?? []) as SimilarProductRow[]),
    ...((familyPool ?? []) as SimilarProductRow[]),
  ]);

  const scored = rawPool
    .map((item) => ({
      ...item,
      _score: scoreProduct(item, product),
    }))
    .filter((item) => item._score > 0)
    .sort((a, b) => b._score - a._score);

  const closeMatches = scored.slice(0, 12).map(({ _score, ...item }) => item);
  const styleMatches = scored.slice(12, 30).map(({ _score, ...item }) => item);
  const extendedMatches = scored.slice(30, 90).map(({ _score, ...item }) => item);

  const { data: navProducts } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name_ar,
      name_en,
      name_ku,
      featured_image,
      status,
      is_available
    `)
    .order("created_at", { ascending: false });

  const navList = (navProducts ?? []).filter((item) => item.slug) as ProductNavItem[];
  const currentIndex = navList.findIndex((item) => item.slug === slug);

  const prevProduct =
    currentIndex >= 0 && currentIndex < navList.length - 1
      ? navList[currentIndex + 1]
      : null;

  const nextProduct =
    currentIndex > 0
      ? navList[currentIndex - 1]
      : null;

  return (
    <ProductDetailClient
      product={product}
      gallery={gallery}
      closeMatches={closeMatches}
      styleMatches={styleMatches}
      extendedMatches={extendedMatches}
      prevProduct={prevProduct}
      nextProduct={nextProduct}
    />
  );
}