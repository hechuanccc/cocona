import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/screens/Home'
import GameHall from '@/screens/GameHall'
import Game from '@/screens/games/Game'
import GameCategory from '@/screens/games/GameCategory'
import AgentRegister from '@/screens/agent/AgentRegister'
import Agent from '@/screens/agent/Agent'
import Register from '@/screens/member/Register'
import Account from '@/screens/member/Account'
import Withdraw from '@/screens/member/Withdraw'
import OnlinePayment from '@/screens/member/OnlinePayment'
import Remit from '@/screens/member/Remit'

import MyAccount from '@/screens/member/MyAccount'
import PrimaryInfo from '@/screens/member/PrimaryInfo'
import PasswordSetting from '@/screens/member/PasswordSetting'
import WithdrawPassword from '@/screens/member/WithdrawPassword'

import Finance from '@/screens/member/Finance'
import PaymentRecord from '@/screens/member/PaymentRecord'
import RemitRecord from '@/screens/member/RemitRecord'
import BetRecord from '@/screens/member/BetRecord'

import Promotions from '@/screens/promotion/Promotions'
import Faq from '@/screens/faq/FaqsHome'
import Gameintro from '@/screens/gameintro/Gameintros'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/agent',
      name: 'Agent',
      component: Agent,
      children: [
        {
          path: 'agent_register',
          name: 'AgentRegister',
          component: AgentRegister
        }
      ]
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
          path: 'finance',
          name: 'Finance',
          component: Finance,
          children: [
            {
              path: 'payment_record',
              name: 'PaymentRecord',
              component: PaymentRecord
            },
            {
              path: 'remit_record',
              name: 'RemitRecord',
              component: RemitRecord
            },
            {
              path: 'betrecord',
              name: 'BetRecord',
              component: BetRecord
            }
          ]
        }
      ]
    }, {
      path: '/promotions',
      name: 'Promotions',
      component: Promotions

    }, {
      path: '/faq',
      name: 'Faq',
      component: Faq

    }, {
      path: '/gameintro',
      name: 'Gameintro',
      component: Gameintro

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
