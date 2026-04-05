"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Search, ShoppingBag, Globe2, Menu, X } from "lucide-react";
import { getCartCount } from "../../lib/cart";

type StoreTopbarProps = {
  brand?: string;
  langLabel?: string;
  isMenuOpen?: boolean;
  favoritesOnly?: boolean;
  onMenuClick?: () => void;
  onLanguageToggle?: () => void;
  onSearchClick?: () => void;
  onFavoritesClick?: () => void;
  cartHref?: string;
  homeHref?: string;
};

export default function StoreTopbar({
  brand = "بيت التحفيات",
  langLabel = "AR",
  isMenuOpen = false,
  favoritesOnly = false,
  onMenuClick,
  onLanguageToggle,
  onSearchClick,
  onFavoritesClick,
  cartHref = "/cart",
  homeHref = "/",
}: StoreTopbarProps) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCartCount(getCartCount());

    refresh();
    window.addEventListener("hoa-cart-updated", refresh as EventListener);

    return () => {
      window.removeEventListener("hoa-cart-updated", refresh as EventListener);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-6 lg:px-8">
        <div className="store-topbar-one-line">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="store-topbar-btn"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <button
            type="button"
            onClick={onLanguageToggle}
            aria-label="Toggle language"
            className="store-topbar-lang gap-1.5"
          >
            <Globe2 size={15} />
            <span>{langLabel}</span>
          </button>

          <Link href={homeHref} className="store-topbar-brandCenter">
            <span className="store-topbar-kicker">Museum Store</span>
            <span className="store-topbar-brandText">{brand}</span>
          </Link>

          <button
            type="button"
            onClick={onFavoritesClick}
            aria-label="Favorites"
            className={`store-topbar-btn ${favoritesOnly ? "is-active" : ""}`}
          >
            <Heart size={18} className={favoritesOnly ? "fill-current" : ""} />
          </button>

          <button
            type="button"
            onClick={onSearchClick}
            aria-label="Search"
            className="store-topbar-btn"
          >
            <Search size={18} />
          </button>

          <Link
            href={cartHref}
            aria-label="Cart"
            className="store-topbar-btn relative"
            id="store-cart-button"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#8f121c] px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}