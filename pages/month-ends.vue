<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card>
                    <v-card-title>Month Ends from</v-card-title>

                    <v-card-text>
                        <MonthEndsDataTable />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { DateTime } from 'luxon'
import Vue from 'vue'
import { mapState } from 'vuex'
import MonthEndsDataTable from '~/components/MonthEndsDataTable.vue'

export default Vue.extend({
    name: 'MonthEndsPage',

    components: { MonthEndsDataTable },

    computed: {
        titleStartDate() {
            return DateTime.fromISO(this.startDate).toFormat('dd - LLL - yyyy')
        },
        titleEndDate() {
            return DateTime.fromISO(this.endDate).toFormat('dd - LLL - yyyy')
        },
        ...mapState({
            startDate: (state: any) => state.monthEnds.dateStart,
            endDate: (state: any) => state.monthEnds.dateEnd,
        }),
    },
})
</script>

<style></style>
