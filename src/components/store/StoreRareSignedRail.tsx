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

export default function StoreRareSignedRail({ products, locale }: Props) {
  if (!products.length) return null;

  return (
    <section id="signed" className="rare-signed-band signed-rail-band signed-rail-band--compact">
      <div className="rare-signed-band__inner">
        <div className="rare-signed-band__head rare-signed-band__head--simple">
          <h2 className="rare-signed-band__title">
            {locale === "ar"
              ? "أعمال موقعة نادرة"
              : locale === "ku"
              ? "کارە واژۆکراوە نایابەکان"
              : "Rare signed works"}
          </h2>
        </div>

        <div className="rare-signed-band__rail rare-signed-band__rail--compact">
          {products.map((product) => {
            const name = getName(product, locale);
            const image = product.featured_image?.trim() || "";

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="rare-signed-band__card rare-signed-band__card--compact"
              >
                <div className="rare-signed-band__media rare-signed-band__media--compact">
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className="rare-signed-band__image"
                    />
                  ) : (
                    <div className="rare-signed-band__fallback">No image</div>
                  )}
                </div>

                <div className="rare-signed-band__content rare-signed-band__content--below">
                  <div className="rare-signed-band__name rare-signed-band__name--compact">
                    {name}
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