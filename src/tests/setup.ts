import { beforeAll, afterAll, vi } from 'vitest'

const store = new Map<string, string>()

const MOCK_UUID =
  '123e4567-e89b-12d3-a456-426614174000' as `${string}-${string}-${string}-${string}-${string}`

const mockCrypto: Pick<Crypto, 'randomUUID'> = {
  randomUUID: () => MOCK_UUID,
}
vi.stubGlobal('crypto', mockCrypto)

beforeAll(() => {
  const mockLocalStorage: Storage = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, v)
    },
    removeItem: (k: string) => {
      store.delete(k)
    },
    clear: () => {
      store.clear()
    },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size
    },
  }
  vi.stubGlobal('localStorage', mockLocalStorage)
})

afterAll(() => {
  store.clear()
})
