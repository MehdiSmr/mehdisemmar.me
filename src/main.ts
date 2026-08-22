import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import IndexView from './views/IndexView.vue'
import LogView from './views/LogView.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'index', component: IndexView },
    { path: '/coffee', name: 'coffee', component: LogView, props: { kind: 'coffee' } },
    { path: '/running', name: 'running', component: LogView, props: { kind: 'running' } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

createApp(App).use(router).mount('#app')
