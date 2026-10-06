'use client'

import { useRef, useState } from 'react'
import { inputClasses } from '@/components/admin/ui'

const buttonClasses =
  'shrink-0 border border-brand-primary px-4 py-2.5 font-sans text-xs font-semibold uppercase text-brand-primary hover:bg-navy-50'

export function ShareLink({ url, label }: { url: string; label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API needs a secure context — fall back to selecting the text
      // so a manual Cmd/Ctrl+C still works.
      inputRef.current?.select()
    }
  }

  return (
    <div>
      {label && <p className="mb-1.5 font-sans text-xs text-ink-muted">{label}</p>}
      <div className="flex flex-wrap gap-2 sm:flex-nowrap">
        <input
          ref={inputRef}
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          aria-label={label ? `Link for ${label}` : 'Form link'}
          className={`${inputClasses} min-w-0 flex-1`}
        />
        <button type="button" onClick={copy} className={buttonClasses} style={{ letterSpacing: '0.06em' }}>
          {copied ? 'Copied' : 'Copy'}
        </button>
        <a href={url} target="_blank" rel="noreferrer" className={buttonClasses} style={{ letterSpacing: '0.06em' }}>
          Open ↗
        </a>
      </div>
    </div>
  )
}
