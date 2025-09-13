import { describe, it, expect } from 'vitest'
import { validateDraft } from './useAccountValidation'
import type { AccountDraft } from '@/types/accounts'
const base = (): AccountDraft => ({
  id: 'id1',
  labelsInput: 'HR;IT',
  type: 'Local',
  login: 'alice',
  password: 'secret',
  errors: {},
  touched: {},
})

describe('validateDraft', () => {
  it('requires login and max 100', () => {
    const d = base()
    d.login = ''
    const { errors, isValid } = validateDraft(d)
    expect(isValid).toBe(false)
    expect(errors.login).toBeTruthy()
  })

  it('Local requires password', () => {
    const d = base()
    d.password = ''
    const { errors, isValid } = validateDraft(d)
    expect(isValid).toBe(false)
    expect(errors.password).toBeTruthy()
  })

  it('LDAP hides password (null in toAccount)', () => {
    const d = base()
    d.type = 'LDAP'
    const { isValid, toAccount } = validateDraft(d)
    expect(isValid).toBe(true)
    expect(toAccount().password).toBeNull()
  })

  it('labels length limited to 50 chars', () => {
    const d = base()
    d.labelsInput = 'x'.repeat(51)
    const { errors, isValid } = validateDraft(d)
    expect(isValid).toBe(false)
    expect(errors.labels).toBeTruthy()
  })
})
