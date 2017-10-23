import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/screens/Home'
import Game from '@/screens/Game'
import GamePlay from '@/screens/games/GamePlay'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/game',
      name: 'Game',
      component: Game,
      children: [
        {
          path: ':id',
          component: GamePlay
        }
      ]
    }
  ]
})
