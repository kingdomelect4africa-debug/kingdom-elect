import { prisma } from '@/lib/db'
import { uploadMedia, deleteMedia } from '@/lib/actions/admin/media'
import { PageHeader, Field, SubmitButton, inputClasses, EmptyState } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const { saved, deleted } = await searchParams
  const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <PageHeader title="Media Library" description="Upload and manage images and files used across the public site." />
      <SavedBanner saved={saved === '1'} />
      {deleted === '1' && (
        <div className="mb-6 border border-border-subtle bg-navy-50 px-4 py-3 font-sans text-sm text-ink-muted">
          File removed from the library.
        </div>
      )}

      <form action={uploadMedia} encType="multipart/form-data" className="mb-10 flex max-w-3xl flex-col gap-4 border border-border-subtle p-6">
        <h2 className="font-serif text-lg text-brand-primary">Upload File</h2>
        <Field label="File" htmlFor="file" required>
          <input id="file" name="file" type="file" required className={inputClasses} />
        </Field>
        <Field label="Alt Text" htmlFor="alt" required hint="Describes the file for accessibility and SEO.">
          <input id="alt" name="alt" required className={inputClasses} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Caption" htmlFor="caption">
            <input id="caption" name="caption" className={inputClasses} />
          </Field>
          <Field label="Credit" htmlFor="credit">
            <input id="credit" name="credit" className={inputClasses} />
          </Field>
        </div>
        <Field label="Tags" htmlFor="tags" hint="Comma-separated.">
          <input id="tags" name="tags" className={inputClasses} />
        </Field>
        <div>
          <SubmitButton>Upload</SubmitButton>
        </div>
      </form>

      {media.length === 0 ? (
        <EmptyState title="No media uploaded yet." body="Upload a file above to make it available across the site." />
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <div key={item.id} className="border border-border-subtle p-3">
              <div className="mb-3 flex h-32 items-center justify-center overflow-hidden bg-navy-50">
                {item.mimeType.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local dev uploads, plain <img> per admin media spec
                  <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
                ) : (
                  <span className="px-2 text-center font-sans text-xs text-ink-muted">{item.filename}</span>
                )}
              </div>
              <p className="truncate font-sans text-xs text-ink" title={item.filename}>{item.filename}</p>
              <p className="truncate font-sans text-xs text-ink-muted" title={item.alt}>{item.alt}</p>
              <form action={deleteMedia.bind(null, item.id)} className="mt-2">
                <button type="submit" className="font-sans text-xs uppercase text-red-700 hover:underline">Delete</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
