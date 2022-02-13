<template>
  <v-app dark>
    <!-- Navigation Drawer -->
    <MainNavigation v-if="isAuth" />

    <AppBar />

    <!-- app main area -->
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <!-- end app main area -->

    <v-footer :absolute="true" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import MainNavigation from '~/components/MainNavigation.vue'
import AppBar from '~/components/AppBar.vue'

export default {
  name: 'DefaultLayout',

  components: { AppBar, MainNavigation },

  data() {
    return {
      fixed: false,
    }
  },

  computed: {
    isAuth() {
      return this.$store.getters['auth/isAuth']
    },
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },
}
</script>
