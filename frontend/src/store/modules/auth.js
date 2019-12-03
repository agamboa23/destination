// Initial State
const state = {
  signedIn: false
}

const getters = {}

const actions = {}

const mutations = {
  logIn(state, credentials) {
    console.log(credentials)
    state.signedIn = true
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
