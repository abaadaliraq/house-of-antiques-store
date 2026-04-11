import StoreHomeView from "../components/store/StoreHomeView";
import { supabase } from "../lib/supabase";

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
    console.error("Supabase products query error:", error);
  }

  const products = Array.isArray(data) ? data : [];

  return <StoreHomeView products={products} />;
}