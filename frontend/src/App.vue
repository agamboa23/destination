<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list> </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div
        style="cursor: pointer;"
        class="d-flex align-center"
        @click="toRoot()"
      >
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
      <bar-icons />
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height class="pa-0">
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
import AppBarIcons from '@/components/AppBarIcons.vue'

export default {
  name: 'App',
  components: {
    'bar-icons': AppBarIcons
  },
  data: () => {
    return {
      drawer: null
    }
  },
  methods: {
    toRoot() {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>
