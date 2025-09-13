<template>
  <div class="row" :class="{ readonly }">
    <n-tooltip :disabled="!errMsg('labels')" trigger="hover" placement="top">
      <template #trigger>
        <n-input
          v-model:value="draft.labelsInput"
          placeholder="Метка (через ; )"
          @blur="onBlur('labels')"
          :status="err('labels')"
          :title="errMsg('labels') || undefined"
          :aria-invalid="Boolean(err('labels'))"
        />
      </template>
      {{ errMsg('labels') }}
    </n-tooltip>

    <n-select :options="typeOptions" v-model:value="draft.type" @update:value="onTypeChange" />

    <n-tooltip :disabled="!errMsg('login')" trigger="hover" placement="top">
      <template #trigger>
        <n-input
          :class="loginClass"
          v-model:value="draft.login"
          placeholder="Логин"
          @blur="onBlur('login')"
          :status="err('login')"
          :title="errMsg('login') || undefined"
          :aria-invalid="Boolean(err('login'))"
        />
      </template>
      {{ errMsg('login') }}
    </n-tooltip>

    <n-tooltip v-if="showPassword" :disabled="!errMsg('password')" trigger="hover" placement="top">
      <template #trigger>
        <n-input
          class="password"
          v-model:value="draft.password"
          :type="showPwd ? 'text' : 'password'"
          placeholder="Пароль"
          @blur="onBlur('password')"
          :status="err('password')"
          :title="errMsg('password') || undefined"
          :aria-invalid="Boolean(err('password'))"
        >
          <template #suffix>
            <n-button
              text
              class="eye-btn"
              @mousedown.prevent
              @click.prevent="togglePwd"
              :title="showPwd ? 'Скрыть' : 'Показать'"
            >
              {{ showPwd ? '🙈' : '👁️' }}
            </n-button>
          </template>
        </n-input>
      </template>
      {{ errMsg('password') }}
    </n-tooltip>

    <div class="actions">
      <n-button quaternary @click="$emit('delete')" class="trash-btn" title="Удалить">
        🗑
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NInput, NSelect, NButton, NTooltip } from 'naive-ui'
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

const inner = ref<AccountDraft>({
  id: props.initial?.id ?? '',
  labelsInput: props.initial?.labels?.map((t) => t.text).join('; ') ?? '',
  type: props.initial?.type ?? 'Local',
  login: props.initial?.login ?? '',
  password: props.initial?.password ?? '',
  errors: {},
  touched: {},
})

watch(
  () => props.modelValue,
  (v) => {
    if (v) inner.value = v
  },
  { immediate: true },
)

const draft = computed<AccountDraft>({
  get: () => props.modelValue ?? inner.value,
  set: (v) => {
    if (props.modelValue) emit('update:modelValue', v)
    else inner.value = v
  },
})

const typeOptions = [
  { label: 'LDAP', value: 'LDAP' },
  { label: 'Локальная', value: 'Local' },
]

const showPassword = computed(() => draft.value.type === 'Local')

const showPwd = ref(false)

function togglePwd() {
  showPwd.value = !showPwd.value
}

function err(field: 'labels' | 'login' | 'password') {
  return draft.value.touched?.[field] && draft.value.errors?.[field] ? 'error' : undefined
}
function errMsg(field: 'labels' | 'login' | 'password') {
  return draft.value.touched?.[field] ? draft.value.errors?.[field] || '' : ''
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
  if (draft.value.type === 'LDAP') draft.value.password = ''
  draft.value.touched.type = true
  runValidation()
}

const loginClass = computed(() => (showPassword.value ? 'login' : 'login login--wide'))
</script>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 1.6fr 1.2fr 40px;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
}

.login {
  grid-column: 3;
}
.password {
  grid-column: 4;
}
.login--wide {
  grid-column: 3 / 5;
}

.actions {
  grid-column: 5;
  justify-self: end;
}

.trash-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.eye-btn {
  padding: 0 6px;
  height: 24px;
  line-height: 24px;
}
</style>
