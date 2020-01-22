<template>
  <v-card
    v-show="dataReady"
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
          {{ betterDate }}
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
        {{ membersLength }}/{{ maxMembers }}
      </span>
    </v-card-actions>
  </v-card>
</template>

<script>
import destinations from '@/assets/destinations.js'

export default {
  name: 'UpcomingTripCard',
  props: {
    id: String,
    origin: String,
    destination: String,
    date: String,
    membersLength: Number,
    maxMembers: Number
  },
  data: () => {
    return {
      dataReady: false,
      logo: ''
    }
  },
  computed: {
    betterDate() {
      const dateObj = new Date(this.date)
      return dateObj.toLocaleString('en-DE', {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    }
  },
  methods: {
    toDetailedTrip() {
      this.$router.push({
        name: 'upcomingTripDetailed',
        params: { destination: this.destination, tripId: this.id }
      })
    }
  },
  async created() {
    let found = destinations.find(elem => elem.name === this.destination)
    if (typeof found.logo !== 'undefined') {
      this.logo = found.logo
    }
    this.dataReady = true
  }
}
</script>

<style></style>
