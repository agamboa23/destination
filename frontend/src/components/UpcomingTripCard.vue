<template>
  <v-card
    v-if="dataReady"
    class="mx-auto"
    max-width="400"
    outlined
    @click="toDetailedTrip()"
  >
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
      <v-list-item-avatar tile size="80" color="secondary">
        Photo To Come
      </v-list-item-avatar>
    </v-list-item>
    <v-card-actions>
      <v-btn text>Join</v-btn>
      <v-spacer></v-spacer>
      <span class="subtitle-1 mx-2">
        {{ trip.members.length }}/{{ trip.number_of_members }}
      </span>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'

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
      dataReady: false,
      trip: {}
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
  async mounted() {
    const res = await axios.get('http://localhost:3000/trips/' + this.id)
    this.trip = res.data.trip
    this.dataReady = true
  }
}
</script>

<style></style>
