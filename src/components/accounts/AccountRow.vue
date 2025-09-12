<template>
  <div class="row" :class="{ readonly }">
    <!-- Метка -->
    <n-input
      v-if="!readonly"
      v-model:value="draft.labelsInput"
      placeholder="Метка (через ; )"
      @blur="onBlur('labels')"
      :status="err('labels')"
    />
    <n-input v-else :value="labelsReadonly" disabled />

    <!-- Тип записи -->
    <n-select
      :options="typeOptions"
      v-model:value="draft.type"
      :disabled="readonly"
      @update:value="onTypeChange"
    />

    <!-- Логин -->
    <n-input
      v-model:value="draft.login"
      placeholder="Логин"
      :disabled="readonly"
      @blur="onBlur('login')"
      :status="err('login')"
    />

    <!-- Пароль (только Local и не readonly) -->
    <n-input
      v-if="showPassword"
      v-model:value="draft.password"
      type="password"
      placeholder="Пароль"
      :disabled="readonly"
      @blur="onBlur('password')"
      :status="err('password')"
    />
    <n-input v-else-if="!readonly" value="" disabled placeholder="Пароль скрыт для LDAP" />

    <!-- Действия -->
    <n-button quaternary @click="$emit('delete')">🗑</n-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NInput, NSelect, NButton } from 'naive-ui'
import type { Account, AccountDraft } from '@/types/accounts'
import { validateDraft } from '@/composables/useAccountValidation'

const props = defineProps<{
  modelValue?: AccountDraft
  readonly?: boolean
  initial?: Account
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: AccountDraft): void
  (e: 'delete'): void
  (e: 'submit-valid', v: Account): void
  (e: 'edit'): void
}>()

const draft = computed({
  get: () =>
    props.modelValue ?? {
      id: props.initial?.id ?? '',
      labelsInput: props.initial?.labels?.map((t) => t.text).join('; ') ?? '',
      type: props.initial?.type ?? 'Local',
      login: props.initial?.login ?? '',
      password: props.initial?.password ?? '',
      errors: {},
      touched: {},
    },
  set: (v: AccountDraft) => emit('update:modelValue', v),
})

const typeOptions = [
  { label: 'LDAP', value: 'LDAP' },
  { label: 'Локальная', value: 'Local' },
]

const showPassword = computed(() => !props.readonly && draft.value.type === 'Local')
const labelsReadonly = computed(() => props.initial?.labels.map((t) => t.text).join('; ') ?? '')

function err(field: 'labels' | 'login' | 'password') {
  return draft.value.touched?.[field] && draft.value.errors?.[field] ? 'error' : undefined
}

function runValidation() {
  const { errors, isValid, toAccount } = validateDraft(draft.value)
  draft.value.errors = errors
  if (isValid) emit('submit-valid', toAccount())
}

function onBlur(field: 'labels' | 'login' | 'password') {
  draft.value.touched[field] = true
  runValidation()
}

function onTypeChange() {
  // если переключили в LDAP — пароль скрываем и чистим
  if (draft.value.type === 'LDAP') draft.value.password = ''
  draft.value.touched.type = true
  runValidation()
}
</script>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 1fr 1fr auto;
  gap: 8px;
  margin-bottom: 8px;
}
</style>
