import PolicyPage from '../../components/store/PolicyPage'

export default function TermsPage() {
  return (
    <PolicyPage
      title="الشروط والأحكام"
      meta="Terms & Conditions • یاسا و مەرج"
      updatedAt="2026-02-28"
      intro="باستخدامك لهذا المتجر فأنت توافق على الشروط أدناه. الهدف حماية المشتري والمتجر، خصوصاً لأننا نتعامل مع قطع فريدة."
      blocks={[
        {
          lang: 'ar',
          label: 'العربية',
          note: 'مختصر',
          content: (
            <>
              <h3>1) طبيعة القطع</h3>
              <p>معظم القطع فريدة (One-of-a-kind) وقد تكون عليها آثار عمر/استخدام طبيعي. نحن نوثق الحالة بالصور والوصف.</p>

              <h3>2) توفر القطع</h3>
              <p>عند ظهور عبارة <strong>تم اقتناؤها</strong> فهذا يعني أن القطعة غير متاحة للبيع.</p>

              <h3>3) الأسعار</h3>
              <p>الأسعار قابلة للتحديث. السعر النهائي هو الظاهر وقت إتمام الطلب.</p>

              <h3>4) الطلب والدفع</h3>
              <p>لا يعتبر الطلب مؤكداً إلا بعد إتمام الدفع/التأكيد حسب آلية المتجر.</p>

              <h3>5) المحتوى والملكية</h3>
              <p>الصور والمحتوى ملك لبيت التحفيات ولا يجوز إعادة استخدامه دون إذن.</p>
            </>
          ),
        },
        {
          lang: 'en',
          label: 'English',
          note: 'Short',
          content: (
            <>
              <h3>1) Item nature</h3>
              <p>Most items are one-of-a-kind and may show normal age wear. We document condition via photos & description.</p>

              <h3>2) Availability</h3>
              <p>If an item is marked <strong>Acquired</strong>, it is not available for purchase.</p>

              <h3>3) Pricing</h3>
              <p>Prices may change. The final price is what appears at checkout time.</p>

              <h3>4) Orders & payment</h3>
              <p>An order is confirmed only after payment/confirmation based on the store flow.</p>

              <h3>5) Content ownership</h3>
              <p>All photos/content belong to House of Antiques and may not be reused without permission.</p>
            </>
          ),
        },
        {
          lang: 'ku',
          label: 'کوردی (سورانی)',
          note: 'کورتی',
          content: (
            <>
              <h3>١) جۆری کاڵا</h3>
              <p>زۆربەی کاڵاکان تاکەن و نیشانەی تەمەن/بەکارهێنان هەبێت. دۆخەکە بە وێنە و وەسف ڕوون دەکەین.</p>

              <h3>٢) بەردەستبوون</h3>
              <p>ئەگەر نووسرا <strong>تم اقتناؤها</strong> واتە کاڵا نەماوە بۆ فرۆشتن.</p>

              <h3>٣) نرخ</h3>
              <p>نرخ دەتوانێت بگۆڕێت. نرخەکەی کۆتایی ئەوەیە کە لە کاتی داواکاری دەردەکەوێت.</p>

              <h3>٤) داواکاری و پارەدان</h3>
              <p>داواکاری تەنها دوای پارەدان/پشتڕاستکردنەوە قبوڵ دەبێت.</p>

              <h3>٥) مافی مادی و وێنەکان</h3>
              <p>هەموو وێنە و ناوەڕۆک مافی بیت التحفیاتە و بەبێ مۆڵەت بەکارنەهێنرێت.</p>
            </>
          ),
        },
      ]}
    />
  )
}