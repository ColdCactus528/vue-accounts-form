import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAccountsStore } from './accounts'

const KEY = 'accounts:v1'

describe('accounts store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('upsert() writes to localStorage and load() restores', () => {
    const store = useAccountsStore()
    store.upsert({
      id: 'a1',
      labels: [{ text: 'HR' }],
      type: 'Local',
      login: 'alice',
      password: 'pwd',
    })
    const raw = localStorage.getItem(KEY)!
    expect(JSON.parse(raw)).toHaveLength(1)

    const fresh = useAccountsStore()
    fresh.load()
    expect(fresh.items[0]).toMatchObject({
      id: 'a1',
      login: 'alice',
      type: 'Local',
      labels: [{ text: 'HR' }],
      password: 'pwd',
    })
  })

  it('load() normalizes legacy labels', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify([
        { id: 'x', labels: 'HR;IT', type: 'LDAP', login: 'bob', password: 'ignored' },
      ]),
    )
    const store = useAccountsStore()
    store.load()
    expect(store.items[0].labels).toEqual([{ text: 'HR' }, { text: 'IT' }])
    expect(store.items[0].password).toBeNull()
  })
})
