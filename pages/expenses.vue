<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card>
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
import ExpensesDataTableVue from '~/components/ExpensesDataTable.vue'

export default Vue.extend({
    name: 'ExpensesPage',
    components: { ExpensesDataTableVue },
})
</script>
