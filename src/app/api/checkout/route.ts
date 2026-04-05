import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

type CheckoutItem = {
  id?: string;
  slug?: string;
  sku?: string | null;
  name?: string;
  image?: string;
  price?: number;
  currency?: string;
  qty?: number;
};

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error:
            "Supabase environment variables are missing. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();

    const {
      customer_name,
      email,
      phone_country_code,
      phone_number,
      country,
      city,
      address,
      postal_code,
      payment_method,
      mastercard_note,
      buyer_note,
      items,
      subtotal,
      shipping_amount,
      total_amount,
      currency_code,
    } = body as {
      customer_name?: string;
      email?: string;
      phone_country_code?: string;
      phone_number?: string;
      country?: string;
      city?: string;
      address?: string;
      postal_code?: string;
      payment_method?: string;
      mastercard_note?: string;
      buyer_note?: string;
      items?: CheckoutItem[];
      subtotal?: number | string;
      shipping_amount?: number | string;
      total_amount?: number | string;
      currency_code?: string;
    };

    if (!customer_name || customer_name.trim().length < 3) {
      return NextResponse.json({ error: "الاسم غير مكتمل" }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صحيح" },
        { status: 400 }
      );
    }

    const cleanPhone = digitsOnly(phone_number || "");
    if (cleanPhone.length < 7) {
      return NextResponse.json(
        { error: "رقم الهاتف غير مكتمل" },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
    }

    if (!["cod", "mastercard"].includes(payment_method || "")) {
      return NextResponse.json(
        { error: "طريقة الدفع غير صحيحة" },
        { status: 400 }
      );
    }

    const fullWhatsapp = `${phone_country_code || "+964"}${cleanPhone}`;

    const itemCodes = items.map((item) => item.sku || "-").join(" | ");
    const itemTitles = items.map((item) => item.name || "-").join(" | ");

    const payload = {
      customer_name: customer_name.trim(),
      email: email.trim(),
      phone_country_code: phone_country_code || "+964",
      phone_number: cleanPhone,
      whatsapp_full: fullWhatsapp,
      country: country || "Iraq",
      city: city || null,
      address: address || null,
      postal_code: postal_code || null,
      payment_method,
      mastercard_note:
        payment_method === "mastercard" ? mastercard_note || null : null,
      buyer_note: buyer_note || null,
      items,
      item_codes: itemCodes,
      item_titles: itemTitles,
      subtotal: Number(subtotal || 0),
      shipping_amount: Number(shipping_amount || 0),
      total_amount: Number(total_amount || 0),
      currency_code: currency_code || "USD",
      status: "new",
      source: "website",
    };

    const { data: inserted, error: insertError } = await supabase
      .from("orders")
      .insert(payload)
      .select()
      .single();

    if (insertError || !inserted) {
      return NextResponse.json(
        {
          error: `Supabase insert failed: ${
            insertError?.message || "Unknown insert error"
          }`,
        },
        { status: 500 }
      );
    }

    const orderSerial = inserted.order_serial;
    const orderNumber = `HOA-${orderSerial}`;

    const { error: updateError } = await supabase
      .from("orders")
      .update({ order_number: orderNumber })
      .eq("id", inserted.id);

    if (updateError) {
      return NextResponse.json(
        {
          error: `Order number update failed: ${updateError.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      orderNumber,
      whatsappFull: fullWhatsapp,
      order: {
        ...inserted,
        order_number: orderNumber,
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown server error";

    return NextResponse.json(
      {
        error: `Server error: ${message}`,
      },
      { status: 500 }
    );
  }
}