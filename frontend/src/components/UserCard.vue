<template>
  <v-card>
    {{ id }}
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserCard',
  computed: {
    ...mapState('user', ['id'])
  },
  mounted() {
    console.log('Al id', this.id)
  }
}
</script>

<style></style>
