import PolicyPage from '../../components/store/PolicyPage'

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="سياسة الخصوصية والكوكيز"
      meta="Privacy & Cookies • تایبەتمەندی و کوکیز"
      updatedAt="2026-02-28"
      intro="هذه السياسة توضح ما نجمعه من معلومات وكيف نستخدمها. كما تشرح ملفات الكوكيز وخيارات الموافقة/الرفض."
      blocks={[
        {
          lang: 'ar',
          label: 'العربية',
          note: 'مهم',
          content: (
            <>
              <h3>1) البيانات التي قد نجمعها</h3>
              <ul>
                <li>معلومات التواصل: الاسم، الهاتف، البريد الإلكتروني (عند الطلب/التواصل).</li>
                <li>معلومات الشحن: الدولة، المدينة، العنوان (لإتمام التوصيل).</li>
                <li>بيانات الاستخدام: الصفحات التي تزورها ووقت الزيارة (لتحسين المتجر).</li>
              </ul>

              <h3>2) كيف نستخدم البيانات</h3>
              <ul>
                <li>إتمام الطلبات وخدمة العملاء.</li>
                <li>تحسين تجربة المتجر والأداء.</li>
                <li>حماية المتجر من الاحتيال أو الاستخدام السيئ.</li>
              </ul>

              <h3>3) الكوكيز (Cookies)</h3>
              <p>
                نستخدم الكوكيز الضرورية لتشغيل المتجر، و(اختيارياً) كوكيز تحليلية تساعدنا على تطويره.
                يمكنك قبول أو رفض الكوكيز غير الضرورية من شريط الموافقة.
              </p>

              <h3>4) مشاركة البيانات</h3>
              <p>لا نبيع بياناتك. قد نشارك الحد الأدنى مع شركاء الشحن/الدفع فقط لتنفيذ الطلب.</p>
            </>
          ),
        },
        {
          lang: 'en',
          label: 'English',
          note: 'Important',
          content: (
            <>
              <h3>1) Data we may collect</h3>
              <ul>
                <li>Contact details: name, phone, email (during ordering/support).</li>
                <li>Shipping info: country, city, address (to deliver orders).</li>
                <li>Usage data: pages visited & time (to improve the store).</li>
              </ul>

              <h3>2) How we use it</h3>
              <ul>
                <li>Fulfill orders & provide customer support.</li>
                <li>Improve performance and user experience.</li>
                <li>Prevent fraud and abuse.</li>
              </ul>

              <h3>3) Cookies</h3>
              <p>
                We use necessary cookies to run the store, and optionally analytics cookies to help us improve it.
                You can accept or reject non-essential cookies via the consent bar.
              </p>

              <h3>4) Sharing</h3>
              <p>We do not sell your data. Minimal data may be shared with shipping/payment partners to fulfill your order.</p>
            </>
          ),
        },
        {
          lang: 'ku',
          label: 'کوردی (سورانی)',
          note: 'گرنگ',
          content: (
            <>
              <h3>١) زانیارییەکان کە دەکرێت کۆبکەینەوە</h3>
              <ul>
                <li>ناو، ژمارەی تەلەفۆن، ئیمەیل (لە کاتی داواکاری/یارمەتی).</li>
                <li>ناونیشانی ناردن: وڵات، شار، ناونیشان.</li>
                <li>زانیاری بەکارهێنان: ئەو لاپەڕانەی سەردان دەکەیت (بۆ باشترکردن).</li>
              </ul>

              <h3>٢) چۆن بەکاردەهێنین</h3>
              <ul>
                <li>تەواوکردنی داواکاری و خزمەتگوزاری کڕیار.</li>
                <li>باشترکردنی ئەدا و ئەزموونی بەکارهێنەر.</li>
                <li>پاراستن لە فێڵ و بەکارهێنانی خراپ.</li>
              </ul>

              <h3>٣) کوکیز</h3>
              <p>
                کوکیزی پێویست بۆ کارکردنی فرۆشگا بەکاردەهێنین، و بە هەڵبژاردە کوکیزی هەڵسەنگاندن بۆ پەرەپێدان.
                دەتوانیت لە شریتی ڕەزامەندی قبوڵ/ڕەت بکەیت.
              </p>

              <h3>٤) هاوبەشکردن</h3>
              <p>ئێمە داتاکەت نافڕۆشین. تەنها زانیاریی پێویست لەگەڵ ناردن/پارەدان هاوبەش دەکرێت بۆ تەواوکردنی داواکاری.</p>
            </>
          ),
        },
      ]}
    />
  )
}