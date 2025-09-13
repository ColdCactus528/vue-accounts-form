import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import AccountsForm from './AccountsForm.vue'
import { useAccountsStore } from '@/stores/accounts'

describe('AccountsForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('adds new draft to the end', async () => {
    const w = mount(AccountsForm)
    const btn = w.get('button')
    await btn.trigger('click')
    await btn.trigger('click')
    const rows = w.findAllComponents({ name: 'AccountRow' })
    expect(rows.length).toBe(2)
  })

  it('saves valid row to store and persists', async () => {
    const w = mount(AccountsForm)
    const btn = w.get('button')
    await btn.trigger('click')

    const inputs = w.findAll('input')
    await inputs[1].setValue('alice')
    await inputs[2].setValue('pwd')
    await inputs[1].trigger('blur')
    await inputs[2].trigger('blur')

    const store = useAccountsStore()
    expect(store.items.length).toBe(1)
    expect(JSON.parse(localStorage.getItem('accounts:v1')!)).toHaveLength(1)
  })
})
