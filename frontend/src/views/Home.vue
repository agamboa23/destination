<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <welcome />
    </v-col>
  </v-row>
</template>

<script>
import WelcomeVue from '../components/Welcome.vue'

export default {
  name: 'Home',
  components: {
    welcome: WelcomeVue
  }
}
</script>

<style scoped></style>
