<template>
  <div class="d-flex flex-column">
    <v-btn
      :outlined="!hover1"
      @mouseover="hover1 = true"
      @mouseleave="hover1 = false"
      @click="toCreateTrip()"
      class="ma-4 elevation-6"
      color="secondary"
    >
      {{ createTripText }}
    </v-btn>
    <v-btn
      :outlined="!hover2"
      @mouseover="hover2 = true"
      @mouseleave="hover2 = false"
      @click="toDiscoverView()"
      class="ma-4 elevation-6"
      color="secondary"
    >
      {{ discoverDestinationsText }}
    </v-btn>
    <v-btn
      :outlined="!hover3"
      :to="{ name: 'upcoming' }"
      @mouseover="hover3 = true"
      @mouseleave="hover3 = false"
      class="ma-4 elevation-6"
      color="secondary"
    >
      Upcoming Trips
    </v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Welcome',
  data: () => {
    return {
      hover1: false,
      hover2: false,
      hover3: false,
      createTripText: 'Create a Trip',
      discoverDestinationsText: 'Discover Destinations'
    }
  },
  computed: {
    ...mapState('auth', ['signedIn'])
  },
  methods: {
    toCreateTrip () {
      if (this.signedIn) {
        this.$router.push({ name: 'createTrip' })
      } else {
        this.createTripText = 'Not Signed In'
      }
    },
    toDiscoverView () {
      /** *if (this.signedIn) {
        this.$router.push({ name: 'discoverView' })
      } else {
        this.discoverDestinationsText = 'Not Signed In'
      }***/
      this.$router.push({ name: 'discoverView' })
    }
  }
}
</script>
