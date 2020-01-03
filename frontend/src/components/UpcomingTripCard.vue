<template>
  <v-card class="mx-auto" max-width="400" outlined @click="toDetailedTrip()">
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">From {{ origin }}</div>
        <v-list-item-title class="headline mb-1">
          {{ destination }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ date }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-avatar v-if="logo" tile size="80">
        <v-img :src="logo" contain></v-img>
      </v-list-item-avatar>
      <v-list-item-avatar v-else tile size="80" color="secondary">
        No Coat of Arms
      </v-list-item-avatar>
    </v-list-item>
    <v-card-actions>
      <v-btn text>Click for Details</v-btn>
      <v-spacer></v-spacer>
      <span class="subtitle-1 mx-2">
        {{ trip.members.length }}/{{ trip.number_of_members }}
      </span>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
import destinations from '@/assets/destinations.js'

export default {
  name: 'UpcomingTripCard',
  props: {
    origin: String,
    destination: String,
    date: String,
    id: String
  },
  data: () => {
    return {
      trip: {},
      logo: ''
    }
  },
  methods: {
    toDetailedTrip() {
      this.$router.push({
        name: 'detailedTripView',
        params: { destination: this.destination, tripId: this.id }
      })
    }
  },
  async created() {
    const res = await axios.get('http://localhost:3000/trips/' + this.id)
    this.trip = res.data.trip
    let found = destinations.find(elem => elem.name === this.destination)
    console.log('FOUND', found)
    if (typeof found.logo !== 'undefined') {
      this.logo = found.logo
    }
  }
}
</script>

<style></style>
