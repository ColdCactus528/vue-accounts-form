import { defineStore } from 'pinia'
import type { Account } from '@/types/accounts'

const STORAGE_KEY = 'accounts:v1'

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    items: [] as Account[],
  }),
  actions: {
    load() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      try {
        this.items = JSON.parse(raw)
      } catch (e) {
        console.error('Failed to parse accounts from storage', e)
      }
    },
    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
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
