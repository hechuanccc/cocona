import _ from 'lodash'

export default {
  allGames: (state, getters) => {
    return state.games
  },
  categoriesByGameId: (state, getters) => gameId => {
    return _.filter(state.categories, item => (item.game_id + '') === gameId)
  },
  categoriesById: (state, getters) => categoryId => {
    return _.find(state.categories, item => (item.id + '') === categoryId)
  }
}
