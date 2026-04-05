"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { addToCart } from "../../lib/cart";

export type StoreLocale = "ar" | "en" | "ku";

export type StoreProduct = {
  id: string;
  sku?: string | null;
  slug: string;
  source_category?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  name_ku?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  description_ku?: string | null;
  price_amount?: number | string | null;
  currency_code?: string | null;
  featured_image?: string | null;
  is_featured?: boolean | null;
  is_available?: boolean | null;
  stock?: number | null;
  signed?: boolean | null;
  is_sensitive?: boolean | null;
};

type Props = {
  product: StoreProduct;
  locale: StoreLocale;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  productHref?: string;
};

function getName(
  product: Partial<StoreProduct> | undefined,
  locale: StoreLocale
) {
  if (!product) return "Untitled";

  return (
    (locale === "ar" && product.name_ar) ||
    (locale === "en" && product.name_en) ||
    (locale === "ku" && product.name_ku) ||
    product.name_ar ||
    product.name_en ||
    product.name_ku ||
    "Untitled"
  );
}

function getNumericPrice(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return 0;
  const numeric = typeof value === "string" ? Number(value) : value;
  return Number.isNaN(numeric) ? 0 : numeric;
}

function formatPrice(value?: number | string | null, currency?: string | null) {
  const numeric = getNumericPrice(value);
  return `${numeric.toLocaleString()} ${currency || "USD"}`;
}

function animateToCart(
  imageSrc: string | undefined,
  sourceElement: HTMLElement | null
) {
  if (!imageSrc || !sourceElement) return;

  const cartButton = document.getElementById("store-cart-button");
  if (!cartButton) return;

  const sourceRect = sourceElement.getBoundingClientRect();
  const cartRect = cartButton.getBoundingClientRect();

  const flyer = document.createElement("img");
  flyer.src = imageSrc;
  flyer.style.position = "fixed";
  flyer.style.left = `${sourceRect.left}px`;
  flyer.style.top = `${sourceRect.top}px`;
  flyer.style.width = `${sourceRect.width}px`;
  flyer.style.height = `${sourceRect.height}px`;
  flyer.style.objectFit = "cover";
  flyer.style.borderRadius = "18px";
  flyer.style.zIndex = "9999";
  flyer.style.pointerEvents = "none";
  flyer.style.transition =
    "transform 700ms cubic-bezier(0.22,1,0.36,1), opacity 700ms ease";
  flyer.style.boxShadow = "0 18px 48px rgba(0,0,0,0.18)";
  document.body.appendChild(flyer);

  requestAnimationFrame(() => {
    const translateX =
      cartRect.left -
      sourceRect.left +
      cartRect.width / 2 -
      sourceRect.width / 2;

    const translateY =
      cartRect.top -
      sourceRect.top +
      cartRect.height / 2 -
      sourceRect.height / 2;

    flyer.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.18)`;
    flyer.style.opacity = "0.2";
  });

  setTimeout(() => {
    flyer.remove();
  }, 760);
}

export default function ProductCard({
  product,
  locale,
  isFavorite = false,
  onToggleFavorite,
  productHref,
}: Props) {
  const [added, setAdded] = useState(false);
  const [revealed, setRevealed] = useState(false);

  if (!product) return null;

  const name = getName(product, locale);
  const image = product.featured_image?.trim() || "";
  const href = productHref ?? `/product/${product.slug}`;
  const numericPrice = getNumericPrice(product.price_amount);
  const price = formatPrice(product.price_amount, product.currency_code);
  const isSensitive = product.is_sensitive === true;
  const isBlurred = isSensitive && !revealed;

  function handleAddToCart(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    const card = e.currentTarget.closest(".hoa-product-card");
    const media = card?.querySelector(".hoa-product-media") as HTMLElement | null;

    addToCart({
      id: product.id,
      slug: product.slug,
      sku: product.sku || null,
      name,
      image,
      price: numericPrice,
      currency: product.currency_code || "USD",
      qty: 1,
    });

    animateToCart(image, media);

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  function handleReveal(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setRevealed(true);
  }

  return (
    <article className="hoa-product-card group relative rounded-[24px]">
      <button
        type="button"
        onClick={() => onToggleFavorite?.(product.id)}
        aria-label="Toggle favorite"
        className="absolute right-3 top-3 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/85 text-black backdrop-blur-md transition hover:bg-white"
      >
        <Heart size={15} className={isFavorite ? "fill-current" : ""} />
      </button>

      <Link href={href} className="block text-inherit no-underline">
        <div className="hoa-product-media relative overflow-hidden rounded-[22px] bg-[#eee7dc] aspect-[0.9/1.05] shadow-[0_14px_34px_rgba(0,0,0,0.06)]">
          {image ? (
            <img
              src={image}
              alt={name}
              className={[
                "h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]",
                isBlurred ? "blur-[20px] brightness-[0.68] scale-[1.04]" : "",
              ].join(" ")}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-black/35">
              No image
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent opacity-70" />

          {isBlurred ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/18 backdrop-blur-[3px] p-4">
              <div className="w-full max-w-[220px] rounded-[22px] border border-white/20 bg-black/45 px-4 py-4 text-center text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
                <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <EyeOff size={20} />
                </div>

                <div className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/70">
                  Sensitive Content
                </div>

                <div className="mt-1 text-sm font-semibold text-white">
                  Hidden Preview
                </div>

                <button
                  type="button"
                  onClick={handleReveal}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[14px] border border-white/20 bg-white text-black text-sm font-semibold transition hover:bg-white/90"
                >
                  <Eye size={16} />
                  Reveal
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </Link>

      <div className="px-1 pt-3">
        <Link href={href} className="block text-inherit no-underline">
          <h3 className="line-clamp-2 text-[14px] font-semibold leading-7 text-black">
            {name}
          </h3>
        </Link>

        <div className="mt-1 text-[14px] font-medium text-black/58">
          {price}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[16px] border px-4 text-sm font-medium transition ${
            added
              ? "border-[#111] bg-[#111] text-white"
              : "border-black/10 bg-white text-black hover:border-black/20 hover:bg-[#111] hover:text-white"
          }`}
        >
          {added ? <Check size={15} /> : <ShoppingBag size={15} />}
          {added
            ? locale === "ar"
              ? "أضيفت إلى السلة"
              : locale === "ku"
              ? "خرایە سەبەتەکە"
              : "Added to cart"
            : locale === "ar"
            ? "اقتناء القطعة"
            : locale === "ku"
            ? "زیادکردن بۆ سەبەتە"
            : "Add to cart"}
        </button>
      </div>
    </article>
  );
}