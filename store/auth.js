import { auth } from '~/services/fireinit'

export const state = () => ({
  user: null,
  loginError: '',
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setError(state, message) {
    state.loginError = message
  },
}

export const actions = {
  async signInWithCreds({ commit }, { email, password }) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        auth.getAuth(),
        email,
        password
      )

      commit('setUser', userCredential.user)
      commit('setError', '')
    } catch (error) {
      commit('setError', error.message)
      console.error(error)
    }
  },

  async signOut({ commit }) {
    try {
      commit('setUser', null)

      await auth.signOut(auth.getAuth())
    } catch (error) {
      console.error(error)
    }
  },
}

export const getters = {
  isAuth(state) {
    return state.user !== null
  },
}
