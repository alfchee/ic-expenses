<template>
    <v-data-table :headers="headers" :items="incomes" :items-per-page="20">
        <!-- DataTable Header Template -->
        <template #top>
            <v-toolbar flat>
                <v-toolbar-title>Incomes</v-toolbar-title>
                <v-spacer />

                <!-- Create/Edit Incomes Dialog -->
                <v-dialog v-model="dialog" max-width="500px">
                    <template #activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            dark
                            class="mb-2"
                            v-bind="attrs"
                            v-on="on"
                            >New Income</v-btn
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
                                            v-model="editedIncome.amount"
                                            label="Income Amount"
                                            type="number"
                                        />
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="editedIncome.description"
                                            label="Income Description"
                                        />
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-select
                                            v-model="editedIncome.account"
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
                                            v-model="editedIncome.category"
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
                                            v-model="editedIncome.dateTime"
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
                                @click="closeIncomeForm"
                                >Cancel</v-btn
                            >
                            <v-btn color="blue darken-1" text @click="save"
                                >Save</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- END Create/Edit Incomes Dialog -->

                <!-- Delete notification Dialog -->
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h6"
                            >Are you sure you want to delete this
                            item?</v-card-title
                        >

                        <v-card-actions>
                            <v-spacer />
                            <v-btn
                                color="blue darken-1"
                                text
                                @click="closeDelete"
                                >Cancel</v-btn
                            >
                            <v-btn
                                color="blue darken-1"
                                text
                                @click="deleteIncomeConfirm"
                                >OK</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>

        <template #item.actions="{ item }">
            <v-icon small class="mr-2" @click="editIncome(item)"
                >mdi-pencil</v-icon
            >
            <v-icon small class="mr-2" @click="deleteIncome(item)"
                >mdi-delete</v-icon
            >
        </template>
    </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Account } from '~/models/account'
import { Currency } from '~/models/currencies'
import { Income } from '~/models/income'
import { SubCategory } from '~/models/sub-category'

declare module 'vue/types/vue' {
    interface Vue {
        headers: any[]
        dialog: boolean
        subcategories: SubCategory[]
        incomes: Income[]
        accounts: Account[]
        formTitle: string
        dialogDelete: boolean
        editedIndex: number
        editedIncome: any
        defaultIncome: any
        editIncome: () => void
        deleteIncome: () => void
        save: () => Promise<void>
        deleteIncomeConfirm: () => Promise<void>
        closeIncomeForm: () => void
        closeDelete: () => void
    }
}

export default Vue.extend({
    name: 'IncomesDataTable',

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
        editedIndex: -1,
        editedIncome: {
            amount: 0,
            description: '',
            account: '',
            currency: '',
            category: '',
            dateTime: '',
            createdAt: new Date().toISOString(),
        },
        defaultIncome: {
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
        this.$store.dispatch('incomes/clear')
        await this.$store.dispatch('accounts/fetchAccounts')
        await this.$store.dispatch('subcats/fetchSubCategories')
        await this.$store.dispatch('incomes/fetchIncomes')
    },

    fetchOnServer: false,

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Income' : 'Edit Income'
        },
        ...mapState({
            incomes: (state: any) => state.incomes.incomes,
            accounts: (state: any) => state.accounts.accounts as Account[],
            currencies: (state: any) => state.accounts.currencies as Currency[],
            subcategories: (state: any) => state.subcats.subcategories,
        }),
    },

    watch: {
        'editedIncome.account'(val) {
            const account = this.accounts.find((account) => account.id === val)
            this.editedIncome.currency = account?.currency
        },
        dialog(val) {
            val || this.closeIncomeForm()
        },
    },

    methods: {
        async save(): Promise<void> {
            if (this.editedIndex === -1) {
                await this.$store.dispatch(
                    'incomes/addIncome',
                    this.editedIncome
                )
            } else {
                await this.$store.dispatch(
                    'incomes/updateIncome',
                    this.editedIncome
                )
            }
            this.closeIncomeForm()
        },

        editIncome(income: Income): void {
            this.editedIndex = this.incomes.indexOf(income)
            this.editedIncome = Object.assign({}, income)
            this.dialog = true
        },

        deleteIncome(income: Income): void {
            this.editedIndex = this.incomes.indexOf(income)
            this.dialogDelete = true
        },

        closeIncomeForm(): void {
            this.dialog = false
            this.$nextTick(() => {
                this.editedIncome = Object.assign({}, this.defaultIncome)
                this.editedIndex = -1
            })
        },

        closeDelete(): void {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedIndex = -1
            })
        },

        async deleteIncomeConfirm(): Promise<void> {
            await this.$store.dispatch(
                'incomes/deleteIncome',
                this.incomes[this.editedIndex]
            )
            this.closeDelete()
        },
    },
})
</script>

<style></style>