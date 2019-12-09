<template>
  <v-card
    v-if="dataReady"
    v-show="dataReady"
    class="mx-auto"
    min-width="344"
    outlined
  >
    <v-card-title class="title mb-1">
      {{ origin }} -> {{ destination }}
      <v-spacer />
      {{ members.length }}/{{ maxMembers }}
    </v-card-title>
    <v-card-subtitle class="overline">
      {{ date }}
    </v-card-subtitle>
    <v-card-text>
      Members:
      <span v-for="(item, index) in namedMembers()" :key="index">
        {{ item }}
      </span>
      <div></div>
    </v-card-text>
    <v-card-actions>
      <div v-for="(name, index) in wantsToJoin" :key="index">
        <span class="mr-12">{{ name }}</span>
        <v-btn color="green" small icon>
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn small icon>
          <v-icon></v-icon>
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TripRequest',
  props: {
    tripId: String
  },
  data: () => {
    return {
      dataReady: false,
      requests: [],
      wantsToJoin: [],
      members: [],
      maxMembers: 0,
      origin: '',
      destination: '',
      date: ''
    }
  },
  methods: {
    async requestsWithNames() {
      var result = []
      for (let i = 0; i < this.requests.length; i++) {
        const res = await axios.get(
          'http://localhost:3000/users/' + this.requests[i]
        )
        const resData = res.data
        const name = resData.first_name + ' ' + resData.last_name
        result.push(name)
      }
      return result
    },
    async namedMembers() {
      var result = []
      for (let i = 0; i < this.members.length; i++) {
        const res = await axios.get(
          'http://localhost:3000/users/' + this.members[i]
        )
        const resData = res.data
        const name = resData.first_name + ' ' + resData.last_name
        result.push(name)
      }
      return result
    }
  },
  async mounted() {
    const res = await axios.get('http://localhost:3000/trips/' + this.tripId)
    const resData = res.data.trip
    this.requests = resData.requests
    this.wantsToJoin = this.requestsWithNames()
    this.members = resData.members
    this.maxMembers = resData.number_of_members
    this.origin = resData.origin
    this.destination = resData.destination
    const dateArr = resData.date_of_trip.split('T')
    this.date = dateArr[0]
    this.dataReady = true
  }
}
</script>

<style></style>
