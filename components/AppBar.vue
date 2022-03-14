<template>
  <v-app-bar :clipped-left="clipped" fixed app>
    <!-- Button to Drawer Toggle -->
    <v-app-bar-nav-icon v-if="isAuth" @click.stop="toggleDrawer" />

    <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
      <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
    </v-btn>
    <v-btn icon @click.stop="clipped = !clipped">
      <v-icon>mdi-application</v-icon>
    </v-btn>
    <v-btn icon @click.stop="fixed = !fixed">
      <v-icon>mdi-minus</v-icon>
    </v-btn> -->

    <!-- App Bar Title -->
    <v-toolbar-title v-text="title" />

    <v-spacer />
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
export default Vue.extend({
  name: 'AppBar',

  data: () => ({
    title: 'IC Expenses',
    clipped: false,
  }),

  computed: {
    isAuth() {
      return this.$store.getters['auth/isAuth']
    },
  },

  methods: {
    ...mapActions({
      toggleDrawer: 'navigation/toggleDrawer',
    }),
  },
})
</script>

<style></style>
