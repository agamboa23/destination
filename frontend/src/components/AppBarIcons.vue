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
    <div v-else>
      <v-btn icon @click="checkUpdates()">
        <v-icon>mdi-bell-ring</v-icon>
      </v-btn>
      <v-btn icon :to="{ name: 'search' }">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn text :to="{ name: 'user' }">
        <v-icon class="mr-2">mdi-account</v-icon>
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
      <v-btn color="white" text @click="snackbar = false">
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
      notifIds: [],
      snackbar: false,
      snackcolor: '',
      snacktext: ''
    }
  },
  methods: {
    toLogin() {
      this.$router.push({ name: 'login' })
    },
    toSignup() {
      this.$router.push({ name: 'signup' })
    },
    invokeSnackbar(text, color) {
      this.snacktext = text
      this.snackcolor = color
      this.snackbar = true
    },
    notify(message) {
      this.$notify({
        type: 'warn',
        text: message
      })
    },
    async getNotifIds() {
      const userRes = await axios.get(
        'http://localhost:3000/users/' + this.userId
      )
      const userResData = userRes.data.user.notifications
      this.notifIds = userResData
    },
    async showNotification(id) {
      const notRes = await axios.get(
        'http://localhost:3000/notifications/' + id
      )
      const notResData = notRes.data.notification
      const message = {
        text: notResData.message,
        isRead: notResData.isRead
      }
      if (!message.isRead) {
        this.notify(message.text)
      }
    },
    checkUpdates() {
      const temp = this.notifIds
      this.getNotifIds()
      if (this.notifIds.length === temp.length + 1) {
        this.showNotification(this.notifIds[this.notifIds.length - 1])
      } else {
        this.invokeSnackbar('No Updates', 'info')
      }
    }
  },
  computed: {
    ...mapState('auth', ['signedIn']),
    ...mapState('user', {
      firstName: 'firstName',
      userId: 'id'
    })
  },
  created() {
    this.getNotifIds()
  }
}
</script>

<style></style>
