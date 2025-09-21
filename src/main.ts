import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import LazyPortfolio from './views/LazyPortfolio.vue'
import TerminalPortfolio from './views/TerminalPortfolio.vue'
import i18n from './i18n'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'lazy-portfolio',
      component: LazyPortfolio
    },
    {
      path: '/terminal-portfolio',
      name: 'terminal-portfolio',
      component: TerminalPortfolio
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
