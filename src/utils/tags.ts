import type { Tag } from '@/types/accounts'
import { TAGS_DELIMITER } from '@/constants/accounts'

export function parseLabels(input: string): Tag[] {
  return input
    .split(TAGS_DELIMITER)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => ({ text }))
}

export function labelsToInput(tags: Tag[]): string {
  return tags.map((t) => t.text).join('; ')
}
