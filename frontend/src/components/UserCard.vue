<template>
  <v-card class="elevation-24">
    <v-card-title>
      {{ computedTitleText }}
      <v-spacer />
      <v-btn class="mr-4" outlined @click="toProfile()">
        <v-icon class="mr-2">mdi-account-card-details-outline</v-icon>
        Profile
      </v-btn>
      <v-btn outlined>
        <v-icon class="mr-2">mdi-settings</v-icon>
        Settings
      </v-btn>
    </v-card-title>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserCard',
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('user', ['firstName']),
    computedName() {
      var name = this.firstName
      const lastChar = name.slice(-1)
      if (lastChar === 's') {
        return this.firstName + "'"
      } else {
        return this.firstName + "'s"
      }
    },
    computedTitleText() {
      return this.computedName + ' Trips'
    }
  },
  methods: {
    toProfile() {
      this.$router.push({
        name: 'profile',
        params: { name: this.computedName }
      })
    }
  }
}
</script>

<style></style>
