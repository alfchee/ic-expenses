<template>
  <v-app dark>
    <!-- Navigation Drawer -->
    <MainNavigation />


    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="toggleDrawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>

    <!-- app main area -->
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <!-- end app main area -->
 
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import MainNavigation from '~/components/MainNavigation.vue'

export default {
  name: 'DefaultLayout',

  components: { MainNavigation },

  data() {
    return {
      title: 'Vuetify.js',
    }
  },

  methods: {
    async signOut() {
      this.$router.push('/login')
      await this.$store.dispatch('auth/signOut');
    },
    ...mapActions({
      toggleDrawer: 'navigation/toggleDrawer'
    })
  },

}
</script>
