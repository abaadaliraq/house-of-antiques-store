"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { clearCart, getCart, type CartItem } from "../../lib/cart";

type Locale = "ar" | "en" | "ku";

type CartItemI18n = CartItem & {
  name_ar?: string;
  name_en?: string;
  name_ku?: string;
};

type FormState = {
  customer_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  country: string;
  city: string;
  address: string;
  postal_code: string;
  payment_method: "cod" | "mastercard";
  mastercard_note: string;
  buyer_note: string;
};

const MASTER_CARD_NUMBER = "7146148577";

const COUNTRY_CODES = {
  ar: [
    { code: "+964", label: "العراق (+964)" },
    { code: "+971", label: "الإمارات (+971)" },
    { code: "+966", label: "السعودية (+966)" },
    { code: "+962", label: "الأردن (+962)" },
    { code: "+965", label: "الكويت (+965)" },
    { code: "+20", label: "مصر (+20)" },
    { code: "+90", label: "تركيا (+90)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+1", label: "USA/Canada (+1)" },
  ],
  en: [
    { code: "+964", label: "Iraq (+964)" },
    { code: "+971", label: "UAE (+971)" },
    { code: "+966", label: "Saudi Arabia (+966)" },
    { code: "+962", label: "Jordan (+962)" },
    { code: "+965", label: "Kuwait (+965)" },
    { code: "+20", label: "Egypt (+20)" },
    { code: "+90", label: "Turkey (+90)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+1", label: "USA/Canada (+1)" },
  ],
  ku: [
    { code: "+964", label: "عێراق (+964)" },
    { code: "+971", label: "ئیماڕات (+971)" },
    { code: "+966", label: "سعوودیە (+966)" },
    { code: "+962", label: "ئوردون (+962)" },
    { code: "+965", label: "کوەیت (+965)" },
    { code: "+20", label: "میسر (+20)" },
    { code: "+90", label: "تورکیا (+90)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+1", label: "USA/Canada (+1)" },
  ],
};

