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
      ? `عدد القطع ${totalCount}`
      : locale === "ku"
      ? `ژمارەی پارچەکان ${totalCount}`
      : `${totalCount} items`;

  const sortOptions: { value: StoreSortValue; label: string }[] = [
    {
      value: "price_desc",
      label:
        locale === "ar"
          ? "الأعلى سعراً إلى الأدنى"
          : locale === "ku"
          ? "لە بەرزترین نرخ بۆ نزمترین"
          : "Highest price to lowest",
    },
    {
      value: "price_asc",
      label:
        locale === "ar"
          ? "الأدنى سعراً إلى الأعلى"
          : locale === "ku"
          ? "لە نزمترین نرخ بۆ بەرزترین"
          : "Lowest price to highest",
    },
    {
      value: "latest",
      label:
        locale === "ar"
          ? "وصلت حديثاً"
          : locale === "ku"
          ? "تازە هاتووەکان"
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
    <section className="store-filters-lux">
      <div className="store-filters-lux__hero">
        <div className="store-filters-lux__copy">
          <p className="store-filters-lux__eyebrow">
            {locale === "ar"
              ? "متجر بيت التحفيات"
              : locale === "ku"
              ? "فرۆشگای ماڵی تحف"
              : "House of Antiques Store"}
          </p>

          <h2 className="store-filters-lux__title">{title}</h2>
          <p className="store-filters-lux__subtitle">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onOpenAdvancedFilters}
          className="store-filters-lux__filterBtn"
        >
          <SlidersHorizontal size={14} />
          <span>{filterLabel}</span>
        </button>
      </div>

      <div className="store-filters-lux__searchWrap">
        <div className="store-filters-lux__searchBox">
          <Search size={18} className="store-filters-lux__searchIcon" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={placeholder}
            className="store-filters-lux__input"
          />
        </div>

        <div className="store-filters-lux__count">{itemsLabel}</div>
      </div>

      {!!categories.length && (
        <div className="store-filters-lux__chips">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange?.(category.id)}
                className={
                  isActive
                    ? "store-filters-lux__chip is-active"
                    : "store-filters-lux__chip"
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
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[3px]"
          />

          <div className="store-filters-lux__drawer">
            <div className="store-filters-lux__drawerHead">
              <h3 className="store-filters-lux__drawerTitle">{sortTitle}</h3>

              <button
                type="button"
                onClick={onCloseAdvancedFilters}
                className="store-filters-lux__closeBtn"
              >
                <X size={16} />
              </button>
            </div>

            <div className="store-filters-lux__drawerOptions">
              {sortOptions.map((option) => {
                const active = sortValue === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onSortChange?.(option.value)}
                    className={
                      active
                        ? "store-filters-lux__sortBtn is-active"
                        : "store-filters-lux__sortBtn"
                    }
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