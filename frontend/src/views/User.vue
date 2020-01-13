<template>
  <v-row align="center" justify="center">
    <!-- Header Col -->
    <v-col sm="11" md="10">
      <user-card :userId="id" />
    </v-col>
    <!-- Content Col -->
    <v-col cols="12">
      <v-row align="center" justify="center">
        <v-col cols="10">
          <div class="display-1 font-weight-thin">Created Trips</div>
          <v-divider />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <template v-if="createdTrips.length !== 0">
          <v-col
            cols="10"
            md="5"
            v-for="(item, index) in createdTrips"
            :key="index"
          >
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
          <v-col v-if="isUneven(createdTrips)" cols="10" md="5" />
        </template>
        <template v-else>
          <v-col class="text-sm-left text-md-center" cols="10">
            <span class="title font-italic">Nothing to show here</span>
          </v-col>
        </template>
      </v-row>
      <!-- eslint-disable-next-line prettier/prettier -->

      <v-row align="center" justify="center">
        <v-col cols="10">
          <div class="display-1 font-weight-thin">Joined Trips</div>
          <v-divider />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <template v-if="joinedtrips.length !== 0">
          <v-col
            cols="10"
            md="5"
            v-for="(item, index) in joinedtrips"
            :key="index"
          >
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
          <v-col v-if="isUneven(joinedtrips)" cols="10" md="5" />
        </template>
        <template v-else>
          <v-col class="text-sm-left text-md-center" cols="10">
            <span class="title font-italic">Nothing to show here</span>
          </v-col>
        </template>
      </v-row>
      <!-- eslint-disable-next-line prettier/prettier -->

      <v-row align="center" justify="center">
        <v-col cols="10">
          <div class="display-1 font-weight-thin">Completed Trips</div>
          <v-divider />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <template v-if="completedTrips.length !== 0">
          <v-col
            cols="10"
            md="5"
            v-for="(item, index) in completedTrips"
            :key="index"
          >
            <!-- TODO: make this kinda disabled -->
            <trip-overview
              :requests="item.requests"
              :members="item.members"
              :maxMembers="item.number_of_members"
              :origin="item.origin"
              :destination="item.destination"
              :date="item.date_of_trip"
              completed
            />
          </v-col>
          <v-col v-if="isUneven(completedTrips)" cols="10" md="5" />
        </template>
        <template v-else>
          <v-col class="text-sm-left text-md-center" cols="10">
            <span class="title font-italic">Nothing to show here</span>
          </v-col>
        </template>
      </v-row>
    </v-col>
    <v-overlay v-model="overlay">
      <v-progress-circular
        size="150"
        width="10"
        color="secondary"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
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
      overlay: false,
      createdTrips: [],
      joinedtrips: [],
      completedTrips: []
    }
  },
  methods: {
    isUneven(arr) {
      return arr.length % 2 !== 0
    }
  },
  computed: {
    ...mapState('user', ['id'])
  },
  async created() {
    this.overlay = true
    const createdRes = await axios.get(
      'http://localhost:3000/trips/upcoming/' + this.id
    )
    this.createdTrips = createdRes.data.trips
    const joinedRes = await axios.get(
      'http://localhost:3000/trips/joinedupcoming/' + this.id
    )
    this.joinedtrips = joinedRes.data.trips
    const completedRes = await axios.get(
      'http://localhost:3000/trips/completed/' + this.id
    )
    const completedArr = completedRes.data.trips
    const joinedCompletedRes = await axios.get(
      'http://localhost:3000/trips/joinedcompleted/' + this.id
    )
    const joinedCompletedArr = joinedCompletedRes.data.trips
    this.completedTrips = completedArr.concat(joinedCompletedArr)
    this.overlay = false
  }
}
</script>

<style></style>
