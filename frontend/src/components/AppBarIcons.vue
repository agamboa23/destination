<template>
  <div>
    <div v-if="!signedIn">
      <v-btn
        class="mx-2"
        color="secondary"
        depressed
        @click="toLogin()"
      >
        Log In
      </v-btn>
      <v-btn
        outlined
        @click="toSignup()"
      >
        Sign Up
        <v-icon>mdi-face</v-icon>
      </v-btn>
    </div>
    <div v-else>
      <v-btn
        icon
        @click="checkUpdates()"
      >
        <v-icon>mdi-bell-ring</v-icon>
      </v-btn>
      <v-btn
        icon
        :to="{ name: 'search' }"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn
        text
        :to="{ name: 'user' }"
      >
        <v-icon class="mr-2">
          mdi-account
        </v-icon>
        {{ firstName }}
      </v-btn>
    </div>
    <v-snackbar
      v-model="snackbar"
      :color="snackcolor"
      :top="true"
      :right="true"
      :timeout="2000"
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
import { mapState } from 'vuex'

export default {
  name: 'AppBarIcons',
  data: () => {
    return {
      backendUrl: process.env.VUE_APP_BACKENDURL,
      notifIds: [],
      snackbar: false,
      snackcolor: '',
      snacktext: ''
    }
  },
  computed: {
    ...mapState('auth', ['signedIn']),
    ...mapState('user', {
      firstName: 'firstName',
      userId: 'id'
    })
  },
  created () {
    this.getNotifIds()
  },
  methods: {
    toLogin () {
      this.$router.push({ name: 'login' })
    },
    toSignup () {
      this.$router.push({ name: 'signup' })
    },
    invokeSnackbar (text, color) {
      this.snacktext = text
      this.snackcolor = color
      this.snackbar = true
    },
    notify (message) {
      this.$notify({
        type: 'warn',
        text: message
      })
    },
    async getNotifIds () {
      const userRes = await axios.get(this.backendUrl + 'users/' + this.userId)
      const userResData = userRes.data.user.notifications
      this.notifIds = userResData
    },
    async checkUpdates () {
      const temp = this.notifIds
      const userRes = await axios.get(this.backendUrl + 'users/' + this.userId)
      const userResData = userRes.data.user.notifications
      this.notifIds = userResData
      const diff = this.notifIds.length - temp.length
      if (diff !== 0) {
        for (let i = diff; i > 0; i--) {
          const newNotif = this.notifIds[this.notifIds.length - i]
          const notRes = await axios.get(
            this.backendUrl + 'notifications/' + newNotif
          )
          const notResData = notRes.data.notification
          this.notify(notResData.message)
        }
      } else {
        this.invokeSnackbar('No Updates', 'info')
      }
    }
  }
}
</script>

<style></style>
