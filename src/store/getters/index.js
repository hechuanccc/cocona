import _ from 'lodash'

export default {
  user: (state, getters) => {
    return state.user
  },
  allGames: (state, getters) => {
    state.games.forEach((game, index) => {
      game.index = index + 1
    })
    return state.games
  },
  currentGame: (state, getters) => {
    let routerParams = state.route.params
    return routerParams && routerParams.gameId ? getters.gameById(routerParams.gameId) : null
  },
  planMakerMap: (state, getters) => {
    let chatInfo = state.user.chatInfo
    let map = {}
    if (chatInfo && chatInfo.plan_maker_rooms && chatInfo.plan_maker_rooms.length) {
      _.each(chatInfo.plan_maker_rooms, (roomId) => {
        map[roomId] = {
          isPlanMaker: true
        }
      })
    }
    return map
  },
  gameById: (state, getters) => id => {
    return _.find(state.games, game => (game.id + '') === id)
  },
  categoriesByGameId: (state, getters) => gameId => {
    return _.filter(state.categories, item => (item.game_id + '') === gameId)
  },
  categoriesById: (state, getters) => categoryId => {
    return _.find(state.categories, item => (item.id + '') === categoryId)
  },
  customPlayGroupsById: (state, getters) => gameCode => {
    let playGroup = _.find(state.customPlayGroups, item => (item.code + '') === gameCode)
    return playGroup.component
  }
}
