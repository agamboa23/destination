const getDefaultState = () => {
  return {
    signedIn: false,
    token: ''
  }
}

// Initial State
const state = getDefaultState()

const getters = {}

const actions = {
  logout({ commit }) {
    commit('resetState')
    commit('user/resetState', null, { root: true })
  }
}

const mutations = {
  login(state, token) {
    state.token = token
    state.signedIn = true
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
