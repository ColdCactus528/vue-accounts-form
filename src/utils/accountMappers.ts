import type { Account, AccountDraft } from '@/types/accounts'
import { labelsToInput } from '@/utils/tags'
import { ACCOUNT_TYPE_LOCAL } from '@/constants/accounts'

export function accountToDraft(a: Account): AccountDraft {
  return {
    id: a.id,
    labelsInput: labelsToInput(a.labels ?? []),
    type: a.type,
    login: a.login,
    password: a.password ?? '',
    errors: {},
    touched: {},
  }
}

export function emptyDraft(): AccountDraft {
  return {
    id: crypto.randomUUID(),
    labelsInput: '',
    type: ACCOUNT_TYPE_LOCAL,
    login: '',
    password: '',
    errors: {},
    touched: {},
  }
}
