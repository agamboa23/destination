<template>
  <div v-if="dataReady">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8">
        <user-card :userId="id" />
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="5" v-for="(item, index) in trips" :key="index">
        <trip-request
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserCard from '@/components/UserCard.vue'
import TripRequest from '@/components/TripRequest.vue'
import axios from 'axios'

export default {
  name: 'User',
  components: {
    'user-card': UserCard,
    'trip-request': TripRequest
  },
  data: () => {
    return {
      dataReady: false,
      trips: []
    }
  },
  computed: {
    ...mapState('user', ['id'])
  },
  async mounted() {
    const res = await axios.get(
      'http://localhost:3000/trips/upcoming/' + this.id
    )
    const resData = res.data.trips
    this.trips = resData
    this.dataReady = true
  }
}
</script>

<style></style>
