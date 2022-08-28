<template>
    <v-container fluid>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        <v-data-table
                            :headers="headers"
                            :items="accounts"
                            :items-per-page="30"
                        >
                            <!-- DataTable Header template -->
                            <template #top>
                                <v-toolbar flat>
                                    <v-toolbar-title>Accounts</v-toolbar-title>
                                    <v-spacer />

                                    <!-- Create/Edit Account Dialog -->
                                    <v-dialog
                                        v-model="dialog"
                                        max-width="500px"
                                    >
                                        <template #activator="{ on, attrs }">
                                            <v-btn
                                                color="primary"
                                                dark
                                                class="mb-2"
                                                v-bind="attrs"
                                                v-on="on"
                                                >New Account</v-btn
                                            >
                                        </template>

                                        <v-card>
                                            <v-card-title
                                                ><span class="text-h5">{{
                                                    formTitle
                                                }}</span></v-card-title
                                            >

                                            <v-card-text>
                                                <v-container>
                                                    <v-row>
                                                        <v-col cols="12">
                                                            <v-text-field
                                                                v-model="
                                                                    editedAccount.name
                                                                "
                                                                label="Account Name"
                                                            />
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col cols="12">
                                                            <v-select
                                                                v-model="
                                                                    editedAccount.currency
                                                                "
                                                                :items="
                                                                    currencies
                                                                "
                                                                item-text="name"
                                                                item-value="code"
                                                                persistent-hint
                                                                label="Account Description"
                                                            />
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col cols="12">
                                                            <v-text-field
                                                                v-model="
                                                                    editedAccount.description
                                                                "
                                                                label="Account Description"
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
                                                    @click="closeAccountForm"
                                                    >Cancel</v-btn
                                                >
                                                <v-btn
                                                    color="blue darken-1"
                                                    text
                                                    @click="save"
                                                    >Save</v-btn
                                                >
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                    <!-- END Create/Edit Account Dialog -->

                                    <!-- Delete notification Dialog -->
                                    <v-dialog
                                        v-model="dialogDelete"
                                        max-width="500px"
                                    >
                                        <v-card>
                                            <v-card-title class="text-h6"
                                                >Are you sure you want to delete
                                                this item?</v-card-title
                                            >
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    color="blue darken-1"
                                                    text
                                                    @click="closeDelete"
                                                    >Cancel</v-btn
                                                >
                                                <v-btn
                                                    color="blue darken-1"
                                                    text
                                                    @click="deleteItemConfirm"
                                                    >OK</v-btn
                                                >
                                                <v-spacer></v-spacer>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                    <!-- END Delete notification Dialog -->
                                </v-toolbar>
                            </template>

                            <!-- DataTable Actions template -->
                            <template #item.actions="{ item }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="editAccount(item)"
                                    >mdi-pencil</v-icon
                                >
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="deleteAccount(item)"
                                    >mdi-delete</v-icon
                                >
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { CurrencyCode, Currency } from '~/models/currencies'
import { Account } from '~/models/account'

declare module 'vue/types/vue' {
    interface Vue {
        headers: any[]
        dialog: boolean
        accounts: Account[]
        currencies: Currency[]
        formTitle: string
        dialogDelete: boolean
        editedIndex: number
        editedAccount: Account
        defaultAccount: Account
        editAccount: () => void
        deleteAccount: () => Promise<void>
        closeDelete: () => void
        closeAccountForm: () => void
    }
}

export default Vue.extend({
    name: 'AccountsListPage',

    data: () => ({
        headers: [
            {
                text: 'Name',
                value: 'name',
            },
            {
                text: 'Description',
                value: 'description',
            },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        dialog: false,
        dialogDelete: false,
        editedIndex: -1,
        editedAccount: {
            name: '',
            description: '',
            currency: CurrencyCode.NIO,
        },
        defaultAccount: {
            name: '',
            description: '',
            currency: CurrencyCode.NIO,
        },
    }),

    async fetch() {
        this.$store.dispatch('accounts/clear')
        await this.$store.dispatch('accounts/fetchAccounts')
    },

    fetchOnServer: false,

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Account' : 'Edit Account'
        },
        ...mapState({
            accounts: (state: any) => state.accounts.accounts,
            currencies: (state: any) => state.accounts.currencies,
        }),
    },

    watch: {
        dialog(val) {
            val || this.closeAccountForm()
        },
    },

    methods: {
        editAccount(account: Account): void {
            this.editedIndex = this.accounts.indexOf(account)
            this.editedAccount = Object.assign({}, account)
            this.dialog = true
        },
        deleteAccount(account: Account): void {
            this.editedIndex = this.accounts.indexOf(account)
            this.dialogDelete = true
        },
        async save() {
            if (this.editedIndex === -1) {
                await this.$store.dispatch(
                    'accounts/addAccount',
                    this.editedAccount
                )
            } else {
                await this.$store.dispatch(
                    'accounts/updateAccount',
                    this.editedAccount
                )
            }
            this.closeAccountForm()
        },
        async deleteItemConfirm() {
            await this.$store.dispatch(
                'accounts/deleteAccount',
                this.accounts[this.editedIndex]
            )
            this.closeDelete()
        },
        closeAccountForm(): void {
            this.dialog = false
            this.$nextTick(() => {
                this.editedAccount = Object.assign({}, this.defaultAccount)
                this.editedIndex = -1
            })
        },
        closeDelete(): void {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedIndex = -1
            })
        },
    },
})
</script>

<style></style>
