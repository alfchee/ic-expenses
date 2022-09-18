import { DateTime } from 'luxon'
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    query,
    where,
} from 'firebase/firestore'
import { db } from '~/services/fireinit'
import { Expense, expenseConverter } from '~/models/expense'

export const state = () => ({
    expenses: [],
    dateStart: DateTime.now().startOf('month').toISO(),
    dateEnd: DateTime.now().endOf('month').toISO(),
    reloadData: true,
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

    async fetchExpenses({ commit, state }: any) {
        const firestore = db.getFirestore()
        const startDate = db.Timestamp.fromDate(
            DateTime.fromISO(state.dateStart).toJSDate()
        )
        const endDate = db.Timestamp.fromDate(
            DateTime.fromISO(state.dateEnd).toJSDate()
        )
        const q = query(
            collection(firestore, 'expenses'),
            where('dateTime', '>=', startDate),
            where('dateTime', '<=', endDate)
        )

        const querySnapshot = await getDocs(q)
        const expenses = querySnapshot.docs.map((doc) => {
            const data = doc.data()
            return {
                id: doc.id,
                ...data,
                dateTime: data.dateTime.toDate().toISOString(),
                createdAt: data.createdAt?.toDate().toISOString(),
                updatedAt: data.updatedAt?.toDate().toISOString(),
            } as Expense
        })
        commit('setExpenses', expenses)
    },

    async addExpense({ commit }: any, expense: Expense) {
        const firestore = db.getFirestore()
        const newExpense = await (
            await addDoc(collection(firestore, 'expenses'), expense)
        ).withConverter(expenseConverter)

        commit('setExpense', {
            ...expense,
            id: newExpense.id,
            dateTime: expense.dateTime.toDate().toISOString(),
            createdAt: expense.createdAt?.toDate().toISOString(),
            updatedAt: expense.updatedAt?.toDate().toISOString(),
        })
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
