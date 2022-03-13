<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title>Login</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="formData.email"
              required
              label="Email"
              @keyup.enter="signIn"
            />
            <v-text-field
              v-model="formData.password"
              required
              label="Password"
              type="password"
              :error-messages="loginError"
              @keyup.enter="signIn"
            />

            <v-btn @click="signIn">Login</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
export default Vue.extend({
  name: 'LoginAuth',
  data: () => ({
    formData: {
      email: '',
      password: '',
    },
  }),
  computed: {
    ...mapState({
      user: (state: any) => state.auth.user,
      loginError: (state: any) => state.auth.loginError,
    }),
  },
  methods: {
    async signIn() {
      await this.$store.dispatch('auth/signInWithCreds', {
        email: this.formData.email,
        password: this.formData.password,
      })
      this.formData = { email: '', password: '' }
      this.$router.push('/')
    },
  },
})
</script>
