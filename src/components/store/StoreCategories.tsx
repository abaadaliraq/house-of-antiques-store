import { STORE_CATEGORIES, type StoreLang } from '../../lib/storeCategories'

type Props = {
  active: string
  onChange: (value: string) => void
  lang: StoreLang
}

export default function StoreCategories({ active, onChange, lang }: Props) {
  return (
    <section className="store-categories">
      <div className="store-categories__row">
        {STORE_CATEGORIES.map((category) => (
          <button
            key={category.value}
            type="button"
            className={
              active === category.value
                ? 'store-category-chip is-active'
                : 'store-category-chip'
            }
            onClick={() => onChange(category.value)}
          >
            {category.label[lang]}
          </button>
        ))}
      </div>
    </section>
  )
}