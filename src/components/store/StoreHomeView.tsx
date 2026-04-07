"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import StoreShell from "./StoreShell";
import StoreTopbar from "./StoreTopbar";
import StoreHero from "./StoreHero";
import StoreFilters, { type StoreSortValue } from "./StoreFilters";
import ProductCard, { type StoreLocale, type StoreProduct } from "./ProductCard";
import StoreFeatured from "./StoreFeatured";
import StoreStickyShowcase from "./StoreStickyShowcase";
import StoreFooter from "./StoreFooter";
import StoreRareSignedRail from "./StoreRareSignedRail";

type StoreHomeViewProps = {
  products: StoreProduct[];
};

const FAVORITES_KEY = "hoa_favorites_v1";

const FIXED_CATEGORIES = [
  "all",
  "silver",
  "accessories",
  "copper",
  "carpets",
  "artworks",
  "paintings",
  "furniture",
  "wood",
  "crystal",
  "vases",
] as const;

function normalizeText(value?: string | null) {
  return (value || "").toLowerCase().trim();
}

function mapCategoryToSlug(value?: string | null) {
  const raw = normalizeText(value);

  if (!raw) return "other";
  if (raw.includes("فضة") || raw.includes("silver")) return "silver";

  if (
    raw.includes("اكسسو") ||
    raw.includes("إكسسو") ||
    raw.includes("اكسسوار") ||
    raw.includes("accessor")
  ) {
    return "accessories";
  }

  if (raw.includes("نحاس") || raw.includes("copper")) return "copper";
  if (raw.includes("سجاد") || raw.includes("carpet")) return "carpets";

  if (
    raw.includes("اعمال فنية") ||
    raw.includes("أعمال فنية") ||
    raw.includes("artworks")
  ) {
    return "artworks";
  }

  if (raw.includes("لوحات") || raw.includes("لوحة") || raw.includes("paintings")) {
    return "paintings";
  }

  if (raw.includes("اثاث") || raw.includes("أثاث") || raw.includes("furniture")) {
    return "furniture";
  }

  if (raw.includes("خشب") || raw.includes("wood")) return "wood";
  if (raw.includes("كريستال") || raw.includes("crystal")) return "crystal";

  if (raw.includes("فازات") || raw.includes("مزهر") || raw.includes("vase")) {
    return "vases";
  }

  return "other";
}

function categoryLabel(slug: string, locale: StoreLocale) {
  const labels: Record<string, { ar: string; en: string; ku: string }> = {
    all: { ar: "الكل", en: "All", ku: "هەموو" },
    silver: { ar: "فضة", en: "Silver", ku: "زیو" },
    accessories: { ar: "إكسسوارات", en: "Accessories", ku: "ئاکسسوارات" },
    copper: { ar: "نحاس", en: "Copper", ku: "مس" },
    carpets: { ar: "سجاد", en: "Carpets", ku: "قالی" },
    artworks: { ar: "أعمال فنية", en: "Artworks", ku: "کارە هونەرییەکان" },
    paintings: { ar: "لوحات", en: "Paintings", ku: "تابلۆ" },
    furniture: { ar: "أثاث", en: "Furniture", ku: "کەلوپەل" },
    wood: { ar: "خشب", en: "Wood", ku: "دار" },
    crystal: { ar: "كريستال", en: "Crystal", ku: "کریستاڵ" },
    vases: { ar: "فازات", en: "Vases", ku: "گوڵدان" },
    other: { ar: "أخرى", en: "Other", ku: "هیتر" },
  };

  return labels[slug]?.[locale] || labels[slug]?.ar || slug;
}

function cycleLocale(locale: StoreLocale): StoreLocale {
  if (locale === "ar") return "en";
  if (locale === "en") return "ku";
  return "ar";
}

function getNumericPrice(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isNaN(parsed) ? null : parsed;
}

function isSoldProduct(product: StoreProduct) {
  return product.status === "sold" || product.is_available === false;
}

