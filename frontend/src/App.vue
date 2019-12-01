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
      <v-btn class="mx-2" color="secondary" depressed>
        Log In
      </v-btn>
      <v-btn outlined>
        Sign Up
        <v-icon>mdi-face</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
    <v-footer app>
      <v-spacer></v-spacer>
      &copy; 2019 DestiNation Inc.
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    drawer: false
  })
}
</script>
