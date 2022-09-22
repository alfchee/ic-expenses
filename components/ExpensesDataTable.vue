<template>
    <v-data-table
        :headers="headers"
        :items="expenses"
        :items-per-page="50"
        :loading="isLoading"
    >
        <!-- DataTable Header template -->
        <template #top>
            <v-toolbar flat>
                <v-toolbar-title> Filter </v-toolbar-title>
                <v-col cols="3">
                    <v-select
                        :items="accounts"
                        item-value="id"
                        item-text="name"
                        label="Account"
                        :value="selectedAccountId"
                        @change="onChangeAccount"
                    />
                </v-col>
                <v-btn :disabled="!reloadData" @click="onReloadData"
                    >Reload</v-btn
                >
                <v-spacer />

                <!-- Create/Edit Expenses Dialog -->
                <v-dialog v-model="dialog" max-width="500px">
                    <template #activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            dark
                            class="mb-2"
                            v-bind="attrs"
                            v-on="on"
                            >New Expense</v-btn
                        >
                    </template>

                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="editedExpense.amount"
                                            label="Expense Amount"
                                            type="number"
                                        />
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="editedExpense.description"
                                            label="Expense Description"
                                        />
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-select
                                            v-model="editedExpense.account"
                                            :items="accounts"
                                            item-value="id"
                                            item-text="name"
                                            label="Account"
                                        />
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-select
                                            v-model="editedExpense.category"
                                            :items="subcategories"
                                            item-value="id"
                                            item-text="name"
                                            label="Subcategory"
                                        />
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col
                                        cols="12"
                                        class="d-flex justify-center"
                                    >
                                        <v-date-picker
                                            v-model="editedExpense.dateTime"
                                            show-current
                                            color="green lighten-1"
                                            header-color="primary"
                                        />
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer />
                            <v-btn
                                color="blue darken-1"
                                text
                                @click="closeExpenseForm"
                                >Cancel</v-btn
                            >
                            <v-btn color="blue darken-1" text @click="save"
                                >Save</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- END Create/Edit Expense Dialog -->

                <!-- Delete notification Dialog -->
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h6"
                            >Are you sure you want to delete this
                            item?</v-card-title
                        >
                    </v-card>

                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="blue darken-1" text @click="closeDelete"
                            >Cancel</v-btn
                        >
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="deleteExpenseConfirm"
                            >OK</v-btn
                        >
                    </v-card-actions>
                </v-dialog>
            </v-toolbar>
        </template>

        <template #item.dateTime="{ item }">
            {{ formatDate(item.dateTime) }}
        </template>

        <template #item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
        </template>

        <template #item.actions="{ item }">
            <v-icon small class="mr-2" @click="editExpense(item)"
                >mdi-pencil</v-icon
            >
            <v-icon small class="mr-2" @click="deleteExpense(item)"
                >mdi-delete</v-icon
            >
        </template>
    </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import { DateTime } from 'luxon'
import { Timestamp } from 'firebase/firestore'
import { mapState } from 'vuex'
import { Account } from '~/models/account'
import { Currency } from '~/models/currencies'
import { Expense } from '~/models/expense'

declare module 'vue/types/vue' {
    interface Vue {
        headers: any[]
        dialog: boolean
        expenses: Expense[]
        formTitle: string
        dialogDelete: boolean
        editedIndex: number
        editedExpense: any
        defaultExpense: any
        reloadData: boolean
        isLoading: boolean
        editExpense: () => void
        deleteExpense: () => void
        save: () => Promise<void>
        deleteExpenseConfirm: () => Promise<void>
        closeExpenseForm: () => void
        closeDelete: () => void
        formatDate: () => string
        fetchExpenses: () => Promise<void>
        onReloadData: () => Promise<void>
    }
}

