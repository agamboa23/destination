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
      <span v-for="(item, index) in members" :key="index">
        <name :id="item" /> /
      </span>
    </v-card-text>
    <v-card-actions>
      <span class="overline">Requests:</span>
      <div v-for="(name, index) in requests" :key="index">
        <name class="mx-12" :id="name"></name>
        <v-btn color="green" small icon @click="accept(name)">
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn color="red" small icon>
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
import NameVue from './Name.vue'

export default {
  name: 'TripRequest',
  components: {
    name: NameVue
  },
  props: {
    tripId: String
  },
  data: () => {
    return {
      dataReady: false,
      requests: [],
      members: [],
      maxMembers: 0,
      origin: '',
      destination: '',
      date: ''
    }
  },
  methods: {
    async accept(id) {
      await axios.patch(
        'http://localhost:3000/trips/accreq/' + this.tripId + '/' + id
      )
      this.init()
    },
    async init() {
      const res = await axios.get('http://localhost:3000/trips/' + this.tripId)
      const resData = res.data.trip
      this.requests = resData.requests
      this.members = resData.members
      this.maxMembers = resData.number_of_members
      this.origin = resData.origin
      this.destination = resData.destination
      const dateArr = resData.date_of_trip.split('T')
      this.date = dateArr[0]
      this.dataReady = true
    }
  },
  created() {
    this.init()
  }
}
</script>

<style></style>
