<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        Incomes from {{ titleStartDate }} to
                        {{ titleEndDate }}
                    </v-card-title>

                    <v-card-text>
                        <IncomesDataTable />
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
import IncomesDataTable from '~/components/IncomesDataTable.vue'

export default Vue.extend({
    name: 'IncomePage',

    components: { IncomesDataTable },

    computed: {
        titleStartDate() {
            return DateTime.fromISO(this.startDate).toFormat('dd - LLL - yyyy')
        },
        titleEndDate() {
            return DateTime.fromISO(this.endDate).toFormat('dd - LLL - yyyy')
        },
        ...mapState({
            startDate: (state: any) => state.incomes.dateStart,
            endDate: (state: any) => state.incomes.dateEnd,
        }),
    },
})
</script>

<style></style>
