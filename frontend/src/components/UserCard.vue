<template>
  <v-card>
    <v-card-title>
      {{ computedTitleText }}
      <v-spacer />
      <v-btn outlined>
        <v-icon class="mr-1">mdi-settings</v-icon>
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
    computedTitleText() {
      var name = this.firstName
      const lastChar = name.slice(-1)
      if (lastChar === 's') {
        return this.firstName + "' Trips"
      } else {
        return this.firstName + "'s Trips"
      }
    }
  }
}
</script>

<style></style>
