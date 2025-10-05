import { defineStore } from 'pinia'
import type { Account, Tag } from '@/types/accounts'
import { STORAGE_KEY_ACCOUNTS, ACCOUNT_TYPE_LDAP, TAGS_DELIMITER } from '@/constants/accounts'

function isTagLike(x: unknown): x is Tag {
  return !!x && typeof x === 'object' && typeof (x as Record<string, unknown>).text === 'string'
}

function normalizeAccount(raw: unknown): Account {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}

  const type: Account['type'] = r['type'] === ACCOUNT_TYPE_LDAP ? 'LDAP' : 'Local'

  // labels: string | Tag[] | неизвестно → Tag[]
  const labelsRaw = r['labels']
  let labels: Tag[] = []
  if (Array.isArray(labelsRaw) && labelsRaw.every(isTagLike)) {
    labels = (labelsRaw as Tag[]).map(({ text }) => ({ text }))
  } else if (typeof labelsRaw === 'string') {
    labels = labelsRaw
      .split(TAGS_DELIMITER)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text) => ({ text }))
  }

  const id = r['id'] == null ? crypto.randomUUID() : String(r['id'])
  const login =
    typeof r['login'] === 'string' ? r['login'] : r['login'] != null ? String(r['login']) : ''

  // для LDAP пароль всегда null
  const password =
    type === ACCOUNT_TYPE_LDAP ? null : typeof r['password'] === 'string' ? r['password'] : ''

  return { id, type, login, password, labels }
}

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    items: [] as Account[],
  }),
  actions: {
    load() {
      const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS)
      if (!raw) return
      try {
        const parsed = JSON.parse(raw) as unknown
        this.items = Array.isArray(parsed) ? parsed.map(normalizeAccount) : []
      } catch (e) {
        console.error('Failed to parse accounts from storage', e)
        this.items = []
      }
    },
    save() {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(this.items))
    },
    upsert(acc: Account) {
      const i = this.items.findIndex((a) => a.id === acc.id)
      if (i === -1) this.items.push(acc)
      else this.items[i] = acc
      this.save()
    },
    remove(id: string) {
      this.items = this.items.filter((a) => a.id !== id)
      this.save()
    },
    reset() {
      this.items = []
      this.save()
    },
  },
})
