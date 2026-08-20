export function SavedBanner({ saved }: { saved: boolean }) {
  if (!saved) return null
  return (
    <div className="mb-6 border border-brand-secondary bg-emerald-50 px-4 py-3 font-sans text-sm text-brand-secondary">
      Changes saved. The public page has been updated.
    </div>
  )
}
