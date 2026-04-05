"use client";

import Link from "next/link";
import type { StoreLocale, StoreProduct } from "./ProductCard";

type StoreFeaturedProps = {
  products: StoreProduct[];
  locale: StoreLocale;
};

function getName(product: StoreProduct, locale: StoreLocale) {
  return (
    (locale === "ar" && product.name_ar) ||
    (locale === "en" && product.name_en) ||
    (locale === "ku" && product.name_ku) ||
    product.name_ar ||
    product.name_en ||
    product.name_ku ||
    "Untitled Piece"
  );
}

function formatPrice(value?: number | string | null, currency?: string | null) {
  if (value === null || value === undefined || value === "") return "Price on request";
  const numeric = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(numeric)) return `${value} ${currency ?? ""}`.trim();
  return `${numeric.toLocaleString()} ${currency ?? "IQD"}`;
}

export default function StoreFeatured({ products, locale }: StoreFeaturedProps) {
  if (!products.length) return null;

  return (
    <section id="featured" className="featured-rail-section">
      <div className="featured-rail-section__head">
        <div>
          <p className="featured-rail-section__kicker">
            {locale === "ar" ? "مختارات مميزة" : locale === "ku" ? "هەڵبژاردەی تایبەت" : "Featured selection"}
          </p>
          <h2 className="featured-rail-section__title">
            {locale === "ar" ? "القطع المميزة" : locale === "ku" ? "پارچە تایبەتەکان" : "Featured pieces"}
          </h2>
          <p className="featured-rail-section__count">{products.length} items</p>
        </div>

        <a href="#products" className="featured-rail-section__all">
          {locale === "ar" ? "عرض الكل" : locale === "ku" ? "هەمووی ببینە" : "See all"}
        </a>
      </div>

      <div className="featured-rail-section__viewport">
        <div className="featured-rail-section__track">
          {products.map((product) => {
            const name = getName(product, locale);
            const image = product.featured_image?.trim() || "";

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="featured-rail-card"
              >
                <div className="featured-rail-card__media">
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className="featured-rail-card__image"
                    />
                  ) : (
                    <div className="featured-rail-card__fallback">No image</div>
                  )}

                  <div className="featured-rail-card__overlay" />

                  <div className="featured-rail-card__content">
                    <p className="featured-rail-card__category">
                      {product.source_category || "Collection"}
                    </p>
                    <h3 className="featured-rail-card__name">{name}</h3>
                    <div className="featured-rail-card__price">
                      {formatPrice(product.price_amount, product.currency_code)}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}