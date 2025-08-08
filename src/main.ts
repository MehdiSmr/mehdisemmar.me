import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import LazyPortfolio from './views/LazyPortfolio.vue'
import TerminalPortfolio from './views/TerminalPortfolio.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('./views/LandingPage.vue')
    },
    {
      path: '/lazy-portfolio',
      name: 'lazy-portfolio',
      component: LazyPortfolio
    },
    {
      path: '/terminal-portfolio',
      name: 'terminal-portfolio',
      component: TerminalPortfolio
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
