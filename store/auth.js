import { auth } from "~/services/fireinit";

export const state = () => ({
    user: null
  })

export const mutations = {
    setUser(state, user) {
        state.user = user;
    }
}

export const actions = {
    async signInWithCreds({ commit }, { email, password }) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(auth.getAuth(), email, password)

            commit('setUser', userCredential.user);
        } catch (error) {
            console.error(error);
        }
    },

    async signOut({ commit }) {
        await auth.signOut(auth.getAuth()).then(() => {
            commit('setUser', null)
        }).catch(err => console.error(err));
    }
}