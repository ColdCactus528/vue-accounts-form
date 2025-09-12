export type AccountType = 'LDAP' | 'Local'

export interface Tag {
  text: string
}

export interface Account {
  id: string
  labels: Tag[]
  type: AccountType
  login: string
  password: string | null
}

export interface AccountDraft {
  id: string
  labelsInput: string
  type: AccountType
  login: string
  password: string
  errors: Partial<Record<'labels' | 'login' | 'password', string>>
  touched: Partial<Record<'labels' | 'login' | 'password' | 'type', boolean>>
}
