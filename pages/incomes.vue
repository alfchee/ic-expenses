<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card>
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
import IncomesDataTable from '~/components/IncomesDataTable.vue'

export default Vue.extend({
    name: 'IncomePage',

    components: { IncomesDataTable },
})
</script>

<style></style>
