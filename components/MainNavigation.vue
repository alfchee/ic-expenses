<template>
    <v-navigation-drawer
        v-model="drawer"
        :mini-variant="miniVariant"
        :clipped="clipped"
        fixed
        app
    >
        <v-list flat>
            <!-- dynamic list of items -->
            <v-list-item
                v-for="(item, i) in items"
                :key="i"
                :to="item.to"
                router
                exact
            >
                <v-list-item-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title v-text="item.title" />
                </v-list-item-content>
            </v-list-item>
            <!-- end of dynamic list of items -->

            <!-- sign out option -->
            <v-list-item @click="signOut">
                <v-list-item-action>
                    <v-icon>mdi-apps</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Sign Out</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <!-- end sign out option -->
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
export default Vue.extend({
    name: 'MainNavigation',
    data: () => ({
        drawer: false,
        miniVariant: false,
        clipped: false,
        items: [
            {
                icon: 'mdi-apps',
                title: 'Welcome',
                to: '/',
            },
            {
                icon: 'mdi-chart-bubble',
                title: 'Inspire',
                to: '/inspire',
            },
            {
                icon: 'mdi-select-group',
                title: 'Incomes',
                to: '/incomes',
            },
            {
                icon: 'mdi-select-group',
                title: 'Expenses',
                to: '/expenses',
            },
            {
                icon: 'mdi-bank',
                title: 'Accounts',
                to: '/accounts',
            },
            {
                icon: 'mdi-select-group',
                title: 'SubCategories',
                to: '/subcat',
            },
        ],
    }),
    computed: {
        ...mapState({
            rootDrawer: (state: any) => state.navigation.drawer,
        }),
    },
    watch: {
        rootDrawer(val) {
            this.drawer = val
        },
    },
    methods: {
        async signOut() {
            this.$router.push('/login')
            await this.$store.dispatch('auth/signOut')
        },
    },
})
</script>

<style></style>
