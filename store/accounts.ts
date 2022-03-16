import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import Vue from 'vue'
import { db } from '~/services/fireinit'
import { Account, accountsConverter } from '~/models/account'
// import { ActionContext } from 'vuex'

export const state = () => ({
  accounts: Object.create(null),
})

export const mutations = {
  setAccounts(state: any, accounts: Account[]) {
    for (const account of accounts) {
      Vue.set(state.accounts, account.id, account)
    }
  },
  setAccount(state: any, account: Account) {
    Object.assign(state.accounts[account.id], account)
  },
  deleteAccount(state: any, accountId: string) {
    Vue.delete(state.accounts, accountId)
  },
  clearAccounts(state: any) {
    state.accounts.clear()
    Object.assign(state.accounts, {})
  },
}

export const actions = {
  async fetchAccounts({ commit }: any) {
    const firestore = db.getFirestore()
    const querySnapshot = await getDocs(collection(firestore, 'accounts'))
    const accounts = querySnapshot.docs.map((doc) => doc.data() as Account)

    commit('setAccounts', accounts)
  },

  async updateAccount({ commit }: any, account: Account) {
    const firestore = db.getFirestore()
    const accountRef = await doc(
      firestore,
      'accounts',
      account.id
    ).withConverter(accountsConverter)

    await updateDoc(accountRef, account)
    commit('setAccount', account)
  },

  async deleteAccount({ commit }: any, accountId: string) {
    const firestore = db.getFirestore()
    await deleteDoc(doc(firestore, 'accounts', accountId))

    commit('deleteAccount', accountId)
  },
}
