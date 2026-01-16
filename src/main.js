import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ReminderDetail from './views/ReminderDetail.vue'

// ルート定義
const routes = [
  { path: '', component: () => import('./components/ReminderForm.vue') },
  { path: 'reminder/:id', component: ReminderDetail, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')