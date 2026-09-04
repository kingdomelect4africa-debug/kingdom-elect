const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
const monthDayFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' })
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

/** Expands a stored ISO 3166-1 country code (e.g. "NG") to its full name ("Nigeria"). */
export function countryName(code: string | null | undefined): string | null {
  if (!code) return null
  try {
    return regionNames.of(code.toUpperCase()) ?? code
  } catch {
    return code
  }
}

export function formatDate(date: Date): string {
  return dateFormatter.format(date)
}

export function formatDateRange(start: Date, end: Date): string {
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
  if (sameMonth) {
    return `${monthDayFormatter.format(start)}–${dateFormatter.format(end)}`
  }
  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
