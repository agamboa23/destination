<template>
  <v-container
    class="back"
    pa-0
    fill-height
    fluid
  >
    <v-row
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
      >
        <welcome />
      </v-col>
    </v-row>
  </v-container>
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

<style scoped>
.back {
  background-image: url('../assets/background.jpg');
  background-size: cover;
}
</style>
