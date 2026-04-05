export const STORE_CATEGORIES = [
  {
    value: 'all',
    label: {
      ar: 'الكل',
      en: 'All',
      ku: 'هەموو',
    },
  },
  {
    value: 'accessories',
    label: {
      ar: 'اكسسوارات',
      en: 'Accessories',
      ku: 'ئاکسسوارات',
    },
  },
  {
    value: 'silver',
    label: {
      ar: 'فضة',
      en: 'Silver',
      ku: 'زیو',
    },
  },
  {
    value: 'copper',
    label: {
      ar: 'نحاس',
      en: 'Copper',
      ku: 'مەس',
    },
  },
  {
    value: 'artworks',
    label: {
      ar: 'اعمال فنية',
      en: 'Artworks',
      ku: 'کارە هونەرییەکان',
    },
  },
  {
    value: 'paintings',
    label: {
      ar: 'لوحات',
      en: 'Paintings',
      ku: 'تابلۆکان',
    },
  },
  {
    value: 'arabic_calligraphy',
    label: {
      ar: 'خطوط عربية',
      en: 'Arabic Calligraphy',
      ku: 'خەتاطیی عەرەبی',
    },
  },
  {
    value: 'carpets',
    label: {
      ar: 'سجاد',
      en: 'Carpets',
      ku: 'فەڕش',
    },
  },
  {
    value: 'crystal',
    label: {
      ar: 'كريستال',
      en: 'Crystal',
      ku: 'کریستاڵ',
    },
  },
  {
    value: 'furniture',
    label: {
      ar: 'اثاث',
      en: 'Furniture',
      ku: 'کەلوپەلی ناوماڵ',
    },
  },
  {
    value: 'wood',
    label: {
      ar: 'خشب',
      en: 'Wood',
      ku: 'دار',
    },
  },
  {
    value: 'vases',
    label: {
      ar: 'فازات',
      en: 'Vases',
      ku: 'گڵدان',
    },
  },
] as const

export type StoreLang = 'ar' | 'en' | 'ku'