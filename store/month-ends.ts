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
import { MonthEnd, monthEndConverter } from '~/models/month-end'

export const state = () => ({
    monthEnds: [],
    selectedAccountId: '',
    reloadData: true,
    dateStart: DateTime.now().startOf('year').toISO(),
    dateEnd: DateTime.now().endOf('year').toISO(),
})

export const mutations = {
    setMonthEnds(state: any, monthEnds: MonthEnd[]) {
        for (const monthEnd of monthEnds) {
            state.monthEnds.push(monthEnd)
        }
        state.reloadData = false
    },
    setMonthEnd(state: any, monthEnd: MonthEnd) {
        const found = state.monthEnds.find(
            (i: MonthEnd) => i.id === monthEnd.id
        )
        if (found) {
            Object.assign(found, monthEnd)
        } else {
            state.monthEnds.push(monthEnd)
        }
    },
    deleteMonthEnd(state: any, monthEnd: MonthEnd) {
        state.monthEnds = state.monthEnds.filter(
            (i: MonthEnd) => i.id !== monthEnd.id
        )
    },
    clearMonthEnds(state: any) {
        state.monthEnds = []
    },
    setSelectedAccount(state: any, accountId: string) {
        state.selectedAccountId = accountId
        state.reloadData = true
    },
    setCurrentYear(state: any) {
        state.dateStart = DateTime.now().startOf('year').toISO()
        state.endDate = DateTime.now().endOf('year').toISO()
    },
}

export const actions = {
    clear({ commit }: any) {
        commit('clearMonthEnds')
    },

    async fetchMonthEnds({ commit, state }: any) {
        const firestore = db.getFirestore()
        const startDate = db.Timestamp.fromDate(
            DateTime.fromISO(state.startDate).toJSDate()
        )
        const endDate = db.Timestamp.fromDate(
            DateTime.fromISO(state.endDate).toJSDate()
        )
        const q = query(
            collection(firestore, 'monthEnds'),
            where('account', '==', state.selectedAccountId),
            where('monthDate', '>=', startDate),
            where('monthDate', '<=', endDate)
        )

        const querySnapshot = await getDocs(q)
        const monthEnds = querySnapshot.docs.map((doc) => {
            const data = doc.data()
            return {
                id: doc.id,
                ...data,
                monthDate: data.monthDate.toDate().toISOString(),
                createdAt: data.createdAt?.toDate().toISOString(),
                updatedAt: data.updatedAt?.toDate().toISOString(),
            } as MonthEnd
        })
        commit('setMonthEnds', monthEnds)
    },

    async addMonthEnd({ commit }: any, monthEnd: MonthEnd) {
        const firestore = db.getFirestore()
        const newMonthEnd = await (
            await addDoc(collection(firestore, 'monthEnds'), monthEnd)
        ).withConverter(monthEndConverter)

        commit('setMonthEnd', {
            ...monthEnd,
            id: newMonthEnd.id,
            monthDate: monthEnd.monthDate.toDate().toISOString(),
            createdAt: monthEnd.createdAt?.toDate().toISOString(),
            updatedAt: monthEnd.updatedAt?.toDate().toISOString(),
        })
    },

    async updateMonthEnd({ commit }: any, monthEnd: MonthEnd) {
        const firestore = db.getFirestore()
        const monthEndRef = doc(
            firestore,
            'monthEnds',
            monthEnd.id!
        ).withConverter(monthEndConverter)

        await updateDoc(monthEndRef, monthEnd)
        commit('setMonthEnd', monthEnd)
    },

    async deleteMonthEnd({ commit }: any, monthEnd: MonthEnd) {
        const firestore = db.getFirestore()
        await deleteDoc(doc(firestore, 'monthEnds', monthEnd.id!))
        commit('deleteMonthEnd', monthEnd)
    },

    setSelectedAccount({ commit }: any, accountId: string) {
        commit('setSelectedAccount', accountId)
    },

    setCurrentYear({ commit }: any) {
        commit('setCurrentYear')
    },
}
