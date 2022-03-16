<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card>
          <v-card-title>Accounts</v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="accountItems"
              :items-per-page="30"
            ></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

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
    ],
  }),

  async fetch() {
    await this.$store.dispatch('accounts/fetchAccounts')
  },

  fetchOnServer: false,

  computed: {
    accountItems() {
      return Array.from(Object.values(this.accounts))
    },
    ...mapState({
      accounts: (state: any) => state.accounts.accounts,
    }),
  },
})
</script>

<style></style>
