import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
} from 'firebase/firestore'
import { db } from '~/services/fireinit'
import { Income, incomeConverter } from '~/models/income'

export const state = () => ({
    incomes: [],
})

export const mutations = {
    setIncomes(state: any, incomes: Income[]) {
        for (const income of incomes) {
            state.incomes.push(income)
        }
    },
    setIncome(state: any, income: Income) {
        const found = state.incomes.find((i: Income) => i.id === income.id)
        if (found) {
            Object.assign(found, income)
        } else {
            state.incomes.push(income)
        }
    },
    deleteIncome(state: any, income: Income) {
        state.incomes = state.incomes.filter((i: Income) => i.id !== income.id)
    },
    clearIncomes(state: any) {
        state.incomes = []
    },
}

export const actions = {
    clear({ commit }: any) {
        commit('clearIncomes')
    },

    async fetchIncomes({ commit }: any) {
        const firestore = db.getFirestore()
        const querySnapshot = await getDocs(collection(firestore, 'incomes'))
        const incomes = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as Income
        })

        commit('setIncomes', incomes)
    },

    async addIncome({ commit }: any, income: Income) {
        const firestore = db.getFirestore()
        const newIncome = await (
            await addDoc(collection(firestore, 'incomes'), income)
        ).withConverter(incomeConverter)

        commit('setIncome', new Income({ ...income, id: newIncome.id }))
    },

    async updateIncome({ commit }: any, income: Income) {
        const firestore = db.getFirestore()
        const incomeRef = doc(firestore, 'incomes', income.id!).withConverter(
            incomeConverter
        )

        await updateDoc(incomeRef, income)
        commit('setIncome', income)
    },

    async deleteIncome({ commit }: any, income: Income) {
        const firestore = db.getFirestore()
        await deleteDoc(doc(firestore, 'incomes', income.id!))
        commit('deleteIncome', income)
    },
}
