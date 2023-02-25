<template>
    <v-data-table></v-data-table>
</template>

<script lang="ts">
import { Timestamp } from '@firebase/firestore'
import { DateTime } from 'luxon'
import Vue from 'vue'
import { mapState } from 'vuex'
import { Account } from '~/models/account'
import { Currency } from '~/models/currencies'
import { MonthEnd } from '~/models/month-end'

declare module 'vue/types/vue' {
    interface Vue {
        headers: any[]
        timeRanges: any[]
        dialog: boolean
        accounts: Account[]
        formTitle: string
        dialogDelete: boolean
        editedIndex: number
        editedMonthEnd: any
        defaultMonthEnd: any
        reloadData: boolean
        isLoading: boolean
        formatDate: () => string
        onReloadData: () => Promise<void>
        onChangeAccount: () => void
        fetchMonthEnds: () => Promise<void>
        save: () => Promise<void>
        closeMonthEndForm: () => void
        closeDelete: () => void
        deleteMonthEndConfirm: () => Promise<void>
    }
}

export default Vue.extend({
    name: 'MonthEndsDataTable',

    data: () => ({
        headers: [
            {
                text: 'Month',
                value: 'month',
            },
            {
                text: 'Incomes',
                value: 'incomes',
            },
            {
                text: 'Expenses',
                value: 'expenses',
            },
            {
                text: 'Balance',
                value: 'balance',
            },
            {
                text: 'Actions',
                value: 'actions',
                sortable: false,
            },
        ],
        dialog: false,
        dialogDelete: false,
        editedIndex: -1,
        isLoading: false,
        editedMonthEnd: {
            month: DateTime.now().toFormat('yyyy-LL'),
            monthDate: DateTime.now().startOf('month'),
            account: '',
            incomes: 0,
            expenses: 0,
            balance: 0,
            manual: false,
            reason: '',
        },
        defaultMonthEnd: {
            month: DateTime.now().toFormat('yyyy-LL'),
            monthDate: DateTime.now().startOf('month'),
            account: '',
            incomes: 0,
            expenses: 0,
            balance: 0,
            manual: false,
            reason: '',
        },
    }),

    async fetch() {
        await this.$store.dispatch('accounts/fetchAccounts')

        this.$store.dispatch(
            'monthEnds/setSelectedAccount',
            this.accounts[0].id
        )

        if (this.reloadData) {
            this.onReloadData()
        }
    },

    fetchOnServer: false,

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Month End' : 'Edit Month End'
        },
        titleStartDate() {
            return DateTime.fromISO(this.startDate).toFormat('LLL-yyyy')
        },
        titleEndDate() {
            return DateTime.fromISO(this.endDate).toFormat('LLL-yyyy')
        },
        ...mapState({
            accounts: (state: any) => state.accounts.accounts as Account[],
            currencies: (state: any) => state.accounts.currencies as Currency[],
            reloadData: (state: any) => state.monthEnds.reloadData,
            startDate: (state: any) => state.monthEnds.dateStart,
            endDate: (state: any) => state.monthEnds.dateEnd,
            selectedAccountId: (state: any) =>
                state.monthEnds.selectedAccountId,
            monthEnds: (state: any) => state.monthEnds.monthEnds,
        }),
    },

    watch: {
        'editedMonthEnd.account'(val) {
            const account = this.accounts.find((account) => account.id === val)
            this.editedMonthEnd.currency = account?.currency
        },
        dialog(val) {
            val || this.closeMonthEndForm()
        },
    },

    methods: {
        onChangeAccount(value: any) {
            this.$store.dispatch('monthEnds/setSelectedAccount', value)
        },

        async onReloadData() {
            this.$store.dispatch('monthEnds/clear')
            await this.fetchMonthEnds()
        },

        async fetchMonthEnds() {
            this.isLoading = true
            await this.$store.dispatch('monthEnds/fetchMonthEnds')
            this.isLoading = false
        },

        async save(): Promise<void> {
            if (this.editedIndex) {
                await this.$store.dispatch('monthEnds/addMonthEnd', {
                    ...this.editedMonthEnd,
                    monthDate: Timestamp.fromDate(
                        DateTime.fromISO(
                            this.editedMonthEnd.monthDate
                        ).toJSDate()
                    ),
                    createdAt: Timestamp.fromDate(DateTime.now().toJSDate()),
                })
            } else {
                await this.$store.dispatch('monthEnds/updateMonthEnd', {
                    ...this.editedMonthEnd,
                    monthDate: Timestamp.fromDate(
                        DateTime.fromISO(
                            this.editedMonthEnd.monthDate
                        ).toJSDate()
                    ),
                    createdAt: Timestamp.fromDate(DateTime.now().toJSDate()),
                })
            }
            this.closeMonthEndForm()
        },

        editMonthEnd(monthEnd: MonthEnd): void {
            this.editedIndex = this.monthEnds.indexOf(monthEnd)
            this.editedMonthEnd = Object.assign({}, monthEnd)
            this.dialog = true
        },

        deleteMonthEnd(monthEnd: MonthEnd): void {
            this.editedIndex = this.monthEnds.indexOf(monthEnd)
            this.dialogDelete = true
        },

        closeMonthEndForm(): void {
            this.dialog = false
            this.$nextTick(() => {
                this.editedMonthEnd = Object.assign({}, this.defaultMonthEnd)
                this.editedIndex = -1
            })
        },

        closeDelete(): void {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedIndex = -1
            })
        },

        async deleteMonthEndConfirm(): Promise<void> {
            await this.$store.dispatch(
                'monthEnds/deleteMonthEnd',
                this.monthEnds[this.editedIndex]
            )
            this.closeDelete()
        },
    },
})
</script>

<style></style>
