import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import RecordHistoryView from '../views/RecordHistoryView.vue'
import RevisionView from '@/views/RevisionView.vue'
import TaxDeclarationHistoryView from '@/views/TaxDeclarationHistoryView.vue'
import TagView from '@/views/TagView.vue'
import UserView from '@/views/UserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/history',
      name: 'history',
      component: RecordHistoryView
    },
    {
      path: '/tax-declaration/:taxDeclarationNo',
      name: 'tax-declaration',
      component: TaxDeclarationHistoryView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/revisions',
      name: 'revisions',
      component: RevisionView
    },
    {
      path: '/tags',
      name: 'tags',
      component: TagView
    },
    {
      path: '/users',
      name: 'users',
      component: UserView
    },
     {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingView.vue')
    },
  ]
})


router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('isLogin') && localStorage.getItem('username') && localStorage.getItem('id');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
}
)

export default router
