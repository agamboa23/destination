<template>
  <div>
    <v-row
      align="center"
      justify="center"
    >
      <v-btn
        :outlined="!hover1"
        class="ma-4 elevation-6"
        color="secondary"
        width="600"
        @mouseover="hover1 = true"
        @mouseleave="hover1 = false"
        @click="toCreateTrip()"
      >
        {{ createTripText }}
      </v-btn>
    </v-row>
    <v-row
      align="center"
      justify="center"
    >
      <v-btn
        :outlined="!hover2"
        class="ma-4 elevation-6"
        color="secondary"
        width="600"
        @mouseover="hover2 = true"
        @mouseleave="hover2 = false"
        @click="toDiscoverView()"
      >
        {{ discoverDestinationsText }}
      </v-btn>
    </v-row>
    <v-row
      align="center"
      justify="center"
    >
      <v-btn
        :outlined="!hover3"
        :to="{ name: 'upcoming' }"
        class="ma-4 elevation-6"
        color="secondary"
        width="600"
        @mouseover="hover3 = true"
        @mouseleave="hover3 = false"
      >
        Upcoming Trips
      </v-btn>
    </v-row>
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
      if (this.signedIn) {
        this.$router.push({ name: 'discoverView' })
      } else {
        this.discoverDestinationsText = 'Not Signed In'
      }
    }
  }
}
</script>
