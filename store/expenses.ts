import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
} from 'firebase/firestore'
import { db } from '~/services/fireinit'
import { Expense, expenseConverter } from '~/models/expense'

export const state = () => ({
    expenses: [],
})

export const mutations = {
    setExpenses(state: any, expenses: Expense[]) {
        for (const expense of expenses) {
            state.expenses.push(expense)
        }
    },
    setExpense(state: any, expense: Expense) {
        const found = state.expenses.find((e: Expense) => e.id === expense.id)
        if (found) {
            Object.assign(found, expense)
        } else {
            state.expenses.push(expense)
        }
    },
    deleteExpense(state: any, expense: Expense) {
        state.expenses = state.expenses.filter(
            (e: Expense) => e.id !== expense.id
        )
    },
    clearExpenses(state: any) {
        state.expenses = []
    },
}

export const actions = {
    clear({ commit }: any) {
        commit('clearExpenses')
    },

    async fetchExpenses({ commit }: any) {
        const firestore = db.getFirestore()
        const querySnapshot = await getDocs(collection(firestore, 'expenses'))
        const expenses = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as Expense
        })
        commit('setExpenses', expenses)
    },

    async addExpense({ commit }: any, expense: Expense) {
        const firestore = db.getFirestore()
        const newExpense = await (
            await addDoc(collection(firestore, 'expenses'), expense)
        ).withConverter(expenseConverter)

        commit('setExpense', new Expense({ ...expense, id: newExpense.id }))
    },

    async updateExpense({ commit }: any, expense: Expense) {
        const firestore = db.getFirestore()
        const expenseRef = doc(
            firestore,
            'expenses',
            expense.id!
        ).withConverter(expenseConverter)

        await updateDoc(expenseRef, expense)
        commit('setExpense', expense)
    },

    async deleteExpense({ commit }: any, expense: Expense) {
        const firestore = db.getFirestore()
        await deleteDoc(doc(firestore, 'expenses', expense.id!))
        commit('deleteExpense', expense)
    },
}
