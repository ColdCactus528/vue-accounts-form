import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AccountRow from './AccountRow.vue'
import type { Account, AccountDraft } from '@/types/accounts'

function mountRow(model?: AccountDraft) {
  return mount(AccountRow, {
    props: {
      modelValue: model ?? {
        id: 'r1',
        labelsInput: 'HR',
        type: 'Local',
        login: 'a',
        password: 'p',
        errors: {},
        touched: {},
      },
    },
    global: { stubs: {} },
  })
}

function firstEmitted<T>(w: VueWrapper<unknown>, name: string): T | undefined {
  const all = w.emitted(name)
  return all && all[0] ? (all[0][0] as T) : undefined
}

describe('AccountRow', () => {
  it('emits submit-valid on blur when valid', async () => {
    const w = mountRow()
    const inputs = w.findAll('input')
    await inputs[0].trigger('blur') // labels
    await inputs[1].trigger('blur') // login
    await inputs[2].trigger('blur') // password

    const ev = firstEmitted<Account>(w, 'submit-valid')
    expect(ev).toBeTruthy()
    expect(ev!.id).toBe('r1')
  })

  it('toggle show/hide password changes input type', async () => {
    const w = mountRow()
    const pwd = w.find('input[type="password"]')
    expect(pwd.exists()).toBe(true)
    const eye = w.find('.eye-btn')
    await eye.trigger('click')
    expect(w.find('input[type="text"]').exists()).toBe(true)
  })

  it('switch to LDAP hides password and clears it', async () => {
    const w = mountRow()
    const current = w.props('modelValue') as AccountDraft
    await w.setProps({
      modelValue: { ...current, type: 'LDAP', password: '' },
    })
    await w.vm.$nextTick()
    expect(w.find('input[type="password"]').exists()).toBe(false)
    expect(w.find('input[placeholder="Пароль"]').exists()).toBe(false)
  })
})
