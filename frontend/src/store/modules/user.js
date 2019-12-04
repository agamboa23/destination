// Initial State
const state = {
  id: '',
  firstName: ''
}

const getters = {}

const actions = {}

const mutations = {
  setUser(state, user) {
    state.id = user.id
    state.firstName = user.firstName
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
