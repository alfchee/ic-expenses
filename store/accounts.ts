import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
} from 'firebase/firestore'
import { db } from '~/services/fireinit'
import { Account, accountsConverter } from '~/models/account'
import { currencies } from '~/models/currencies'

export const state = () => ({
    accounts: [],
    currencies,
})

export const mutations = {
    setAccounts(state: any, accounts: Account[]) {
        for (const account of accounts) {
            state.accounts.push(account)
        }
    },
    setAccount(state: any, account: Account) {
        const found = state.accounts.find((i: Account) => i.id === account.id)
        if (found) {
            Object.assign(found, account)
        } else {
            state.accounts.push(account)
        }
    },
    deleteAccount(state: any, account: Account) {
        state.accounts = state.accounts.filter(
            (i: Account) => i.id !== account.id
        )
    },
    clearAccounts(state: any) {
        state.accounts = []
    },
}

export const actions = {
    clear({ commit }: any) {
        commit('clearAccounts')
    },
    async fetchAccounts({ commit, state }: any) {
        if (state.accounts.length === 0) {
            const firestore = db.getFirestore()
            const querySnapshot = await getDocs(
                collection(firestore, 'accounts')
            )
            const accounts = querySnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() } as Account
            })

            commit('setAccounts', accounts)
        }
    },

    async addAccount({ commit }: any, account: Account) {
        const firestore = db.getFirestore()
        const newAccount = await (
            await addDoc(collection(firestore, 'accounts'), account)
        ).withConverter(accountsConverter)

        commit('setAccount', new Account({ ...account, id: newAccount.id }))
    },

    async updateAccount({ commit }: any, account: Account) {
        const firestore = db.getFirestore()
        const accountRef = doc(
            firestore,
            'accounts',
            account.id!
        ).withConverter(accountsConverter)

        await updateDoc(accountRef, account)
        commit('setAccount', account)
    },

    async deleteAccount({ commit }: any, account: Account) {
        const firestore = db.getFirestore()
        await deleteDoc(doc(firestore, 'accounts', account.id!))

        commit('deleteAccount', account)
    },
}
