<template>
    <v-container fluid>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        <SubCatsDataTable />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SubCatsDataTable from '~/components/SubCatsDataTable.vue'

export default Vue.extend({
    name: 'SubCatListPage',

    components: { SubCatsDataTable },
})
</script>

<style></style>
