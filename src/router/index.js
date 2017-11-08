import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/screens/Home'
import GameHall from '@/screens/GameHall'
import Game from '@/screens/games/Game'
import GameCategory from '@/screens/games/GameCategory'
import agentRegister from '@/screens/agent/agentRegister'
import Register from '@/screens/member/Register'
import Promotions from '@/screens/Promotions'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: {Page: 'Home'},
      component: Home
    },
    {
      path: '/agent/register',
      name: 'agentRegister',
      meta: {Page: 'agentRegister'},
      component: agentRegister
    },
    {
      path: '/register',
      name: 'Register',
      meta: {Page: 'Register'},
      component: Register
    },
    {
      path: '/promotions',
      name: 'Promotions',
      meta: {Page: 'Promotions'},
      component: Promotions
    },
    {
      path: '/game',
      name: 'Game',
      component: GameHall,
      meta: {requiresAuth: true, Page: 'Game'},
      children: [
        {
          path: ':gameId',
          component: Game,
          meta: {Page: 'Game'},
          children: [
            {
              path: ':categoryId',
              component: GameCategory,
              meta: {Page: 'Game'}
            }
          ]
        }
      ]
    }
  ]
})
