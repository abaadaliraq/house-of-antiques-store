"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

export type StoreCategoryItem = {
  id: string;
  label: string;
};

export type StoreSortValue =
  | "default"
  | "price_desc"
  | "price_asc"
  | "latest"
  | "featured"
  | "signed";

type StoreFiltersProps = {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  categories?: StoreCategoryItem[];
  activeCategory?: string;
  searchValue?: string;
  filtersOpen?: boolean;
  sortValue?: StoreSortValue;
  onSearchChange?: (value: string) => void;
  onCategoryChange?: (id: string) => void;
  onOpenAdvancedFilters?: () => void;
  onCloseAdvancedFilters?: () => void;
  onSortChange?: (value: StoreSortValue) => void;
  locale?: "ar" | "en" | "ku";
  totalCount?: number;
};

export default function StoreFilters({
  title = "Visit collections",
  subtitle = "Art, culture, heritage and rare pieces",
  placeholder = "Search artworks, antiques, copper, carpets...",
  categories = [],
  activeCategory = "all",
  searchValue = "",
  filtersOpen = false,
  sortValue = "default",
  onSearchChange,
  onCategoryChange,
  onOpenAdvancedFilters,
  onCloseAdvancedFilters,
  onSortChange,
  locale = "ar",
  totalCount = 0,
}: StoreFiltersProps) {
  const filterLabel =
    locale === "ar" ? "فلترة" : locale === "ku" ? "فلتەر" : "Filters";

  const sortTitle =
    locale === "ar"
      ? "خيارات الفلترة"
      : locale === "ku"
      ? "هەڵبژاردەکانی فلتەر"
      : "Filter options";

  const itemsLabel =
    locale === "ar"
      ? `عدد القطع: ${totalCount}`
      : locale === "ku"
      ? `ژمارەی پارچەکان: ${totalCount}`
      : `${totalCount} items`;

  const sortOptions: { value: StoreSortValue; label: string }[] = [
    {
      value: "price_desc",
      label:
        locale === "ar"
          ? "القطع الأعلى سعراً إلى الأدنى"
          : locale === "ku"
          ? "لە بەرزترین نرخ بۆ نزمترین"
          : "Highest price to lowest",
    },
    {
      value: "price_asc",
      label:
        locale === "ar"
          ? "القطع الأدنى سعراً إلى الأعلى"
          : locale === "ku"
          ? "لە نزمترین نرخ بۆ بەرزترین"
          : "Lowest price to highest",
    },
    {
      value: "latest",
      label:
        locale === "ar"
          ? "القطع التي وصلت حديثاً"
          : locale === "ku"
          ? "پارچە تازە هاتووەکان"
          : "Newest arrivals",
    },
    {
      value: "featured",
      label:
        locale === "ar"
          ? "القطع المميزة"
          : locale === "ku"
          ? "پارچە تایبەتەکان"
          : "Featured pieces",
    },
    {
      value: "signed",
      label:
        locale === "ar"
          ? "القطع الموقعة"
          : locale === "ku"
          ? "پارچە واژۆکراوەکان"
          : "Signed pieces",
    },
  ];

  return (
    <section className="store-filters-refined">
      <div className="store-filters-refined__head">
        <div className="store-filters-refined__copy">
          <p className="store-filters-refined__kicker">{title}</p>
          <h2 className="store-filters-refined__title">{title}</h2>
          <p className="store-filters-refined__sub">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onOpenAdvancedFilters}
          className="store-filters-refined__filterBtn"
        >
          <SlidersHorizontal size={14} />
          {filterLabel}
        </button>
      </div>

      <div className="store-filters-refined__search flex items-center gap-3">
        <Search size={18} className="store-filters-refined__searchIcon" />

        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={placeholder}
          className="store-filters-refined__input flex-1"
        />

        <div className="shrink-0 whitespace-nowrap text-xs font-medium text-black/55">
          {itemsLabel}
        </div>
      </div>

      {!!categories.length && (
        <div className="store-filters-refined__chips">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange?.(category.id)}
                className={
                  isActive
                    ? "store-filters-refined__chip is-active"
                    : "store-filters-refined__chip"
                }
              >
                {category.label}
              </button>
            );
          })}
        </div>
      )}

      {filtersOpen && (
        <>
          <button
            type="button"
            aria-label="Close filters"
            onClick={onCloseAdvancedFilters}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          />

          <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-2xl rounded-t-[2rem] border border-black/10 bg-[#f8f5ef] p-4 shadow-[0_-18px_50px_rgba(0,0,0,0.18)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[1.05rem] font-semibold text-black">
                {sortTitle}
              </h3>

              <button
                type="button"
                onClick={onCloseAdvancedFilters}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-2">
              {sortOptions.map((option) => {
                const active = sortValue === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onSortChange?.(option.value)}
                    className={[
                      "rounded-[1rem] border px-4 py-3 text-right text-sm transition",
                      active
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black hover:bg-black/[0.03]",
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}