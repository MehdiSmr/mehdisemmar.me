import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import BlogView from './views/BlogView.vue'
import PostView from './views/PostView.vue'
import LogView from './views/LogView.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/blog', name: 'blog', component: BlogView },
    { path: '/blog/:slug', name: 'post', component: PostView, props: true },
    { path: '/running', name: 'running', component: LogView },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

createApp(App).use(router).mount('#app')
