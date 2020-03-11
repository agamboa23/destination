<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      v-for="(item, index) in items.trips"
      :key="index"
      cols="10"
      md="5"
    >
      <trip-card
        :id="item._id"
        :origin="item.origin"
        :destination="item.destination"
        :date="item.date"
        :members-length="item.members_length"
        :max-members="item.number_of_members"
      />
    </v-col>
    <v-col
      v-if="isUneven"
      cols="10"
      md="5"
    />
  </v-row>
</template>

<script>
import axios from 'axios'
import UpcomingTripCardVue from '../components/UpcomingTripCard.vue'

export default {
  name: 'UpcomingTrips',
  components: {
    'trip-card': UpcomingTripCardVue
  },
  data: () => {
    return {
      backendUrl: process.env.VUE_APP_BACKENDURL,
      items: {
        count: 0,
        trips: []
      }
    }
  },
  computed: {
    isUneven() {
      return this.items.count % 2 !== 0
    }
  },
  async created() {
    const res = await axios.get(this.backendUrl + 'trips/upcoming')
    this.items = res.data
  }
}
</script>

<style scoped></style>
