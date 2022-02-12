
export const state = () => ({
    drawer: false,
    miniVariant: false,
    clipped: false,
  })

export const mutations = {
    toggleDrawer(state) {
        state.drawer = !state.drawer;
    }
}

export const actions = {
    toggleDrawer({commit}) {
        commit('toggleDrawer')
    }
}