"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { clearCart, getCart, type CartItem } from "../../lib/cart";

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

const COUNTRY_CODES = [
  { code: "+964", label: "العراق (+964)" },
  { code: "+971", label: "الإمارات (+971)" },
  { code: "+966", label: "السعودية (+966)" },
  { code: "+962", label: "الأردن (+962)" },
  { code: "+965", label: "الكويت (+965)" },
  { code: "+20", label: "مصر (+20)" },
  { code: "+90", label: "تركيا (+90)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+1", label: "USA/Canada (+1)" },
];

const MASTER_CARD_NUMBER = "5355 0000 0000 0000";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
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
    setItems(getCart());
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [items]);

  const totalAmount = subtotal;
  const isInternational = form.country.trim().toLowerCase() !== "iraq";

  function setValue<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setServerError("");
  }

  function validateForm() {
    const errors: Record<string, string> = {};

    if (!form.customer_name.trim() || form.customer_name.trim().length < 3) {
      errors.customer_name = "الاسم الكامل مطلوب";
    }

    if (!isValidEmail(form.email)) {
      errors.email = "البريد الإلكتروني غير صحيح";
    }

    if (digitsOnly(form.phone_number).length < 7) {
      errors.phone_number = "رقم الهاتف ناقص أو غير صحيح";
    }

    if (!form.country.trim()) {
      errors.country = "الدولة مطلوبة";
    }

    if (!form.address.trim()) {
      errors.address = "العنوان مطلوب";
    }

    if (!items.length) {
      errors.items = "السلة فارغة";
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
      setServerError(data?.error || "فشل إرسال الطلب");
      return;
    }

    const itemsText = items
      .map(
        (item) =>
          `• ${item.name} | العدد: ${item.qty} | السعر: ${item.price.toLocaleString()} ${item.currency || "USD"}`
      )
      .join("\n");

    const paymentText =
      form.payment_method === "cod"
        ? "الدفع عند الاستلام"
        : `تحويل على بطاقة الماستر: ${MASTER_CARD_NUMBER}`;

    const whatsappMessage = encodeURIComponent(
      `طلب جديد - بيت التحفيات
رقم الطلب: ${data.orderNumber}

الاسم: ${form.customer_name}
الإيميل: ${form.email}
الهاتف: ${form.phone_country_code}${digitsOnly(form.phone_number)}
الدولة: ${form.country}
المدينة: ${form.city}
العنوان: ${form.address}

القطع:
${itemsText}

الإجمالي: ${totalAmount.toLocaleString()} USD
طريقة الدفع: ${paymentText}

ملاحظة المشتري:
${form.buyer_note || "-"}`
    );

    clearCart();
    window.location.href = `https://wa.me/9647777045599?text=${whatsappMessage}`;
  } catch (err: unknown) {
    setServerError(
      err instanceof Error ? err.message : "حدث خطأ أثناء إرسال الطلب"
    );
  } finally {
    setSubmitting(false);
  }
}
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#f3eee6_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-[12px] uppercase tracking-[0.28em] text-black/35">
            House of Antiques
          </p>
          <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.03em] text-black sm:text-[2.45rem]">
            بيانات المقتني وإتمام الطلب
          </h1>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
          <section className="rounded-[30px] border border-black/8 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.05)] sm:p-7">
            <h2 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-black">
              Guest Information
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="الاسم الكامل"
                  value={form.customer_name}
                  onChange={(v) => setValue("customer_name", v)}
                  error={fieldErrors.customer_name}
                  required
                />

                <Field
                  label="البريد الإلكتروني"
                  type="email"
                  value={form.email}
                  onChange={(v) => setValue("email", v)}
                  error={fieldErrors.email}
                  required
                />

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-black/80">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-[140px_1fr] gap-3 sm:grid-cols-[170px_1fr]">
                    <select
                      value={form.phone_country_code}
                      onChange={(e) => setValue("phone_country_code", e.target.value)}
                      className="h-14 rounded-[16px] border border-black/12 bg-[#faf7f3] px-4 text-sm text-black outline-none focus:border-black/30"
                    >
                      {COUNTRY_CODES.map((item) => (
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
                  label="الدولة"
                  value={form.country}
                  onChange={(v) => setValue("country", v)}
                  error={fieldErrors.country}
                  required
                />

                <Field
                  label="المدينة"
                  value={form.city}
                  onChange={(v) => setValue("city", v)}
                />

                <Field
                  label="العنوان"
                  value={form.address}
                  onChange={(v) => setValue("address", v)}
                  error={fieldErrors.address}
                  required
                />

                <Field
                  label="الرمز البريدي"
                  value={form.postal_code}
                  onChange={(v) => setValue("postal_code", v)}
                />
              </div>

              <div className="rounded-[24px] border border-black/8 bg-[#fbf8f4] p-4 sm:p-5">
                <h3 className="text-xl font-semibold text-black">طريقة الدفع</h3>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setValue("payment_method", "cod")}
                    className={`rounded-[18px] border px-4 py-4 text-right transition ${
                      form.payment_method === "cod"
                        ? "border-[#111] bg-[#111] text-white"
                        : "border-black/10 bg-white text-black"
                    }`}
                  >
                    <div className="text-sm font-semibold">الدفع عند الاستلام</div>
                    <div className="mt-1 text-xs opacity-75">
                      داخل العراق أو بعد الاتفاق
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue("payment_method", "mastercard")}
                    className={`rounded-[18px] border px-4 py-4 text-right transition ${
                      form.payment_method === "mastercard"
                        ? "border-[#111] bg-[#111] text-white"
                        : "border-black/10 bg-white text-black"
                    }`}
                  >
                    <div className="text-sm font-semibold">تحويل على بطاقة ماستر</div>
                    <div className="mt-1 text-xs opacity-75">
                      تحويل يدوي مؤقتًا
                    </div>
                  </button>
                </div>

                {form.payment_method === "mastercard" ? (
                  <div className="mt-4 rounded-[18px] border border-black/10 bg-white p-4">
                    <p className="text-sm text-black/60">رقم البطاقة للتحويل:</p>
                    <div className="mt-2 text-lg font-semibold tracking-[0.12em] text-black">
                      {MASTER_CARD_NUMBER}
                    </div>

                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-medium text-black/80">
                        ملاحظة التحويل
                      </label>
                      <textarea
                        value={form.mastercard_note}
                        onChange={(e) => setValue("mastercard_note", e.target.value)}
                        rows={4}
                        placeholder="اكتب اسم المحوّل أو توقيت التحويل أو أي ملاحظة"
                        className="w-full rounded-[16px] border border-black/12 bg-[#faf7f3] px-4 py-3 text-sm text-black outline-none focus:border-black/30"
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black/80">
                  ملاحظة إضافية
                </label>
                <textarea
                  value={form.buyer_note}
                  onChange={(e) => setValue("buyer_note", e.target.value)}
                  rows={4}
                  placeholder="أي تفاصيل إضافية تخص الطلب أو التسليم"
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
                {submitting ? "جارٍ إرسال الطلب..." : "تأكيد الطلب وإرساله"}
              </button>
            </form>
          </section>

          <aside className="h-fit rounded-[30px] border border-black/8 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.05)] xl:sticky xl:top-6">
            <h2 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-black">
              ملخص المقتنيات
            </h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[74px_1fr] gap-3">
                  <div className="overflow-hidden rounded-[16px] bg-[#ece3d7] aspect-square">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-6 text-black">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-black/55">
                      الكمية: {item.qty}
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
                <span>المجموع</span>
                <span>{subtotal.toLocaleString()} USD</span>
              </div>

              <div className="flex items-center justify-between text-sm text-black/65">
                <span>الشحن</span>
                <span>يُحدد لاحقًا</span>
              </div>

              <div className="flex items-center justify-between pt-1 text-lg font-semibold text-black">
                <span>إجمالي الطلب</span>
                <span>{totalAmount.toLocaleString()} USD</span>
              </div>
            </div>

            <div className="mt-6 rounded-[18px] border border-black/8 bg-[#fbf8f4] p-4 text-sm leading-7 text-black/65">
              بعد إرسال الطلب سيتم حفظه في النظام وفتح واتساب مباشرة للتواصل وتأكيد آلية الدفع والشحن.
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
  <span className="!text-white">International WhatsApp</span>
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