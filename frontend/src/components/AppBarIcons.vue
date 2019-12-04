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
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
        <!-- {{ firstName }} -->
        Should be Fist Name
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
    toRoot() {
      this.$router.push({ name: 'home' })
    },
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
