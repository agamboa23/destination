<template>
  <div>
    <div v-if="!signedIn">
      <v-btn class="mx-2" color="secondary" depressed @click="toLogin()">
        Log In
      </v-btn>
      <v-btn outlined @click="toSignup()">
        Sign Up
        <v-icon>mdi-face</v-icon>
      </v-btn>
    </div>
    <div v-if="signedIn">
      <v-btn text>
        <v-icon class="mr-2">mdi-account</v-icon>
        {{ firstName }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AppBarIcons',
  data: () => {
    return {
      //
    }
  },
  methods: {
    toLogin() {
      this.$router.push({ name: 'login' })
    },
    toSignup() {
      this.$router.push({ name: 'signup' })
    }
  },
  computed: {
    ...mapState('auth', ['signedIn']),
    ...mapState('user', ['firstName'])
  }
}
</script>

<style></style>
