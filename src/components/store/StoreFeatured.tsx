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

export default function StoreFeatured({
  products,
  locale,
}: StoreFeaturedProps) {
  if (!products.length) return null;

  return (
    <section id="featured" className="featured-rail-section featured-rail-band">
      <div className="featured-rail-section__head featured-rail-section__head--simple">
        <h2 className="featured-rail-section__title">
          {locale === "ar"
            ? "القطع المميزة"
            : locale === "ku"
            ? "پارچە تایبەتەکان"
            : "Featured pieces"}
        </h2>
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
                className="featured-rail-card featured-rail-card--compact"
              >
                <div className="featured-rail-card__media featured-rail-card__media--compact">
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className="featured-rail-card__image"
                    />
                  ) : (
                    <div className="featured-rail-card__fallback">No image</div>
                  )}
                </div>

                <div className="featured-rail-card__content featured-rail-card__content--below">
                  <h3 className="featured-rail-card__name featured-rail-card__name--compact">
                    {name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}