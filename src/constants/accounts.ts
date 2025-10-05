// Ключи хранилища
export const STORAGE_KEY_ACCOUNTS = 'accounts:v1' as const

// Ограничения
export const MAX_LOGIN_LEN = 100
export const MAX_PASSWORD_LEN = 100
export const MAX_LABEL_INPUT_LEN = 50 // лимит длины одной строки ввода меток
export const MAX_TAGS = 50 // максимум тегов после парсинга

// Типы учётных записей
export const ACCOUNT_TYPE_LDAP = 'LDAP' as const
export const ACCOUNT_TYPE_LOCAL = 'Local' as const

// Разделитель меток
export const TAGS_DELIMITER = ';' as const

// Опции для селекта типа
export const ACCOUNT_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: 'LDAP', value: ACCOUNT_TYPE_LDAP },
  { label: 'Локальная', value: ACCOUNT_TYPE_LOCAL },
]
