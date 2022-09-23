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
import { Income, incomeConverter } from '~/models/income'

export const state = () => ({
    incomes: [],
    selectedAccountId: '',
    dateStart: DateTime.now().startOf('month').toISO(),
    dateEnd: DateTime.now().endOf('month').toISO(),
    reloadData: true,
})

export const mutations = {
    setIncomes(state: any, incomes: Income[]) {
        for (const income of incomes) {
            state.incomes.push(income)
        }
        state.reloadData = false
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
    setCurrentMonth(state: any) {
        state.dateStart = DateTime.now().startOf('month').toISO()
        state.dateEnd = DateTime.now().endOf('month').toISO()
        state.reloadData = true
    },
    setLastMonth(state: any) {
        state.dateStart = DateTime.now()
            .minus({ months: 1 })
            .startOf('month')
            .toISO()
        state.dateEnd = DateTime.now()
            .minus({ months: 1 })
            .endOf('month')
            .toISO()
        state.reloadData = true
    },
    setSelectedAccount(state: any, accountId: string) {
        state.selectedAccountId = accountId
        state.reloadData = true
    },
}

export const actions = {
    clear({ commit }: any) {
        commit('clearIncomes')
    },

    async fetchIncomes({ commit, state }: any) {
        const firestore = db.getFirestore()
        const startDate = db.Timestamp.fromDate(
            DateTime.fromISO(state.dateStart).toJSDate()
        )
        const endDate = db.Timestamp.fromDate(
            DateTime.fromISO(state.dateEnd).toJSDate()
        )
        const q = query(
            collection(firestore, 'incomes'),
            where('account', '==', state.selectedAccountId),
            where('dateTime', '>=', startDate),
            where('dateTime', '<=', endDate)
        )

        const querySnapshot = await getDocs(q)
        const incomes = querySnapshot.docs.map((doc) => {
            const data = doc.data()
            return {
                id: doc.id,
                ...data,
                dateTime: data.dateTime.toDate().toISOString(),
                createdAt: data.createdAt?.toDate().toISOString(),
                updatedAt: data.updatedAt?.toDate().toISOString(),
            } as Income
        })

        commit('setIncomes', incomes)
    },

    async addIncome({ commit }: any, income: Income) {
        const firestore = db.getFirestore()
        const newIncome = await (
            await addDoc(collection(firestore, 'incomes'), income)
        ).withConverter(incomeConverter)

        commit('setIncome', {
            ...income,
            id: newIncome.id,
            dateTime: income.dateTime.toDate().toISOString(),
            createdAt: income.createdAt?.toDate().toISOString(),
            updatedAt: income.updatedAt?.toDate().toISOString(),
        })
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

    setCurrentTimerange({ commit }: any) {
        commit('setCurrentMonth')
    },

    setLastMonthTimerange({ commit }: any) {
        commit('setLastMonth')
    },

    setSelectedAccount({ commit }: any, accountId: string) {
        commit('setSelectedAccount', accountId)
    },
}
