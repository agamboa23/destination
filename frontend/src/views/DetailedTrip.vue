<template>
  <v-row align="center" justify="center">
    <v-col cols="12">
      <v-card class="mx-auto" max-width="500">
        <v-img
          class="white--text align-end"
          height="200px"
          src="https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
        >
          <v-card-title>Trip to {{ destination }}</v-card-title>
        </v-img>

        <v-card-subtitle class="pb-0">Date: {{ date }}</v-card-subtitle>

        <v-card-text class="text--primary">
          <div style="border-bottom: 1px solid grey;">
            From {{ origin }} => {{ destination }}
          </div>

          <div class="mt-1 pb-n3">
            {{
              description
                ? description
                : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione quasi aperiam provident cumque blanditiis ipsum, officiis facere, animi et veritatis eum perspiciatis quaerat? Doloremque culpa nihil error, totam dolor aspernatur?'
            }}
          </div>
        </v-card-text>
        <v-row justify="start" no-gutters dense>
          <v-col class="overline ml-4 text-justify-center" cols="5">
            Languages spoken by Host:
          </v-col>
          <v-col cols="3" v-for="(item, index) in userLangs" :key="index">
            <v-chip color="accent" small>{{ item }}</v-chip>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn class="mx-2 mb-2" color="secondary" depressed>
            Join Trip
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon>
            <v-icon>mdi-share</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DetailedTripView',
  data: () => {
    return {
      tripId: '',
      numberOfMembers: 0,
      maxMembers: 0,
      userLangs: [],
      origin: '',
      destination: '',
      description: '',
      date: ''
    }
  },
  created() {
    this.tripId = this.$route.params.tripId
  },
  async mounted() {
    const res = await axios.get('http://localhost:3000/trips/' + this.tripId)
    const resData = res.data.trip
    this.numberOfMembers = resData.members.length
    this.maxMembers = resData.number_of_members
    this.userLangs = resData.user.languages
    this.origin = resData.origin
    this.destination = resData.destination
    this.description = resData.description
    const dateArr = resData.date_of_trip.split('T')
    this.date = dateArr[0]
  }
}
</script>

<style></style>
