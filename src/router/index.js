import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/screens/Home'
import GameHall from '@/screens/GameHall'
import Game from '@/screens/games/Game'
import GameCategory from '@/screens/games/GameCategory'
import agentRegister from '@/screens/agent/agentRegister'
import Register from '@/screens/member/Register'
import Account from '@/screens/member/Account'
import Withdraw from '@/screens/member/Withdraw'
import OnlinePayment from '@/screens/member/OnlinePayment'
import Remit from '@/screens/member/Remit'
import PaymentRecord from '@/screens/member/PaymentRecord'

import MyAccount from '@/screens/member/MyAccount'
import PrimaryInfo from '@/screens/member/PrimaryInfo'
import PasswordSetting from '@/screens/member/PasswordSetting'
import WithdrawPassword from '@/screens/member/WithdrawPassword'
import BetRecord from '@/screens/member/BetRecord'
import Promotions from '@/screens/promotion/Promotions'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/agent/register',
      name: 'agentRegister',
      component: agentRegister
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/account',
      name: 'Account',
      meta: { requiresAuth: true },
      component: Account,
      children: [
        {
          path: 'withdraw',
          name: 'Withdraw',
          component: Withdraw
        },
        {
          path: 'online_payment',
          name: 'OnlinePayment',
          component: OnlinePayment
        },
        {
          path: 'remit',
          name: 'Remit',
          component: Remit
        },
        {
          path: 'payment_record',
          name: 'PaymentRecord',
          component: PaymentRecord
        },
        {
          path: 'my',
          name: 'MyAccount',
          component: MyAccount,
          children: [
            {
              path: 'primary_info',
              name: 'PrimaryInfo',
              component: PrimaryInfo
            },
            {
              path: 'password_setting',
              name: 'PasswordSetting',
              component: PasswordSetting
            },
            {
              path: 'withdraw_password',
              name: 'WithdrawPassword',
              component: WithdrawPassword
            }
          ]
        },
        {
          path: 'betrecord',
          name: 'BetRecord',
          component: BetRecord
        }
      ]
    }, {
      path: '/promotions',
      name: 'Promotions',
      component: Promotions

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
