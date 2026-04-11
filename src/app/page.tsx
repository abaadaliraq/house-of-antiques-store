import StoreHomeView from "../components/store/StoreHomeView";
import { supabase } from "../lib/supabase";

type StoreProductRow = {
  id: string;
  sku: string | null;
  slug: string | null;
  source_category: string | null;

  name_ar: string | null;
  name_en: string | null;
  name_ku: string | null;

  description_ar: string | null;
  description_en: string | null;
  description_ku: string | null;

  price_amount: number | null;
  currency_code: string | null;

  featured_image: string | null;

  is_featured: boolean | null;
  is_available: boolean | null;
  status: string | null;
  stock: number | null;
  signed: boolean | null;
  is_sensitive: boolean | null;

  artist_name: string | null;
};

type ProductImageCountRow = {
  product_id: string | null;
};

type EnrichedStoreProduct = {
  id: string;
  sku: string | null;
  slug: string;
  source_category: string | null;

  name_ar: string | null;
  name_en: string | null;
  name_ku: string | null;

  description_ar: string | null;
  description_en: string | null;
  description_ku: string | null;

  price_amount: number | null;
  currency_code: string | null;

  featured_image: string | null;

  is_featured: boolean | null;
  is_available: boolean | null;
  status: string | null;
  stock: number | null;
  signed: boolean | null;
  is_sensitive: boolean | null;

  artist_name: string | null;
  image_count: number;
};

export default async function StorePage() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      sku,
      slug,
      source_category,
      name_ar,
      name_en,
      name_ku,
      description_ar,
      description_en,
      description_ku,
      price_amount,
      currency_code,
      featured_image,
      is_featured,
      is_available,
      status,
      stock,
      signed,
      is_sensitive,
      artist_name
    `)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Products query error:", error);
  }

  const rawProducts: StoreProductRow[] = Array.isArray(data) ? data : [];

  const validProducts = rawProducts.filter(
    (product): product is StoreProductRow & { slug: string } =>
      typeof product.slug === "string" && product.slug.trim().length > 0
  );

  const productIds = validProducts.map((product) => product.id);

  let imageCountsMap: Record<string, number> = {};

  if (productIds.length > 0) {
    const { data: imageRows, error: imageError } = await supabase
      .from("product_images")
      .select("product_id")
      .in("product_id", productIds);

    if (imageError) {
      console.error("Product images query error:", imageError);
    }

    const imageCounts = Array.isArray(imageRows)
      ? (imageRows as ProductImageCountRow[]).reduce<Record<string, number>>(
          (acc, row) => {
            if (!row.product_id) return acc;
            acc[row.product_id] = (acc[row.product_id] || 0) + 1;
            return acc;
          },
          {}
        )
      : {};

    imageCountsMap = imageCounts;
  }

  const enrichedProducts: EnrichedStoreProduct[] = validProducts.map((product) => ({
    ...product,
    image_count: imageCountsMap[product.id] || (product.featured_image ? 1 : 0),
  }));

  return <StoreHomeView products={enrichedProducts} />;
}