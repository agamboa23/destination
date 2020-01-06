<template>
  <div
    :style="{
      backgroundImage: 'url(' + require('@/assets/background.jpg') + ')',
      backgroundSize: 'cover',
      display: 'inherit',
      width: 'inherit',
      height: 'inherit'
    }"
  >
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <welcome />
      </v-col>
    </v-row>
  </div>
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
