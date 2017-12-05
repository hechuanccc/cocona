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
import BankInfo from '@/screens/member/BankInfo'

import Finance from '@/screens/member/Finance'
import TransactionRecord from '@/screens/member/TransactionRecord'
import BetRecord from '@/screens/member/BetRecord'

import Message from '@/screens/member/Message'

import Promotions from '@/screens/promotion/Promotions'
import Faq from '@/screens/faq/FaqsHome'
import Gameintro from '@/screens/gameintro/Gameintros'
import GameHistory from '@/screens/gameintro/GameHistory'

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
          meta: { requiresAuth: true },
          component: Withdraw
        },
        {
          path: 'online_payment',
          name: 'OnlinePayment',
          meta: { requiresAuth: true },
          component: OnlinePayment
        },
        {
          path: 'remit',
          name: 'Remit',
          meta: { requiresAuth: true },
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
              meta: { requiresAuth: true },
              component: PrimaryInfo
            },
            {
              path: 'password_setting',
              name: 'PasswordSetting',
              meta: { requiresAuth: true },
              component: PasswordSetting
            },
            {
              path: 'withdraw_password',
              name: 'WithdrawPassword',
              meta: { requiresAuth: true },
              component: WithdrawPassword
            },
            {
              path: 'bank_info',
              name: 'BankInfo',
              meta: { requiresAuth: true },
              component: BankInfo
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
              meta: { requiresAuth: true },
              component: TransactionRecord
            },
            {
              path: 'withdraw_record',
              name: 'WithdrawRecord',
              meta: { requiresAuth: true },
              component: TransactionRecord
            },
            {
              path: 'betrecord',
              name: 'BetRecord',
              meta: { requiresAuth: true },
              component: BetRecord
            }
          ]
        },
        {
          path: 'message',
          name: 'Message',
          meta: { requiresAuth: true },
          component: Message
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
      meta: { requiresAuth: true },
      component: Gameintro

    }, {
      path: '/gamehistory',
      name: 'GameHistory',
      meta: { requiresAuth: true },
      component: GameHistory

    },
    {
      path: '/game',
      name: 'Game',
      component: GameHall,
      meta: { requiresAuth: true },
      children: [
        {
          path: ':gameId',
          meta: { requiresAuth: true },
          component: Game,
          children: [
            {
              path: ':categoryId',
              meta: { requiresAuth: true },
              component: GameCategory
            }
          ]
        }
      ]
    }
  ]
})
