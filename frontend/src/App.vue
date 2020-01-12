<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" link :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logOut()">Logout</v-btn>
        </div>
      </template>
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
        <span class="display-1 font-weight-light hidden-xs-only">
          DestiNation
        </span>
      </div>
      <v-spacer></v-spacer>
      <bar-icons />
    </v-app-bar>
    <v-content>
      <v-container fill-height fluid class="pa-0">
        <router-view />
      </v-container>
    </v-content>
    <v-footer color="accent" padless>
      &copy; 2020 DestiNation GmbH
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
      drawer: null,
      items: [
        {
          title: 'Dashboard',
          icon: 'mdi-view-dashboard',
          to: { name: 'home' }
        },
        {
          title: 'Account',
          icon: 'mdi-account',
          to: { name: 'user' }
        },
        {
          title: 'Admin',
          icon: 'mdi-gavel'
        }
      ]
    }
  },
  methods: {
    toRoot() {
      // eslint-disable-next-line no-unused-vars
      this.$router.push({ name: 'home' }).catch(err => {})
    },
    logOut() {
      this.$store.dispatch('auth/logout')
      this.drawer = false
    }
  }
}
</script>
