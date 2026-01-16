import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ReminderDetail from './views/ReminderDetail.vue'

// ルート定義
const routes = [
  { path: import.meta.env.BASE_URL, component: () => import('./components/ReminderForm.vue') },
  { path: import.meta.env.BASE_URL + 'reminder/:id', component: ReminderDetail, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')