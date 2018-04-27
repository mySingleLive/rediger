import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-page',
      component: require('@/components/main/MainPage').default
    },
    {
      path: '/key-value',
      name: 'key-value-page',
      component: require('@/components/page/AppKeyValuePage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
