<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <user-card></user-card>
    </v-col>
  </v-row>
</template>

<script>
import UserCard from '@/components/UserCard.vue'

export default {
  name: 'User',
  components: {
    'user-card': UserCard
  }
}
</script>

<style></style>
