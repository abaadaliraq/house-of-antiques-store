import PolicyPage from '../../components/store/PolicyPage'

export default function ShippingPage() {
  return (
    <PolicyPage
      title="سياسة الشحن"
      meta="Shipping Policy • سیاسەتی ناردن"
      updatedAt="2026-02-28"
      intro="هذه السياسة توضح الشحن داخل وخارج العراق، مدة التوصيل، وتتبع الشحنة والرسوم الجمركية."
      blocks={[
        {
          lang: 'ar',
          label: 'العربية',
          note: 'واضح',
          content: (
            <>
              <h3>الوجهات</h3>
              <p>نوفّر شحناً داخل العراق وشحناً دولياً إلى أغلب الدول حسب توفر شركة الشحن.</p>

              <h3>المدة</h3>
              <p>مدة تجهيز الطلب عادةً 1–3 أيام عمل، ومدة الشحن تختلف حسب الدولة.</p>

              <h3>التتبع</h3>
              <p>عند شحن الطلب سيتم تزويدك برقم تتبع إن توفر.</p>

              <h3>الرسوم الجمركية</h3>
              <p>أي رسوم جمركية أو ضرائب داخل بلد الوصول تكون على مسؤولية المشتري حسب قوانين دولته.</p>
            </>
          ),
        },
        {
          lang: 'en',
          label: 'English',
          note: 'Clear',
          content: (
            <>
              <h3>Destinations</h3>
              <p>We ship within Iraq and internationally to most countries, subject to carrier availability.</p>

              <h3>Time</h3>
              <p>Order processing is usually 1–3 business days. Shipping time depends on destination.</p>

              <h3>Tracking</h3>
              <p>When shipped, you’ll receive a tracking number when available.</p>

              <h3>Duties & taxes</h3>
              <p>Customs duties/taxes in the destination country are the buyer’s responsibility.</p>
            </>
          ),
        },
        {
          lang: 'ku',
          label: 'کوردی (سورانی)',
          note: 'ڕوون',
          content: (
            <>
              <h3>شوێنەکان</h3>
              <p>ناردن لە ناوخۆی عێراق و نێودەوڵەتی پێشکەش دەکەین بە پێی بەردەستبوونی کۆمپانیا.</p>

              <h3>ماوە</h3>
              <p>ئامادەکردنی داواکاری زۆرجار ١–٣ ڕۆژی کارە. ماوەی ناردن بە پێی وڵات دەگۆڕێت.</p>

              <h3>پێداچوونەوە (Tracking)</h3>
              <p>کاتێک نێردرا، ژمارەی پێداچوونەوە دەدرێت ئەگەر هەبوو.</p>

              <h3>گومرک و باج</h3>
              <p>هەر باج/گومرکێک لە وڵاتی گەیشتن، لەسەر کڕیارە.</p>
            </>
          ),
        },
      ]}
    />
  )
}