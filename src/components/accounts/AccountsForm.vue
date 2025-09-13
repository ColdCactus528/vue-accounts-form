<template>
  <div class="accounts">
    <div class="head">
      <h2 style="margin: 0">Учетные записи</h2>
      <n-button type="primary" @click="add">+</n-button>
    </div>

    <p class="hint">Для указания нескольких меток используйте разделитель «;»</p>

    <AccountRow
      v-for="(d, i) in drafts"
      :key="d.id"
      :model-value="d"
      @update:model-value="(val) => (drafts[i] = val)"
      @delete="deleteDraft(d.id)"
      @submit-valid="saveDraft"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NButton } from 'naive-ui'
import AccountRow from './AccountRow.vue'
import type { AccountDraft, Account } from '@/types/accounts'
import { useAccountsStore } from '@/stores/accounts'

const store = useAccountsStore()
const drafts = ref<AccountDraft[]>([])

onMounted(() => {
  drafts.value = store.items.map((a) => ({
    id: a.id,
    labelsInput: (a.labels ?? [])
      .map((t) => t.text)
      .filter(Boolean)
      .join('; '),
    type: a.type,
    login: a.login,
    password: a.password ?? '',
    errors: {},
    touched: {},
  }))
})

function add() {
  drafts.value.push({
    id: crypto.randomUUID(),
    labelsInput: '',
    type: 'Local',
    login: '',
    password: '',
    errors: {},
    touched: {},
  })
}

function deleteDraft(id: string) {
  drafts.value = drafts.value.filter((d) => d.id !== id)
  store.remove(id)
}

function saveDraft(a: Account) {
  store.upsert(a)
}
</script>

<style scoped>
.head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
}
.hint {
  color: #6b7280;
  font-size: 12px;
  margin: 8px 0 16px;
}
</style>
