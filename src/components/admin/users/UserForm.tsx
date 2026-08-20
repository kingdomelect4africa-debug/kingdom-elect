import { Field, SubmitButton, inputClasses } from '@/components/admin/ui'
import { ROLE_LABELS } from '@/lib/rbac'
import type { User, Chapter, Person, Role } from '@prisma/client'

const ROLE_OPTIONS = Object.keys(ROLE_LABELS) as Role[]

export function UserForm({
  action,
  user,
  chapters,
  people,
}: {
  action: (formData: FormData) => Promise<void>
  user?: User
  chapters: Pick<Chapter, 'id' | 'name'>[]
  people: Pick<Person, 'id' | 'firstName' | 'lastName'>[]
}) {
  return (
    <form action={action} className="flex max-w-2xl flex-col gap-6">
      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Account</legend>
        <Field label="Full Name" htmlFor="name" required>
          <input id="name" name="name" required defaultValue={user?.name} className={inputClasses} />
        </Field>
        <Field label="Email" htmlFor="email" required>
          <input id="email" name="email" type="email" required defaultValue={user?.email} className={inputClasses} />
        </Field>
        <Field
          label={user ? 'New Password' : 'Password'}
          htmlFor="password"
          required={!user}
          hint={user ? 'Leave blank to keep the current password.' : 'At least 8 characters. The user will sign in with this password.'}
        >
          <input
            id="password"
            name="password"
            type="password"
            required={!user}
            minLength={8}
            autoComplete="new-password"
            className={inputClasses}
          />
        </Field>
        <label className="flex items-center gap-2 font-sans text-sm text-ink">
          <input type="checkbox" name="active" defaultChecked={user?.active ?? true} className="h-4 w-4" />
          Active (can sign in)
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border border-border-subtle p-6">
        <legend className="px-2 font-serif text-lg text-brand-primary">Role &amp; Access</legend>
        <Field label="Role" htmlFor="role" required>
          <select id="role" name="role" required defaultValue={user?.role ?? 'AUTHOR'} className={inputClasses}>
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>{ROLE_LABELS[role]}</option>
            ))}
          </select>
        </Field>
        <Field label="Chapter" htmlFor="chapterId" hint="Only meaningful for Chapter Administrators — ignored for every other role.">
          <select id="chapterId" name="chapterId" defaultValue={user?.chapterId ?? ''} className={inputClasses}>
            <option value="">None</option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Linked Person" htmlFor="personId" hint="Optional — connect this account to an existing Person profile (e.g. a speaker or chapter lead).">
          <select id="personId" name="personId" defaultValue={user?.personId ?? ''} className={inputClasses}>
            <option value="">None</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
          </select>
        </Field>
      </fieldset>

      <div>
        <SubmitButton>{user ? 'Save User' : 'Create User'}</SubmitButton>
      </div>
    </form>
  )
}
