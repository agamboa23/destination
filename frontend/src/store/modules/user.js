const getDefaultState = () => {
  return {
    id: '',
    firstName: ''
  }
}

// Initial State
const state = getDefaultState()
const getters = {}

const actions = {}

const mutations = {
  setUser(state, user) {
    state.id = user.id
    state.firstName = user.firstName
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
