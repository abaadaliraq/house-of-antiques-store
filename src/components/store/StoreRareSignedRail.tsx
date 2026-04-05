"use client";

import Link from "next/link";
import type { StoreLocale, StoreProduct } from "./ProductCard";

type Props = {
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

export default function StoreRareSignedRail({ products, locale }: Props) {
  if (!products.length) return null;

  return (
    <section id="signed" className="rare-signed-band">
      <div className="rare-signed-band__inner">
        <div className="rare-signed-band__head">
          <p className="rare-signed-band__kicker">
            {locale === "ar"
              ? "منتقى خاص"
              : locale === "ku"
              ? "هەڵبژاردنی تایبەت"
              : "Special selection"}
          </p>

          <h2 className="rare-signed-band__title">
            {locale === "ar"
              ? "أعمال موقعة نادرة"
              : locale === "ku"
              ? "کارە واژۆکراوە نایابەکان"
              : "Rare signed works"}
          </h2>
        </div>

        <div className="rare-signed-band__rail">
          {products.map((product) => {
            const name = getName(product, locale);
            const image = product.featured_image?.trim() || "";

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="rare-signed-band__card"
              >
                <div className="rare-signed-band__media">
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className="rare-signed-band__image"
                    />
                  ) : (
                    <div className="rare-signed-band__fallback">No image</div>
                  )}

                  <div className="rare-signed-band__overlay" />

                  <div className="rare-signed-band__content">
                    <div className="rare-signed-band__name">{name}</div>
                    <div className="rare-signed-band__price">
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