export default Vue.extend({
    name: 'ExpensesDataTable',

    data: () => ({
        headers: [
            {
                text: 'Date',
                value: 'dateTime',
            },
            {
                text: 'Description',
                value: 'description',
            },
            {
                text: 'Created At',
                value: 'createdAt',
            },
            {
                text: 'Amount',
                value: 'amount',
            },
            {
                text: 'Actions',
                value: 'actions',
                sortable: false,
            },
        ],
        dialog: false,
        dialogDelete: false,
        isLoading: false,
        editedIndex: -1,
        editedExpense: {
            amount: 0,
            description: '',
            account: '',
            currency: '',
            category: '',
            dateTime: '',
            createdAt: new Date().toISOString(),
        },
        defaultExpense: {
            amount: 0,
            description: '',
            account: '',
            currency: '',
            category: '',
            dateTime: '',
            createdAt: new Date().toISOString(),
        },
    }),

    async fetch() {
        await this.$store.dispatch('accounts/fetchAccounts')
        await this.$store.dispatch('subcats/fetchSubCategories')

        this.$store.dispatch('expenses/setSelectedAccount', this.accounts[0].id)

        if (this.reloadData) {
            this.$store.dispatch('expenses/clear')
            await this.fetchExpenses()
        }
    },

    fetchOnServer: false,

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Expense' : 'Edit Expense'
        },
        titleStartDate() {
            return DateTime.fromISO(this.startDate).toFormat('dd - LLL - yyyy')
        },
        titleEndDate() {
            return DateTime.fromISO(this.endDate).toFormat('dd - LLL - yyyy')
        },
        ...mapState({
            expenses: (state: any) => state.expenses.expenses,
            accounts: (state: any) => state.accounts.accounts as Account[],
            currencies: (state: any) => state.accounts.currencies as Currency[],
            subcategories: (state: any) => state.subcats.subcategories,
            reloadData: (state: any) => state.expenses.reloadData,
            startDate: (state: any) => state.expenses.dateStart,
            endDate: (state: any) => state.expenses.dateEnd,
            selectedAccountId: (state: any) => state.incomes.selectedAccountId,
        }),
    },

    watch: {
        'editedExpense.account'(val) {
            const account = this.accounts.find((account) => account.id === val)
            this.editedExpense.currency = account?.currency
        },
        dialog(val) {
            val || this.closeExpenseForm()
        },
    },

    methods: {
        formatDate(date: string) {
            return DateTime.fromISO(date).toFormat('dd/LL/yyyy')
        },
        onChangeAccount(value: any) {
            this.$store.dispatch('expenses/setSelectedAccount', value)
        },
        async onReloadData() {
            this.$store.dispatch('expenses/clear')
            await this.fetchExpenses()
        },
        async fetchExpenses() {
            this.isLoading = true
            await this.$store.dispatch('expenses/fetchExpenses')
            this.isLoading = false
        },
        async save(): Promise<void> {
            if (this.editedIndex === -1) {
                await this.$store.dispatch('expenses/addExpense', {
                    ...this.editedExpense,
                    dateTime: Timestamp.fromDate(
                        DateTime.fromISO(this.editedExpense.dateTime).toJSDate()
                    ),
                    createdAt: Timestamp.fromDate(
                        DateTime.fromISO(
                            this.editedExpense.createdAt
                        ).toJSDate()
                    ),
                })
            } else {
                await this.$store.dispatch('expenses/updateExpense', {
                    ...this.editedExpense,
                    dateTime: Timestamp.fromDate(
                        DateTime.fromISO(this.editedExpense.dateTime).toJSDate()
                    ),
                    updatedAt: Timestamp.fromDate(new Date()),
                })
            }
            this.closeExpenseForm()
        },

        editExpense(expense: Expense): void {
            this.editedIndex = this.expenses.indexOf(expense)
            this.editedExpense = Object.assign({}, expense)
            this.dialog = true
        },

        deleteExpense(expense: Expense): void {
            this.editedIndex = this.expenses.indexOf(expense)
            this.dialogDelete = true
        },

        closeExpenseForm(): void {
            this.dialog = false
            this.$nextTick(() => {
                this.editedExpense = Object.assign({}, this.defaultExpense)
                this.editedIndex = -1
            })
        },

        closeDelete(): void {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedIndex = -1
            })
        },

        async deleteExpenseConfirm(): Promise<void> {
            await this.$store.dispatch(
                'expenses/deleteExpense',
                this.expenses[this.editedIndex]
            )
            this.closeDelete()
        },
    },
})
</script>

<style></style>
