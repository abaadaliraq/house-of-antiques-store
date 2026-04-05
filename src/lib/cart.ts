export type CartItem = {
  id: string;
  slug: string;
  sku?: string | null;
  name: string;
  image: string;
  price: number;
  currency: string;
  qty: number;
};

const CART_KEY = "hoa_cart_v3";

function emitCartUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("hoa-cart-updated"));
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  emitCartUpdate();
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existing = cart.find((x) => x.id === item.id);

  if (existing) {
    existing.qty += item.qty || 1;
  } else {
    cart.push({
      ...item,
      qty: item.qty || 1,
    });
  }

  saveCart(cart);
}

export function removeFromCart(id: string) {
  const next = getCart().filter((item) => item.id !== id);
  saveCart(next);
}

export function updateCartQty(id: string, qty: number) {
  const cart = getCart();
  const target = cart.find((item) => item.id === id);

  if (!target) return;

  if (qty <= 0) {
    removeFromCart(id);
    return;
  }

  target.qty = qty;
  saveCart(cart);
}

export function clearCart() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CART_KEY);
  emitCartUpdate();
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

export function getCartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}