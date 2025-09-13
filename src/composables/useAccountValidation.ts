import type { AccountDraft, Account } from '@/types/accounts'
import { parseLabels } from '@/utils/tags'

export function validateDraft(d: AccountDraft) {
  const errors: AccountDraft['errors'] = {}

  // Логин
  const login = d.login?.trim() ?? ''
  if (!login) errors.login = 'Логин обязателен'
  else if (login.length > 100) errors.login = 'Макс. 100 символов'

  // Пароль (только для Local)
  if (d.type === 'Local') {
    const pwd = d.password?.trim() ?? ''
    if (!pwd) errors.password = 'Пароль обязателен'
    else if (pwd.length > 100) errors.password = 'Макс. 100 символов'
  }

  if (d.labelsInput && d.labelsInput.length > 50) {
    errors.labels = 'Максимум 50 символов'
  }

  const isValid = Object.keys(errors).length === 0

  const toAccount = (): Account => ({
    id: d.id,
    labels: parseLabels(d.labelsInput).slice(0, 50),
    type: d.type,
    login,
    password: d.type === 'LDAP' ? null : d.password,
  })

  return { errors, isValid, toAccount }
}
