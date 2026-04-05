"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getCart,
  removeFromCart,
  updateCartQty,
  type CartItem,
} from "../../lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  function refreshCart() {
    setItems(getCart());
  }

  useEffect(() => {
    refreshCart();

    const handler = () => refreshCart();
    window.addEventListener("hoa-cart-updated", handler as EventListener);

    return () => {
      window.removeEventListener("hoa-cart-updated", handler as EventListener);
    };
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }, [items]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#f3eee6_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.28em] text-black/35">
              House of Antiques
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.03em] text-black sm:text-[2.4rem]">
              سلة المقتنيات
            </h1>
          </div>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-medium text-black transition hover:bg-black hover:text-white"
          >
            <ArrowLeft size={16} />
            العودة للمتجر
          </Link>
        </div>

        {!items.length ? (
          <div className="rounded-[30px] border border-black/8 bg-white p-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.05)]">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f3eee6] text-black/70">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-xl font-semibold text-black">السلة فارغة</h2>
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
    <div className="overflow-hidden rounded-[18px] bg-[#ece4d8] aspect-[0.9/1]">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      ) : null}
    </div>

    <div className="min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-7 text-black sm:text-base">
            {item.name}
          </h3>

          <p className="mt-1 text-sm text-black/50">
            {item.price.toLocaleString()} {item.currency || "USD"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 transition hover:border-red-200 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="text-xs font-medium tracking-[0.18em] uppercase text-black/38">
          One of a kind
        </div>

        <div className="text-sm font-semibold text-black">
          {item.price.toLocaleString()} {item.currency || "USD"}
        </div>
      </div>
    </div>
  </article>
))}
              </div>
            </section>

            <aside className="h-fit rounded-[30px] border border-black/8 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.05)] lg:sticky lg:top-6">
              <h2 className="text-[1.8rem] font-semibold tracking-[-0.03em] text-black">
                ملخص الطلب
              </h2>

              <div className="mt-6 space-y-3 border-y border-black/10 py-5">
                <div className="flex items-center justify-between text-sm text-black/65">
                  <span>عدد القطع</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-black/65">
                  <span>المجموع</span>
                  <span>{subtotal.toLocaleString()} USD</span>
                </div>
              </div>

              <Link href="/checkout"
                   className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[18px] bg-black px-5 text-sm font-semibold !text-white no-underline transition hover:bg-black/90"
                          >
                   الانتقال للدفع
             </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}