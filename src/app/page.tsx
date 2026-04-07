import StoreHomeView from "../components/store/StoreHomeView";
import { supabase } from "../lib/supabase";

export default async function StorePage() {
  const { data } = await supabase
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
      is_sensitive
    `)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  const products = Array.isArray(data) ? data : [];

  return <StoreHomeView products={products} />;
}