<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <v-list> </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          class="mx-3"
          alt="DestiNation Logo"
          :src="require('@/assets/logo.png')"
          transition="scale-transition"
          contain
          width="50"
        />
        <span class="display-1 font-weight-light">DestiNation</span>
      </div>
      <v-spacer></v-spacer>
      <v-btn class="mx-2" color="secondary" depressed @click="toLogin()">
        Log In
      </v-btn>
      <v-btn outlined @click="toSignup()">
        Sign Up
        <v-icon>mdi-face</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <router-view />
      </v-container>
    </v-content>
    <v-footer app>
      &copy; 2019 DestiNation Inc.
      <v-spacer></v-spacer>
      <v-btn text to="/about">
        About Us
      </v-btn>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    drawer: false
  }),
  methods: {
    toLogin() {
      this.$router.push({ name: 'auth', params: { type: 'login' } })
    },
    toSignup() {
      this.$router.push({ name: 'auth', params: { type: 'signup' } })
    }
  },
  computed: {}
}
</script>
