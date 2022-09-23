<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        Expenses from {{ titleStartDate }} to
                        {{ titleEndDate }}
                    </v-card-title>

                    <v-card-text>
                        <ExpensesDataTableVue />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { DateTime } from 'luxon'
import { mapState } from 'vuex'
import ExpensesDataTableVue from '~/components/ExpensesDataTable.vue'

export default Vue.extend({
    name: 'ExpensesPage',
    components: { ExpensesDataTableVue },

    computed: {
        titleStartDate() {
            return DateTime.fromISO(this.startDate).toFormat('dd - LLL - yyyy')
        },
        titleEndDate() {
            return DateTime.fromISO(this.endDate).toFormat('dd - LLL - yyyy')
        },
        ...mapState({
            startDate: (state: any) => state.expenses.dateStart,
            endDate: (state: any) => state.expenses.dateEnd,
        }),
    },
})
</script>
