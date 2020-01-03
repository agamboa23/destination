<template>
  <div>
    <v-row align="center" justify="center">
      <v-btn
        @mouseover="hover1 = true"
        @mouseleave="hover1 = false"
        :outlined="!hover1"
        class="ma-4 elevation-6"
        color="secondary"
        width="600"
      >
        Create a Trip
      </v-btn>
    </v-row>
    <v-row align="center" justify="center">
      <v-btn
        @mouseover="hover2 = true"
        @mouseleave="hover2 = false"
        :outlined="!hover2"
        class="ma-4 elevation-6"
        color="secondary"
        width="600"
      >
        Discover DestiNations
      </v-btn>
    </v-row>
    <v-row align="center" justify="center">
      <v-btn
        @mouseover="hover3 = true"
        @mouseleave="hover3 = false"
        :outlined="!hover3"
        :to="{ name: 'upcoming' }"
        class="ma-4 elevation-6"
        color="secondary"
        width="600"
      >
        Upcoming Trips
      </v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data: () => {
    return {
      hover1: false,
      hover2: false,
      hover3: false
    }
  }
}
</script>
