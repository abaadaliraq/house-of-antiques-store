"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getCart, removeFromCart, type CartItem } from "../../lib/cart";

type Locale = "ar" | "en" | "ku";

const TEXT = {
  brand: {
    ar: "بيت التحفيات",
    en: "House of Antiques",
    ku: "ماڵی تحف",
  },
  title: {
    ar: "سلة المقتنيات",
    en: "Cart",
    ku: "سەبەتەی پارچەکان",
  },
  back: {
    ar: "العودة للمتجر",
    en: "Back to store",
    ku: "گەڕانەوە بۆ فرۆشگا",
  },
  empty: {
    ar: "السلة فارغة",
    en: "Cart is empty",
    ku: "سەبەتەکە بەتاڵە",
  },
  oneOfAKind: {
    ar: "قطعة فريدة",
    en: "One of a kind",
    ku: "پارچەی تاک",
  },
  summary: {
    ar: "ملخص الطلب",
    en: "Order summary",
    ku: "پوختەی داواکاری",
  },
  items: {
    ar: "عدد القطع",
    en: "Items",
    ku: "ژمارەی پارچەکان",
  },
  total: {
    ar: "المجموع",
    en: "Total",
    ku: "کۆی گشتی",
  },
  checkout: {
    ar: "الانتقال للدفع",
    en: "Proceed to checkout",
    ku: "چوون بۆ پارەدان",
  },
};

type CartItemI18n = CartItem & {
  name_ar?: string;
  name_en?: string;
  name_ku?: string;
};

function getCartItemName(item: CartItemI18n, locale: Locale) {
  return (
    (locale === "ar" && item.name_ar) ||
    (locale === "en" && item.name_en) ||
    (locale === "ku" && item.name_ku) ||
    item.name ||
    item.name_ar ||
    item.name_en ||
    item.name_ku ||
    "Untitled"
  );
}

export default function CartPage() {
  const [items, setItems] = useState<CartItemI18n[]>([]);
  const [locale, setLocale] = useState<Locale>("ar");

  function refreshCart() {
    setItems((getCart() as CartItemI18n[]) || []);
  }

  useEffect(() => {
    refreshCart();

    try {
      const saved = localStorage.getItem("store_lang");
      if (saved === "ar" || saved === "en" || saved === "ku") {
        setLocale(saved);
      }
    } catch {}

    const handler = () => refreshCart();
    window.addEventListener("hoa-cart-updated", handler as EventListener);

    return () => {
      window.removeEventListener("hoa-cart-updated", handler as EventListener);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "ku" ? "ku" : locale;
    document.documentElement.dir = locale === "en" ? "ltr" : "rtl";
  }, [locale]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }, [items]);

  const t = {
    brand: TEXT.brand[locale],
    title: TEXT.title[locale],
    back: TEXT.back[locale],
    empty: TEXT.empty[locale],
    oneOfAKind: TEXT.oneOfAKind[locale],
    summary: TEXT.summary[locale],
    items: TEXT.items[locale],
    total: TEXT.total[locale],
    checkout: TEXT.checkout[locale],
  };

  const isEnglish = locale === "en";

  return (
    <main
      dir={isEnglish ? "ltr" : "rtl"}
      className="min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#f3eee6_100%)] px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.28em] text-black/35">
              {t.brand}
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.03em] text-black sm:text-[2.4rem]">
              {t.title}
            </h1>
          </div>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-medium text-black transition hover:bg-black hover:text-white"
          >
            {isEnglish ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            {t.back}
          </Link>
        </div>

        {!items.length ? (
          <div className="rounded-[30px] border border-black/8 bg-white p-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.05)]">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f3eee6] text-black/70">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-xl font-semibold text-black">{t.empty}</h2>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.32fr_0.68fr]">
            <section className="rounded-[30px] border border-black/8 bg-white p-4 shadow-[0_18px_60px_rgba(0,0,0,0.05)] sm:p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="grid grid-cols-[96px_1fr] gap-4 rounded-[24px] border border-black/8 bg-[#fcfaf7] p-3 sm:grid-cols-[128px_1fr] sm:p-4"
                  >
                    <div className="aspect-[0.9/1] overflow-hidden rounded-[18px] bg-[#ece4d8]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={getCartItemName(item, locale)}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold leading-7 text-black sm:text-base">
                            {getCartItemName(item, locale)}
                          </h3>

                          <p className="mt-1 text-sm text-black/50">
                            {item.price.toLocaleString()} {item.currency || "USD"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 transition hover:border-red-200 hover:text-red-600"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <div className="text-xs font-medium tracking-[0.18em] uppercase text-black/38">
                          {t.oneOfAKind}
                        </div>

                        <div className="text-sm font-semibold text-black">
                          {(item.price * item.qty).toLocaleString()}{" "}
                          {item.currency || "USD"}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="h-fit rounded-[30px] border border-black/8 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.05)] lg:sticky lg:top-6">
              <h2 className="text-[1.8rem] font-semibold tracking-[-0.03em] text-black">
                {t.summary}
              </h2>

              <div className="mt-6 space-y-3 border-y border-black/10 py-5">
                <div className="flex items-center justify-between text-sm text-black/65">
                  <span>{t.items}</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-black/65">
                  <span>{t.total}</span>
                  <span>{subtotal.toLocaleString()} USD</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[18px] bg-black px-5 text-sm font-semibold !text-white no-underline transition hover:bg-black/90"
              >
                {t.checkout}
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}