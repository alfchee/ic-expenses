import { auth } from '~/services/fireinit'

export default (context) => {
  const { store } = context

  return new Promise((resolve, _reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        return resolve(store.commit('auth/setUser', user))
      }
      return resolve()
    })
  })
}
