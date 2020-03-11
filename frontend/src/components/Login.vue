<template>
  <div class="text-center">
    <v-card class="elevation-12">
      <v-toolbar
        color="secondary"
        dark
        flat
      >
        <v-toolbar-title>Login Form</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          @keyup.native.enter="submit()"
        >
          <v-text-field
            v-model="email"
            color="secondary"
            label="E-Mail"
            prepend-icon="mdi-account"
            type="text"
            :rules="[rules.required, rules.email]"
          />
          <v-text-field
            v-model="password"
            color="secondary"
            label="Password"
            prepend-icon="mdi-lock"
            type="password"
            :rules="[rules.required]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="px-4"
          color="secondary"
          :loading="loading"
          :disabled="!valid || loading"
          @click="submit()"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="snackbar"
      :color="snackcolor"
      :top="true"
      :right="true"
      :timeout="timeout"
    >
      {{ snacktext }}
      <v-btn
        color="white"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data: () => {
    return {
      backendUrl: process.env.VUE_APP_BACKENDURL,
      valid: true,
      loading: false,
      email: '',
      password: '',
      rules: {
        required: v => !!v || 'Required',
        email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Not a valid E-Mail'
      },
      snackbar: false,
      snackcolor: '',
      snacktext: '',
      timeout: 3000
    }
  },
  methods: {
    invokeSnackbar(text, color) {
      this.snacktext = text
      this.snackcolor = color
      this.snackbar = true
    },
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const cred = {
            email: this.email,
            password: this.password
          }
          const res = await axios.post(this.backendUrl + 'users/login', cred)
          this.$store.commit('auth/login', res.data.token)
          const userId = res.data.userId
          const userResponse = await axios.get(
            this.backendUrl + 'users/' + userId
          )
          const firstName = userResponse.data.user.first_name
          this.$store.commit('user/setUser', {
            id: userId,
            firstName: firstName
          })
          this.invokeSnackbar(res.data.message, 'success')
          this.loading = false
          setTimeout(() => {
            this.$router.push({ name: 'home' })
          }, 1500)
        } catch (err) {
          this.invokeSnackbar('Authorization Error', 'error')
          this.loading = false
        }
      }
    }
  }
}
</script>
