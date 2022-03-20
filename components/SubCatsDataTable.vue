<template>
    <v-data-table
        :headers="headers"
        :items="subcategories"
        :items-per-page="30"
    >
        <!-- DataTable Header template -->
        <template #top>
            <v-toolbar flat>
                <v-toolbar-title>Subcategories of Egress</v-toolbar-title>
                <v-spacer />

                <!-- Create/Edit Subcategories Dialog -->
                <v-dialog v-model="dialog" max-width="500px">
                    <template #activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            dark
                            class="mb-2"
                            v-bind="attrs"
                            v-on="on"
                            >New SubCategory</v-btn
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
                                            v-model="editedSubCat.name"
                                            label="SubCategory Name"
                                        />
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-select
                                            v-model="editedSubCat.category"
                                            :items="categories"
                                            item-text="text"
                                            item-value="value"
                                            persistent-hint
                                            label="Category"
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
                                @click="closeSubCatForm"
                                >Cancel</v-btn
                            >
                            <v-btn color="blue darken-1" text @click="save"
                                >Save</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- END Create/Edit SubCategories Dialog -->

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
                                @click="deleteSubCatConfirm"
                                >OK</v-btn
                            >
                            <v-spacer />
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- END Delete notification Dialog -->
            </v-toolbar>
        </template>

        <!-- DataTable Actions template -->
        <template #item.actions="{ item }">
            <v-icon small class="mr-2" @click="editSubCat(item)"
                >mdi-pencil</v-icon
            >
            <v-icon small class="mr-2" @click="deleteSubCat(item)"
                >mdi-delete</v-icon
            >
        </template>
    </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SubCategory } from '~/models/sub-category'

declare module 'vue/types/vue' {
    interface Vue {
        headers: any[]
        dialog: boolean
        categories: any[]
        subcategories: SubCategory[]
        formTitle: string
        dialogDelete: boolean
        editedIndex: number
        editedSubCat: SubCategory
        defaultSubCat: SubCategory
        editSubCat: () => void
        deleteSubCat: () => void
        save: () => Promise<void>
        deleteSubCatConfirm: () => Promise<void>
        closeSubCatForm: () => void
        closeDelete: () => void
    }
}

export default Vue.extend({
    name: 'SubCatsDataTable',

    data: () => ({
        headers: [
            {
                text: 'Name',
                value: 'name',
            },
            {
                text: 'Category',
                value: 'category',
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
        editedSubCat: {
            name: '',
            category: '',
        },
        defaultSubCat: {
            name: '',
            category: '',
        },
    }),

    async fetch() {
        this.$store.dispatch('subcats/clear')
        await this.$store.dispatch('subcats/fetchSubCategories')
    },

    fetchOnServer: false,

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Account' : 'Edit Account'
        },
        ...mapState({
            categories: (state: any) => state.subcats.categories,
            subcategories: (state: any) => state.subcats.subcategories,
        }),
    },

    watch: {
        dialog(val) {
            val || this.closeSubCatForm()
        },
    },

    methods: {
        editSubCat(subcat: SubCategory): void {
            this.editedIndex = this.subcategories.indexOf(subcat)
            this.editedSubCat = Object.assign({}, subcat)
            this.dialog = true
        },
        deleteSubCat(subcat: SubCategory): void {
            this.editedIndex = this.subcategories.indexOf(subcat)
            this.dialogDelete = true
        },
        async save(): Promise<void> {
            if (this.editedIndex === -1) {
                await this.$store.dispatch(
                    'subcats/addSubCategory',
                    this.editedSubCat
                )
            } else {
                await this.$store.dispatch(
                    'subcats/updateSuCat',
                    this.editedSubCat
                )
            }
            this.closeSubCatForm()
        },
        async deleteSubCatConfirm(): Promise<void> {
            await this.$store.dispatch(
                'subcats/deleteSubCat',
                this.subcategories[this.editedIndex]
            )
            this.closeDelete()
        },
        closeSubCatForm(): void {
            this.dialog = false
            this.$nextTick(() => {
                this.editedSubCat = Object.assign({}, this.defaultSubCat)
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
