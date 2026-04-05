export function formatPrice(amount: number | null | undefined, currency = 'USD') {
  const value = Number(amount || 0)

  if (!Number.isFinite(value)) return ''

  if (currency === 'IQD') {
    return `${value.toLocaleString('en-US')} IQD`
  }

  return `$${value.toLocaleString('en-US')}`
}