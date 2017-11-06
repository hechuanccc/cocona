import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/screens/Home'
import GameHall from '@/screens/GameHall'
import Game from '@/screens/games/Game'
import GameCategory from '@/screens/games/GameCategory'
import agentRegister from '@/screens/agent/agentRegister'
import Register from '@/screens/member/Register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/agent/register',
          name: 'agentRegister',
          component: agentRegister
        }
      ]
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/game',
      name: 'Game',
      component: GameHall,
      meta: { requiresAuth: true },
      children: [
        {
          path: ':gameId',
          component: Game,
          children: [
            {
              path: ':categoryId',
              component: GameCategory
            }
          ]
        }
      ]
    }
  ]
})
