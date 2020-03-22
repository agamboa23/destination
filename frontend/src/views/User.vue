<template>
  <v-row
    align="center"
    justify="center"
  >
    <!-- Header Col -->
    <v-col
      sm="11"
      md="10"
    >
      <user-card :user-id="id" />
    </v-col>
    <!-- Content Col -->
    <v-col cols="12">
      <v-row
        align="center"
        justify="center"
      >
        <v-col cols="10">
          <div class="display-1 font-weight-thin">
            Created Trips
          </div>
          <v-divider />
        </v-col>
      </v-row>
      <v-row
        align="center"
        justify="center"
      >
        <template v-if="createdTrips.length !== 0">
          <v-col
            v-for="(item, index) in createdTrips"
            :key="index"
            cols="10"
            md="5"
          >
            <trip-overview
              :trip-id="item._id"
              :requests="item.requests"
              :members="item.members"
              :max-members="item.number_of_members"
              :origin="item.origin"
              :destination="item.destination"
              :date="item.date_of_trip"
            />
          </v-col>
          <v-col
            v-if="isUneven(createdTrips)"
            cols="10"
            md="5"
          />
        </template>
        <template v-else>
          <v-col
            class="text-sm-left text-md-center"
            cols="10"
          >
            <span class="title font-italic">Nothing to show here</span>
          </v-col>
        </template>
      </v-row>

      <v-row
        align="center"
        justify="center"
      >
        <v-col cols="10">
          <div class="display-1 font-weight-thin">
            Joined Trips
          </div>
          <v-divider />
        </v-col>
      </v-row>
      <v-row
        align="center"
        justify="center"
      >
        <template v-if="joinedtrips.length !== 0">
          <v-col
            v-for="(item, index) in joinedtrips"
            :key="index"
            cols="10"
            md="5"
          >
            <trip-overview
              :trip-id="item._id"
              :requests="item.requests"
              :members="item.members"
              :max-members="item.number_of_members"
              :origin="item.origin"
              :destination="item.destination"
              :date="item.date_of_trip"
            />
          </v-col>
          <v-col
            v-if="isUneven(joinedtrips)"
            cols="10"
            md="5"
          />
        </template>
        <template v-else>
          <v-col
            class="text-sm-left text-md-center"
            cols="10"
          >
            <span class="title font-italic">Nothing to show here</span>
          </v-col>
        </template>
      </v-row>

      <v-row
        align="center"
        justify="center"
      >
        <v-col cols="10">
          <div class="display-1 font-weight-thin">
            Completed Trips
          </div>
          <v-divider />
        </v-col>
      </v-row>
      <v-row
        align="center"
        justify="center"
      >
        <template v-if="completedTrips.length !== 0">
          <v-col
            v-for="(item, index) in completedTrips"
            :key="index"
            cols="10"
            md="5"
          >
            <!-- TODO: make this kinda disabled -->
            <trip-overview
              :requests="item.requests"
              :members="item.members"
              :max-members="item.number_of_members"
              :origin="item.origin"
              :destination="item.destination"
              :date="item.date_of_trip"
              completed
            />
          </v-col>
          <v-col
            v-if="isUneven(completedTrips)"
            cols="10"
            md="5"
          />
        </template>
        <template v-else>
          <v-col
            class="text-sm-left text-md-center"
            cols="10"
          >
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
      />
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
      backendUrl: process.env.VUE_APP_BACKENDURL,
      overlay: false,
      createdTrips: [],
      joinedtrips: [],
      completedTrips: []
    }
  },
  computed: {
    ...mapState('user', ['id'])
  },
  async created () {
    this.overlay = true
    const createdRes = await axios.get(
      this.backendUrl + 'trips/upcoming/' + this.id
    )
    this.createdTrips = createdRes.data.trips
    const joinedRes = await axios.get(
      this.backendUrl + 'trips/joinedupcoming/' + this.id
    )
    this.joinedtrips = joinedRes.data.trips
    const completedRes = await axios.get(
      this.backendUrl + 'trips/completed/' + this.id
    )
    const completedArr = completedRes.data.trips
    const joinedCompletedRes = await axios.get(
      this.backendUrl + 'trips/joinedcompleted/' + this.id
    )
    const joinedCompletedArr = joinedCompletedRes.data.trips
    this.completedTrips = completedArr.concat(joinedCompletedArr)
    this.overlay = false
  },
  methods: {
    isUneven (arr) {
      return arr.length % 2 !== 0
    }
  }
}
</script>

<style></style>
