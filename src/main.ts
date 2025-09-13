import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useAccountsStore } from '@/stores/accounts'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const store = useAccountsStore()
store.load()

app.mount('#app')