export default function StoreHomeView({ products }: StoreHomeViewProps) {
  const [locale, setLocale] = useState<StoreLocale>("ar");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortValue, setSortValue] = useState<StoreSortValue>("default");

  const productsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FAVORITES_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setFavorites(parsed);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "en" ? "ltr" : "rtl";
  }, [locale]);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => product.slug);
  }, [products]);

  const categories = useMemo(() => {
    return FIXED_CATEGORIES.map((slug) => ({
      id: slug,
      label: categoryLabel(slug, locale),
    }));
  }, [locale]);

  const featuredProducts = useMemo(() => {
    const explicit = visibleProducts.filter(
      (product) => product.is_featured && !isSoldProduct(product)
    );

    if (explicit.length >= 6) return explicit.slice(0, 12);

    const merged = [...explicit];

    for (const product of visibleProducts) {
      if (isSoldProduct(product)) continue;
      const exists = merged.some((item) => item.id === product.id);
      if (!exists) merged.push(product);
      if (merged.length >= 12) break;
    }

    return merged;
  }, [visibleProducts]);

  const rareSignedProducts = useMemo(() => {
    return visibleProducts
      .filter((product) => product.signed === true && !isSoldProduct(product))
      .slice(0, 10);
  }, [visibleProducts]);

  const soldProducts = useMemo(() => {
    return visibleProducts.filter((product) => isSoldProduct(product)).slice(0, 18);
  }, [visibleProducts]);

  const filteredProducts = useMemo(() => {
    const needle = normalizeText(search);

    let result = visibleProducts.filter((product) => {
      const productCategory = mapCategoryToSlug(product.source_category);
      const inCategory =
        activeCategory === "all" ? true : productCategory === activeCategory;

      const inFavorites = favoritesOnly ? favorites.includes(product.id) : true;

      const blob = [
        product.sku,
        product.slug,
        product.featured_image,
        product.name_ar,
        product.name_en,
        product.name_ku,
        product.description_ar,
        product.description_en,
        product.description_ku,
        product.source_category,
        product.status,
      ]
        .map(normalizeText)
        .join(" ");

      const matchesSearch = !needle || blob.includes(needle);

      return inCategory && inFavorites && matchesSearch;
    });

    if (sortValue === "featured") {
      result = result.filter((product) => product.is_featured && !isSoldProduct(product));
    }

    if (sortValue === "signed") {
      result = result.filter((product) => product.signed === true && !isSoldProduct(product));
    }

    if (sortValue === "price_desc") {
      result = [...result].sort((a, b) => {
        const aPrice = getNumericPrice(a.price_amount) ?? -1;
        const bPrice = getNumericPrice(b.price_amount) ?? -1;
        return bPrice - aPrice;
      });
    }

    if (sortValue === "price_asc") {
      result = [...result].sort((a, b) => {
        const aPrice = getNumericPrice(a.price_amount) ?? Number.MAX_SAFE_INTEGER;
        const bPrice = getNumericPrice(b.price_amount) ?? Number.MAX_SAFE_INTEGER;
        return aPrice - bPrice;
      });
    }

    if (sortValue === "latest") {
      result = [...result];
    }

    return result;
  }, [visibleProducts, activeCategory, favoritesOnly, favorites, search, sortValue]);

  const featuredIds = useMemo(() => {
    return new Set(featuredProducts.map((product) => product.id));
  }, [featuredProducts]);

  const gridProducts = useMemo(() => {
    const isDefaultStoreView =
      activeCategory === "all" &&
      !favoritesOnly &&
      !search.trim() &&
      sortValue === "default";

    if (!isDefaultStoreView) return filteredProducts;

    return filteredProducts.filter((product) => !featuredIds.has(product.id));
  }, [
    filteredProducts,
    activeCategory,
    favoritesOnly,
    search,
    sortValue,
    featuredIds,
  ]);

  const topProducts = useMemo(() => gridProducts.slice(0, 20), [gridProducts]);
  const bottomProducts = useMemo(() => gridProducts.slice(20), [gridProducts]);

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function closeFilters() {
    setFiltersOpen(false);
  }

  function scrollToProducts() {
    productsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    closeMenu();
  }

  function goToFeatured() {
    document.getElementById("featured")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    closeMenu();
  }

  function goToSigned() {
    document.getElementById("signed")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    closeMenu();
  }

  function goToContact() {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    closeMenu();
  }

  const textDir = locale === "en" ? "ltr" : "rtl";

  return (
    <div className="store-page" dir={textDir}>
      <StoreShell
        topbar={
          <div className="relative">
            <StoreTopbar
              brand={
                locale === "ar"
                  ? "بيت التحفيات"
                  : locale === "ku"
                  ? "ماڵی تحف"
                  : "House of Antiques"
              }
              langLabel={locale.toUpperCase()}
              isMenuOpen={menuOpen}
              favoritesOnly={favoritesOnly}
              onMenuClick={() => setMenuOpen((prev) => !prev)}
              onLanguageToggle={() => setLocale((current) => cycleLocale(current))}
              onSearchClick={scrollToProducts}
              onFavoritesClick={() => setFavoritesOnly((prev) => !prev)}
            />

            {menuOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close menu overlay"
                  className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
                  onClick={closeMenu}
                />

                <aside className="fixed right-0 top-0 z-50 h-screen w-[88vw] max-w-[360px] border-l border-white/10 bg-[#050505]/95 p-4 text-white shadow-[-20px_0_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                  <div className="flex h-full flex-col">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[0.68rem] uppercase tracking-[0.26em] text-white/40">
                          Museum Store
                        </p>
                        <h3 className="mt-1 text-lg font-semibold">
                          {locale === "ar"
                            ? "القائمة"
                            : locale === "ku"
                            ? "مێنیو"
                            : "Menu"}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={closeMenu}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                        aria-label="Close menu"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategory("all");
                          setFavoritesOnly(false);
                          scrollToProducts();
                        }}
                        className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-right text-sm text-white/90 transition hover:bg-white/10"
                      >
                        {locale === "ar"
                          ? "كل القطع"
                          : locale === "ku"
                          ? "هەموو پارچەکان"
                          : "All products"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFavoritesOnly(true);
                          scrollToProducts();
                        }}
                        className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-right text-sm text-white/90 transition hover:bg-white/10"
                      >
                        {locale === "ar"
                          ? "المفضلة"
                          : locale === "ku"
                          ? "دڵخوازەکان"
                          : "Favorites"}
                      </button>

                      <button
                        type="button"
                        onClick={goToFeatured}
                        className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-right text-sm text-white/90 transition hover:bg-white/10"
                      >
                        {locale === "ar"
                          ? "القطع المميزة"
                          : locale === "ku"
                          ? "پارچە تایبەتەکان"
                          : "Featured pieces"}
                      </button>

                      <button
                        type="button"
                        onClick={goToSigned}
                        className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-right text-sm text-white/90 transition hover:bg-white/10"
                      >
                        {locale === "ar"
                          ? "القطع الموقعة"
                          : locale === "ku"
                          ? "پارچە واژۆکراوەکان"
                          : "Signed pieces"}
                      </button>

                      <button
                        type="button"
                        onClick={goToContact}
                        className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-right text-sm text-white/90 transition hover:bg-white/10"
                      >
                        {locale === "ar"
                          ? "تواصل معنا"
                          : locale === "ku"
                          ? "پەیوەندی"
                          : "Contact us"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLocale((current) => cycleLocale(current));
                          closeMenu();
                        }}
                        className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-right text-sm text-white/90 transition hover:bg-white/10"
                      >
                        {locale === "ar"
                          ? "تغيير اللغة"
                          : locale === "ku"
                          ? "گۆڕینی زمان"
                          : "Change language"}
                      </button>
                    </div>

                    <div className="mt-auto pt-6 text-xs text-white/38">
                      {locale === "ar"
                        ? "تنقل سريع داخل المتجر"
                        : locale === "ku"
                        ? "گەڕانێکی خێرا لە فرۆشگا"
                        : "Quick navigation inside the store"}
                    </div>
                  </div>
                </aside>
              </>
            )}
          </div>
        }
        hero={<StoreHero />}
        filters={
          <StoreFilters
            locale={locale}
            title={
              locale === "ar"
                ? "زيارة المجموعات"
                : locale === "ku"
                ? "سەردانی کۆمەڵەکان"
                : "Visit Galleries"
            }
            subtitle={
              locale === "ar"
                ? "فن، ثقافة، تاريخ وقطع نادرة"
                : locale === "ku"
                ? "هونەر، کەلتور، مێژوو و پارچە نایاب"
                : "View art, culture, history and rare collections"
            }
            placeholder={
              locale === "ar"
                ? "ابحث عن لوحات، تحف، نحاس، سجاد..."
                : locale === "ku"
                ? "گەڕان بۆ تابلوو، تحف، مس، قالی..."
                : "Search artworks, antiques, copper, carpets..."
            }
            categories={categories}
            activeCategory={activeCategory}
            totalCount={gridProducts.length}
            searchValue={search}
            filtersOpen={filtersOpen}
            sortValue={sortValue}
            onSearchChange={setSearch}
            onCategoryChange={(id) => {
              setActiveCategory(id);
              scrollToProducts();
            }}
            onOpenAdvancedFilters={() => setFiltersOpen(true)}
            onCloseAdvancedFilters={closeFilters}
            onSortChange={(value) => {
              setSortValue(value);
              closeFilters();
            }}
          />
        }
        featured={<StoreFeatured products={featuredProducts} locale={locale} />}
        stickyShowcase={
          <StoreStickyShowcase
            image="https://res.cloudinary.com/dyqdfbaln/image/upload/v1/hoa-slv-083-jpg_upjqky"
            title={
              locale === "ar"
                ? "اقتناء يليق بالذائقة الرفيعة"
                : locale === "ku"
                ? "گرتنێکی شیاوی زەوقی بەرز"
                : "A refined piece worth collecting"
            }
            description={
              locale === "ar"
                ? "ليست كل القطع للعرض فقط، بعضها خُلق ليكون جزءاً من مجموعة خاصة."
                : locale === "ku"
                ? "هەموو پارچەکان بۆ پیشاندان نین، هەندێکیان بۆ کۆمەڵەی تایبەت دروستکراون."
                : "Not every piece is meant to be displayed. Some are meant to belong."
            }
          />
        }
        footer={<StoreFooter />}
      >
        <section id="products" ref={productsRef} className="space-y-4 pt-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-black/45">
                {favoritesOnly
                  ? locale === "ar"
                    ? "المحفوظ"
                    : locale === "ku"
                    ? "پاراستراو"
                    : "Saved"
                  : locale === "ar"
                  ? "المجموعة"
                  : locale === "ku"
                  ? "کۆمەڵە"
                  : "Collection"}
              </p>

              <h2 className="store-section-title mt-1 text-[1.5rem] font-semibold tracking-[-0.03em] text-black sm:text-[1.85rem]">
                {favoritesOnly
                  ? locale === "ar"
                    ? "قطعك المفضلة"
                    : locale === "ku"
                    ? "پارچە دڵخوازەکانت"
                    : "Your favorites"
                  : locale === "ar"
                  ? "استكشف القطع"
                  : locale === "ku"
                  ? "پارچەکان بگەڕێ"
                  : "Explore the pieces"}
              </h2>
            </div>

            <div className="text-sm text-black/55">{gridProducts.length} items</div>
          </div>

          {gridProducts.length ? (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {topProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                    productHref={`/product/${product.slug}`}
                  />
                ))}
              </div>

              {activeCategory === "all" &&
              !favoritesOnly &&
              rareSignedProducts.length > 0 ? (
                <StoreRareSignedRail
                  products={rareSignedProducts}
                  locale={locale}
                />
              ) : null}

              {soldProducts.length > 0 ? (
                <section className="featured-rail-section sold-rail-band">
                 <div className="featured-rail-section__head sold-rail-band__head">
                    <div>
                      <p className="featured-rail-section__kicker">
                        {locale === "ar"
                          ? "تم اقتناؤها"
                          : locale === "ku"
                          ? "کراونەتەوە"
                          : "Collected"}
                      </p>
                      <h2 className="featured-rail-section__title">
                        {locale === "ar"
                          ? "قطع تم اقتناؤها"
                          : locale === "ku"
                          ? "پارچەی کڕدراو"
                          : "Collected pieces"}
                      </h2>
                      <p className="featured-rail-section__count">
                        {soldProducts.length} items
                      </p>
                    </div>
                  </div>

                  <div className="featured-rail-section__viewport">
                    <div className="featured-rail-section__track">
                      {soldProducts.map((product) => (
                        <div
                          key={product.id}
                          className="featured-rail-card"
                        >
                          <ProductCard
                            product={product}
                            locale={locale}
                            isFavorite={favorites.includes(product.id)}
                            onToggleFavorite={toggleFavorite}
                            productHref={`/product/${product.slug}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ) : null}

              {bottomProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {bottomProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={locale}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={toggleFavorite}
                      productHref={`/product/${product.slug}`}
                    />
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="store-soft-card rounded-[1.8rem] p-8 text-center">
              <h3 className="text-[1.2rem] font-semibold tracking-[-0.03em] text-black">
                {locale === "ar"
                  ? "لا توجد نتائج"
                  : locale === "ku"
                  ? "هیچ ئەنجامێک نییە"
                  : "No results found"}
              </h3>

              <p className="mt-2 text-sm text-black/55">
                {locale === "ar"
                  ? "جرّب تغيير البحث أو التصنيف أو ألغِ وضع المفضلة."
                  : locale === "ku"
                  ? "گەڕان یان هاوپۆل بگۆڕە یان دڵخوازەکان لابەرە."
                  : "Try changing the search term, category, or turning off favorites mode."}
              </p>
            </div>
          )}
        </section>
      </StoreShell>
    </div>
  );
}