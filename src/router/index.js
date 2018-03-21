import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/screens/Home'
const GameHall = (resolve) => require(['@/screens/GameHall'], resolve)
const Game = (resolve) => require(['@/screens/games/Game'], resolve)
const GameCategory = (resolve) => require(['@/screens/games/GameCategory'], resolve)
const AgentRegister = (resolve) => require(['@/screens/agent/AgentRegister'], resolve)
const Agent = (resolve) => require(['@/screens/agent/Agent'], resolve)
const Register = (resolve) => require(['@/screens/member/Register'], resolve)
const Account = (resolve) => require(['@/screens/member/Account'], resolve)
const Withdraw = (resolve) => require(['@/screens/member/Withdraw'], resolve)
const OnlinePayment = (resolve) => require(['@/screens/member/OnlinePayment'], resolve)
const OnlinePaymentSuccess = (resolve) => require(['@/screens/member/OnlinePaymentSuccess'], resolve)
const Remit = (resolve) => require(['@/screens/member/Remit'], resolve)

const MyAccount = (resolve) => require(['@/screens/member/MyAccount'], resolve)
const PrimaryInfo = (resolve) => require(['@/screens/member/PrimaryInfo'], resolve)
const PasswordSetting = (resolve) => require(['@/screens/member/PasswordSetting'], resolve)
const WithdrawPassword = (resolve) => require(['@/screens/member/WithdrawPassword'], resolve)
const BankInfo = (resolve) => require(['@/screens/member/BankInfo'], resolve)

const Finance = (resolve) => require(['@/screens/member/Finance'], resolve)
const TransactionRecord = (resolve) => require(['@/screens/member/TransactionRecord'], resolve)
const BetRecord = (resolve) => require(['@/screens/member/BetRecord'], resolve)

const Message = (resolve) => require(['@/screens/member/Message'], resolve)
const Announcement = (resolve) => require(['@/screens/member/Announcement'], resolve)

const Promotions = (resolve) => require(['@/screens/promotion/Promotions'], resolve)
const Faq = (resolve) => require(['@/screens/faq/FaqsHome'], resolve)
const FaqWithdraw = (resolve) => require(['@/screens/faq/FaqWithdraw'], resolve)
const FaqDeposit = (resolve) => require(['@/screens/faq/FaqDeposit'], resolve)
const FaqAbout = (resolve) => require(['@/screens/faq/FaqAbout'], resolve)
const FaqContact = (resolve) => require(['@/screens/faq/FaqContact'], resolve)
const FaqFaqs = (resolve) => require(['@/screens/faq/FaqFaqs'], resolve)
const Gameintro = (resolve) => require(['@/screens/gameintro/Gameintros'], resolve)
const GameHistory = (resolve) => require(['@/screens/gamehistory/GameHistory'], resolve)
const SchedulesTable = (resolve) => require(['@/screens/gamehistory/SchedulesTable'], resolve)

Vue.use(Router)

export default new Router({
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
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
          path: 'online_payment_success',
          name: 'OnlinePaymentSuccess',
          component: OnlinePaymentSuccess
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
            },
            {
              path: 'bank_info',
              name: 'BankInfo',
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
              component: TransactionRecord
            },
            {
              path: 'withdraw_record',
              name: 'WithdrawRecord',
              component: TransactionRecord
            },
            {
              path: 'betrecord',
              name: 'BetRecord',
              component: BetRecord
            }
          ]
        },
        {
          path: 'message',
          name: 'Message',
          component: Message
        },
        {
          path: 'announcement',
          name: 'Announcement',
          component: Announcement
        }
      ]
    }, {
      path: '/promotions',
      name: 'Promotions',
      component: Promotions

    }, {
      path: '/faq',
      name: 'Faq',
      component: Faq,
      children: [
        {
          path: '/faq/deposit',
          name: 'FaqDeposit',
          component: FaqDeposit
        }, {
          path: '/faq/withdraw',
          name: 'FaqWithdraw',
          component: FaqWithdraw
        }, {
          path: '/faq/faqs',
          name: 'FaqFaqs',
          component: FaqFaqs
        }, {
          path: '/faq/about',
          name: 'FaqAbout',
          component: FaqAbout
        }, {
          path: '/faq/contact',
          name: 'FaqContact',
          component: FaqContact
        }
      ]
    }, {
      path: '/gameintro',
      name: 'Gameintro',
      meta: { requiresAuth: true },
      component: Gameintro

    }, {
      path: '/gamehistory',
      name: 'GameHistory',
      meta: { requiresAuth: true },
      component: GameHistory,
      children: [
        {
          path: ':gameCode',
          name: 'Schedules',
          meta: { requiresAuth: true },
          component: SchedulesTable
        }
      ]
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
              component: GameCategory,
              name: 'GameDetail'
            }
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