const TEXT = {
  brand: {
    ar: "بيت التحفيات",
    en: "House of Antiques",
    ku: "ماڵی تحف",
  },
  pageTitle: {
    ar: "بيانات المقتني وإتمام الطلب",
    en: "Collector details and checkout",
    ku: "زانیاری کڕیار و تەواوکردنی داواکاری",
  },
  guestInfo: {
    ar: "بيانات المقتني",
    en: "Guest Information",
    ku: "زانیاری کڕیار",
  },
  fullName: {
    ar: "الاسم الكامل",
    en: "Full name",
    ku: "ناوی تەواو",
  },
  email: {
    ar: "البريد الإلكتروني",
    en: "Email",
    ku: "ئیمەیڵ",
  },
  phone: {
    ar: "رقم الهاتف",
    en: "Phone number",
    ku: "ژمارەی مۆبایل",
  },
  country: {
    ar: "الدولة",
    en: "Country",
    ku: "وڵات",
  },
  city: {
    ar: "المدينة",
    en: "City",
    ku: "شار",
  },
  address: {
    ar: "العنوان",
    en: "Address",
    ku: "ناونیشان",
  },
  postalCode: {
    ar: "الرمز البريدي",
    en: "Postal code",
    ku: "کۆدی پۆست",
  },
  paymentMethod: {
    ar: "طريقة الدفع",
    en: "Payment method",
    ku: "شێوازی پارەدان",
  },
  cod: {
    ar: "الدفع عند الاستلام",
    en: "Cash on delivery",
    ku: "پارەدان لە کاتی وەرگرتن",
  },
  codNote: {
    ar: "داخل العراق أو بعد الاتفاق",
    en: "Inside Iraq or by agreement",
    ku: "لە ناو عێراق یان دوای ڕێککەوتن",
  },
  mastercard: {
    ar: "تحويل على بطاقة ماستر",
    en: "Mastercard transfer",
    ku: "گواستنەوە بۆ ماستەرکارد",
  },
  mastercardNoteShort: {
    ar: "تحويل يدوي مؤقتًا",
    en: "Temporary manual transfer",
    ku: "گواستنەوەی دەستی کاتی",
  },
  transferCardNumber: {
    ar: "رقم البطاقة للتحويل:",
    en: "Card number for transfer:",
    ku: "ژمارەی کارت بۆ گواستنەوە:",
  },
  transferNote: {
    ar: "ملاحظة التحويل",
    en: "Transfer note",
    ku: "تێبینی گواستنەوە",
  },
  transferPlaceholder: {
    ar: "اكتب اسم المحوّل أو توقيت التحويل أو أي ملاحظة",
    en: "Write the sender name, transfer time, or any note",
    ku: "ناوی نێرەر یان کاتی گواستنەوە یان هەر تێبینییەک بنووسە",
  },
  extraNote: {
    ar: "ملاحظة إضافية",
    en: "Additional note",
    ku: "تێبینی زیاتر",
  },
  extraNotePlaceholder: {
    ar: "أي تفاصيل إضافية تخص الطلب أو التسليم",
    en: "Any extra details related to the order or delivery",
    ku: "هەر زانیارییەکی زیادە سەبارەت بە داواکاری یان گەیاندن",
  },
  submit: {
    ar: "تأكيد الطلب وإرساله",
    en: "Confirm and send order",
    ku: "دووپاتکردنەوە و ناردنی داواکاری",
  },
  submitting: {
    ar: "جارٍ إرسال الطلب...",
    en: "Sending order...",
    ku: "داواکاری دەنێردرێت...",
  },
  collectionSummary: {
    ar: "ملخص المقتنيات",
    en: "Collection summary",
    ku: "پوختەی پارچەکان",
  },
  qty: {
    ar: "الكمية",
    en: "Qty",
    ku: "دانە",
  },
  subtotal: {
    ar: "المجموع",
    en: "Subtotal",
    ku: "کۆی گشتی",
  },
  shipping: {
    ar: "الشحن",
    en: "Shipping",
    ku: "گەیاندن",
  },
  shippingLater: {
    ar: "يُحدد لاحقًا",
    en: "To be confirmed later",
    ku: "دواتر دیاری دەکرێت",
  },
  finalTotal: {
    ar: "إجمالي الطلب",
    en: "Order total",
    ku: "کۆی داواکاری",
  },
  footerNote: {
    ar: "بعد إرسال الطلب سيتم حفظه في النظام وفتح واتساب مباشرة للتواصل وتأكيد آلية الدفع والشحن.",
    en: "After submitting, the order will be saved in the system and WhatsApp will open directly to confirm payment and shipping.",
    ku: "دوای ناردنی داواکاری، لە سیستەمدا پاشەکەوت دەکرێت و واتساپ ڕاستەوخۆ دەکرێتەوە بۆ پشتڕاستکردنەوەی پارەدان و گەیاندن.",
  },
  intlWhatsapp: {
    ar: "واتساب دولي",
    en: "International WhatsApp",
    ku: "واتساپی نێودەوڵەتی",
  },
  requiredName: {
    ar: "الاسم الكامل مطلوب",
    en: "Full name is required",
    ku: "ناوی تەواو پێویستە",
  },
  invalidEmail: {
    ar: "البريد الإلكتروني غير صحيح",
    en: "Invalid email address",
    ku: "ئیمەیڵ دروست نییە",
  },
  invalidPhone: {
    ar: "رقم الهاتف ناقص أو غير صحيح",
    en: "Phone number is incomplete or invalid",
    ku: "ژمارەی مۆبایل ناتەواوە یان هەڵەیە",
  },
  requiredCountry: {
    ar: "الدولة مطلوبة",
    en: "Country is required",
    ku: "وڵات پێویستە",
  },
  requiredAddress: {
    ar: "العنوان مطلوب",
    en: "Address is required",
    ku: "ناونیشان پێویستە",
  },
  emptyCart: {
    ar: "السلة فارغة",
    en: "Cart is empty",
    ku: "سەبەتەکە بەتاڵە",
  },
  submitFailed: {
    ar: "فشل إرسال الطلب",
    en: "Failed to send order",
    ku: "ناردنی داواکاری سەرکەوتوو نەبوو",
  },
  genericError: {
    ar: "حدث خطأ أثناء إرسال الطلب",
    en: "An error occurred while sending the order",
    ku: "هەڵەیەک ڕوویدا لە کاتی ناردنی داواکاری",
  },
  whatsappHello: {
    ar: "طلب جديد - بيت التحفيات",
    en: "New order - House of Antiques",
    ku: "داواکاری نوێ - ماڵی تحف",
  },
  orderNumber: {
    ar: "رقم الطلب",
    en: "Order number",
    ku: "ژمارەی داواکاری",
  },
  buyerName: {
    ar: "الاسم",
    en: "Name",
    ku: "ناو",
  },
  buyerEmail: {
    ar: "الإيميل",
    en: "Email",
    ku: "ئیمەیڵ",
  },
  buyerPhone: {
    ar: "الهاتف",
    en: "Phone",
    ku: "مۆبایل",
  },
  buyerCountry: {
    ar: "الدولة",
    en: "Country",
    ku: "وڵات",
  },
  buyerCity: {
    ar: "المدينة",
    en: "City",
    ku: "شار",
  },
  buyerAddress: {
    ar: "العنوان",
    en: "Address",
    ku: "ناونیشان",
  },
  pieces: {
    ar: "القطع",
    en: "Items",
    ku: "پارچەکان",
  },
  payment: {
    ar: "طريقة الدفع",
    en: "Payment method",
    ku: "شێوازی پارەدان",
  },
  buyerNoteLabel: {
    ar: "ملاحظة المشتري",
    en: "Buyer note",
    ku: "تێبینی کڕیار",
  },
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function isIraqCountry(value: string) {
  const normalized = value.trim().toLowerCase();
  return (
    normalized === "iraq" ||
    normalized === "العراق" ||
    normalized === "عێراق" ||
    normalized.includes("iraq") ||
    normalized.includes("العراق") ||
    normalized.includes("عێراق")
  );
}

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

function t(locale: Locale, key: keyof typeof TEXT) {
  return TEXT[key][locale];
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItemI18n[]>([]);
  const [locale, setLocale] = useState<Locale>("ar");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormState>({
    customer_name: "",
    email: "",
    phone_country_code: "+964",
    phone_number: "",
    country: "Iraq",
    city: "Baghdad",
    address: "",
    postal_code: "",
    payment_method: "cod",
    mastercard_note: "",
    buyer_note: "",
  });

  useEffect(() => {
    setItems((getCart() as CartItemI18n[]) || []);

    try {
      const saved = localStorage.getItem("store_lang");
      if (saved === "ar" || saved === "en" || saved === "ku") {
        setLocale(saved);
      }
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "ku" ? "ku" : locale;
    document.documentElement.dir = locale === "en" ? "ltr" : "rtl";
  }, [locale]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [items]);

  const totalAmount = subtotal;
  const isInternational = !isIraqCountry(form.country);
  const countryCodes = COUNTRY_CODES[locale];
  const isEnglish = locale === "en";

  function setValue<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setServerError("");
  }

  function validateForm() {
    const errors: Record<string, string> = {};

    if (!form.customer_name.trim() || form.customer_name.trim().length < 3) {
      errors.customer_name = t(locale, "requiredName");
    }

    if (!isValidEmail(form.email)) {
      errors.email = t(locale, "invalidEmail");
    }

    if (digitsOnly(form.phone_number).length < 7) {
      errors.phone_number = t(locale, "invalidPhone");
    }

    if (!form.country.trim()) {
      errors.country = t(locale, "requiredCountry");
    }

    if (!form.address.trim()) {
      errors.address = t(locale, "requiredAddress");
    }

    if (!items.length) {
      errors.items = t(locale, "emptyCart");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setServerError("");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          items,
          subtotal,
          shipping_amount: 0,
          total_amount: totalAmount,
          currency_code: "USD",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data?.error || t(locale, "submitFailed"));
        return;
      }

      const itemsText = items
        .map(
          (item) =>
            `• ${getCartItemName(item, locale)} | ${t(locale, "qty")}: ${item.qty} | ${t(locale, "subtotal")}: ${(item.price * item.qty).toLocaleString()} ${item.currency || "USD"}`
        )
        .join("\n");

      const paymentText =
        form.payment_method === "cod"
          ? t(locale, "cod")
          : `${t(locale, "mastercard")}: ${MASTER_CARD_NUMBER}`;

      const whatsappMessage = encodeURIComponent(
        `${t(locale, "whatsappHello")}
${t(locale, "orderNumber")}: ${data.orderNumber}

${t(locale, "buyerName")}: ${form.customer_name}
${t(locale, "buyerEmail")}: ${form.email}
${t(locale, "buyerPhone")}: ${form.phone_country_code}${digitsOnly(form.phone_number)}
${t(locale, "buyerCountry")}: ${form.country}
${t(locale, "buyerCity")}: ${form.city}
${t(locale, "buyerAddress")}: ${form.address}

${t(locale, "pieces")}:
${itemsText}

${t(locale, "finalTotal")}: ${totalAmount.toLocaleString()} USD
${t(locale, "payment")}: ${paymentText}

${t(locale, "buyerNoteLabel")}:
${form.buyer_note || "-"}`
      );

      clearCart();
      window.location.href = `https://wa.me/9647777045599?text=${whatsappMessage}`;
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : t(locale, "genericError")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      dir={isEnglish ? "ltr" : "rtl"}
      className="min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#f3eee6_100%)] px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-[12px] uppercase tracking-[0.28em] text-black/35">
            {t(locale, "brand")}
          </p>
          <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.03em] text-black sm:text-[2.45rem]">
            {t(locale, "pageTitle")}
          </h1>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
          <section className="rounded-[30px] border border-black/8 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.05)] sm:p-7">
            <h2 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-black">
              {t(locale, "guestInfo")}
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label={t(locale, "fullName")}
                  value={form.customer_name}
                  onChange={(v) => setValue("customer_name", v)}
                  error={fieldErrors.customer_name}
                  required
                />

                <Field
                  label={t(locale, "email")}
                  type="email"
                  value={form.email}
                  onChange={(v) => setValue("email", v)}
                  error={fieldErrors.email}
                  required
                />

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-black/80">
                    {t(locale, "phone")} <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-[140px_1fr] gap-3 sm:grid-cols-[170px_1fr]">
                    <select
                      value={form.phone_country_code}
                      onChange={(e) =>
                        setValue("phone_country_code", e.target.value)
                      }
                      className="h-14 rounded-[16px] border border-black/12 bg-[#faf7f3] px-4 text-sm text-black outline-none focus:border-black/30"
                    >
                      {countryCodes.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.label}
                        </option>
                      ))}
                    </select>

                    <input
                      value={form.phone_number}
                      onChange={(e) =>
                        setValue("phone_number", digitsOnly(e.target.value))
                      }
                      placeholder="7xxxxxxxx"
                      className={`h-14 rounded-[16px] border bg-[#faf7f3] px-4 text-sm text-black outline-none ${
                        fieldErrors.phone_number
                          ? "border-red-300"
                          : "border-black/12 focus:border-black/30"
                      }`}
                    />
                  </div>

                  {fieldErrors.phone_number ? (
                    <p className="mt-2 text-xs text-red-600">
                      {fieldErrors.phone_number}
                    </p>
                  ) : null}
                </div>

                <Field
                  label={t(locale, "country")}
                  value={form.country}
                  onChange={(v) => setValue("country", v)}
                  error={fieldErrors.country}
                  required
                />

                <Field
                  label={t(locale, "city")}
                  value={form.city}
                  onChange={(v) => setValue("city", v)}
                />

                <Field
                  label={t(locale, "address")}
                  value={form.address}
                  onChange={(v) => setValue("address", v)}
                  error={fieldErrors.address}
                  required
                />

                <Field
                  label={t(locale, "postalCode")}
                  value={form.postal_code}
                  onChange={(v) => setValue("postal_code", v)}
                />
              </div>

              <div className="rounded-[24px] border border-black/8 bg-[#fbf8f4] p-4 sm:p-5">
                <h3 className="text-xl font-semibold text-black">
                  {t(locale, "paymentMethod")}
                </h3>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setValue("payment_method", "cod")}
                    className={`rounded-[18px] border px-4 py-4 transition ${
                      form.payment_method === "cod"
                        ? "border-[#111] bg-[#111] text-white"
                        : "border-black/10 bg-white text-black"
                    } ${isEnglish ? "text-left" : "text-right"}`}
                  >
                    <div className="text-sm font-semibold">
                      {t(locale, "cod")}
                    </div>
                    <div className="mt-1 text-xs opacity-75">
                      {t(locale, "codNote")}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue("payment_method", "mastercard")}
                    className={`rounded-[18px] border px-4 py-4 transition ${
                      form.payment_method === "mastercard"
                        ? "border-[#111] bg-[#111] text-white"
                        : "border-black/10 bg-white text-black"
                    } ${isEnglish ? "text-left" : "text-right"}`}
                  >
                    <div className="text-sm font-semibold">
                      {t(locale, "mastercard")}
                    </div>
                    <div className="mt-1 text-xs opacity-75">
                      {t(locale, "mastercardNoteShort")}
                    </div>
                  </button>
                </div>

                {form.payment_method === "mastercard" ? (
                  <div className="mt-4 rounded-[18px] border border-black/10 bg-white p-4">
                    <p className="text-sm text-black/60">
                      {t(locale, "transferCardNumber")}
                    </p>
                    <div className="mt-2 text-lg font-semibold tracking-[0.12em] text-black">
                      {MASTER_CARD_NUMBER}
                    </div>

                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-medium text-black/80">
                        {t(locale, "transferNote")}
                      </label>
                      <textarea
                        value={form.mastercard_note}
                        onChange={(e) =>
                          setValue("mastercard_note", e.target.value)
                        }
                        rows={4}
                        placeholder={t(locale, "transferPlaceholder")}
                        className="w-full rounded-[16px] border border-black/12 bg-[#faf7f3] px-4 py-3 text-sm text-black outline-none focus:border-black/30"
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black/80">
                  {t(locale, "extraNote")}
                </label>
                <textarea
                  value={form.buyer_note}
                  onChange={(e) => setValue("buyer_note", e.target.value)}
                  rows={4}
                  placeholder={t(locale, "extraNotePlaceholder")}
                  className="w-full rounded-[16px] border border-black/12 bg-[#faf7f3] px-4 py-3 text-sm text-black outline-none focus:border-black/30"
                />
              </div>

              {fieldErrors.items ? (
                <p className="text-sm text-red-600">{fieldErrors.items}</p>
              ) : null}

              {serverError ? (
                <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {serverError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-14 w-full items-center justify-center rounded-[18px] bg-black px-6 text-sm font-medium text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? t(locale, "submitting") : t(locale, "submit")}
              </button>
            </form>
          </section>

          <aside className="h-fit rounded-[30px] border border-black/8 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.05)] xl:sticky xl:top-6">
            <h2 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-black">
              {t(locale, "collectionSummary")}
            </h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[74px_1fr] gap-3">
                  <div className="aspect-square overflow-hidden rounded-[16px] bg-[#ece3d7]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={getCartItemName(item, locale)}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-6 text-black">
                      {getCartItemName(item, locale)}
                    </h3>
                    <p className="mt-1 text-xs text-black/55">
                      {t(locale, "qty")}: {item.qty}
                    </p>
                    <p className="mt-2 text-sm font-medium text-black">
                      {(item.price * item.qty).toLocaleString()} {item.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-black/10 pt-5">
              <div className="flex items-center justify-between text-sm text-black/65">
                <span>{t(locale, "subtotal")}</span>
                <span>{subtotal.toLocaleString()} USD</span>
              </div>

              <div className="flex items-center justify-between text-sm text-black/65">
                <span>{t(locale, "shipping")}</span>
                <span>{t(locale, "shippingLater")}</span>
              </div>

              <div className="flex items-center justify-between pt-1 text-lg font-semibold text-black">
                <span>{t(locale, "finalTotal")}</span>
                <span>{totalAmount.toLocaleString()} USD</span>
              </div>
            </div>

            <div className="mt-6 rounded-[18px] border border-black/8 bg-[#fbf8f4] p-4 text-sm leading-7 text-black/65">
              {t(locale, "footerNote")}
            </div>
          </aside>
        </div>
      </div>

      {isInternational ? (
        <a
          href="https://wa.me/9647777045599?text=Hello%20House%20of%20Antiques%2C%20I%20am%20interested%20in%20an%20international%20purchase."
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#111] px-4 py-3 text-sm font-semibold !text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:scale-[1.02] hover:bg-[#1d1d1d]"
        >
          <MessageCircle size={17} className="shrink-0 !text-white" />
          <span className="!text-white">{t(locale, "intlWhatsapp")}</span>
        </a>
      ) : null}
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-black/80">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-14 w-full rounded-[16px] border bg-[#faf7f3] px-4 text-sm text-black outline-none transition ${
          error ? "border-red-300" : "border-black/12 focus:border-black/30"
        }`}
      />

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}