<template>
    <v-app dark>
        <!-- Navigation Drawer -->
        <MainNavigation v-if="isAuth" />

        <AppBar />

        <!-- app main area -->
        <v-main>
            <v-container no-gutters>
                <Nuxt />
            </v-container>
        </v-main>
        <!-- end app main area -->

        <v-footer :absolute="true" app>
            <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import MainNavigation from '~/components/MainNavigation.vue'
import AppBar from '~/components/AppBar.vue'

export default Vue.extend({
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
            user: (state: any) => state.auth.user,
        }),
    },
})
</script>
