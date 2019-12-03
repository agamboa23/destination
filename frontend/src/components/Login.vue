<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Login Form</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form ref="form" @keyup.native.enter="submit()">
        <v-text-field
          v-model="email"
          label="E-Mail"
          prepend-icon="mdi-account"
          type="text"
        />
        <v-text-field
          v-model="password"
          label="Password"
          prepend-icon="mdi-lock"
          type="password"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="submit()">Login</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data: () => {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        const cred = {
          email: this.email,
          password: this.password
        }
        console.log('CRED', cred)
        const res = axios.post('http://localhost:3000/users/login', cred)
        console.log('JSON WEB TOKEN', res)
      } else {
        this.$refs.form.reset()
      }
    }
  }
}
</script>
