"use client";

type StoreStickyShowcaseProps = {
  image?: string | null;
  title?: string;
  description?: string;
};

export default function StoreStickyShowcase({
  image,
  title = "اقتناء يليق بالذائقة الرفيعة",
  description = "ليست كل قطعة للعرض فقط. بعض الأعمال خُلقت لتنتقل إلى مقتنٍ يعرف قيمتها، ويمنحها المكان الذي تستحقه داخل مجموعته الخاصة.",
}: StoreStickyShowcaseProps) {
  return (
    <section className="store-reveal store-reveal--compact">
      <div className="store-reveal__sticky">
        {image ? (
          <img src={image} alt={title} className="store-reveal__image" />
        ) : (
          <div className="store-reveal__fallback" />
        )}

        <div className="store-reveal__overlay" />
      </div>

      <div className="store-reveal__content">
        <div className="store-reveal__block store-reveal__block--right">
          <p className="store-reveal__eyebrow">For the Collector</p>
          <h2 className="store-reveal__title">{title}</h2>
          <p className="store-reveal__description">{description}</p>
        </div>
      </div>
    </section>
  );
}