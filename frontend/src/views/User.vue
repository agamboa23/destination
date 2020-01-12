<template>
  <v-row align="start" justify="center">
    <v-col cols="12" sm="12" md="10">
      <user-card :userId="id" />
    </v-col>
    <v-col cols="12">
      <v-row align="center" justify="center">
        <v-col cols="5" v-for="(item, index) in trips" :key="index">
          <trip-overview
            :tripId="item._id"
            :requests="item.requests"
            :members="item.members"
            :maxMembers="item.number_of_members"
            :origin="item.origin"
            :destination="item.destination"
            :date="item.date_of_trip"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import UserCard from '@/components/UserCard.vue'
import MiniTripOverview from '@/components/MiniTripOverview.vue'
import axios from 'axios'

export default {
  name: 'User',
  components: {
    'user-card': UserCard,
    'trip-overview': MiniTripOverview
  },
  data: () => {
    return {
      trips: []
    }
  },
  computed: {
    ...mapState('user', ['id'])
  },
  async created() {
    const res = await axios.get(
      'http://localhost:3000/trips/upcoming/' + this.id
    )
    const resData = res.data.trips
    this.trips = resData
  }
}
</script>

<style></style>
