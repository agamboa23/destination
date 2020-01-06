<template>
  <v-row align="center" justify="center">
    <v-col cols="12">
      <v-card v-if="dataReady" class="mx-auto" max-width="500">
        <v-img
          class="white--text align-end"
          height="200px"
          :src="
            imgSrc
              ? imgSrc
              : 'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'
          "
        >
          <v-card-title>Trip to {{ destination }}</v-card-title>
        </v-img>

        <v-card-subtitle class="pb-0">Date: {{ date }}</v-card-subtitle>

        <v-card-text class="text--primary">
          <div class="pb-1" style="border-bottom: 1px solid grey;">
            From <code>{{ origin }}</code> to <code>{{ destination }}</code>
          </div>

          <div class="mt-1 pb-n3">
            {{
              description
                ? description
                : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione quasi aperiam provident cumque blanditiis ipsum, officiis facere, animi et veritatis eum perspiciatis quaerat? Doloremque culpa nihil error, totam dolor aspernatur?'
            }}
          </div>
        </v-card-text>
        <v-row justify="start" align="center" no-gutters dense>
          <v-col class="overline ml-4 text-justify-center" cols="5">
            Languages spoken by Host:
          </v-col>
          <v-col cols="2" v-for="(item, index) in userLangs" :key="index">
            <v-chip color="accent" small>{{ item }}</v-chip>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn
            :loading="loading"
            :disabled="loading"
            class="mx-2 mb-2"
            :color="!tripUpdated ? 'secondary' : 'success'"
            depressed
            @click="joinTrip()"
          >
            {{ buttonText }}
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
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'DetailedTripView',
  data: () => {
    return {
      dataReady: false,
      loading: false,
      tripUpdated: false,
      buttonText: 'Send Join Request',
      tripId: '',
      numberOfMembers: 0,
      maxMembers: 0,
      userLangs: [],
      origin: '',
      destination: '',
      description: '',
      date: '',
      imgSrc: ''
    }
  },
  methods: {
    async joinTrip() {
      try {
        this.loading = true
        if (this.userId) {
          const res = await axios.patch(
            'http://localhost:3000/trips/addreq/' +
              this.tripId +
              '/' +
              this.userId
          )
          const resData = res.data.message
          if (resData === 'Trip updated') {
            this.buttonText = 'Request Sent'
            this.tripUpdated = true
            this.loading = false
          }
        } else {
          this.buttonText = 'Not Signed In'
          this.loading = false
        }
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    }
  },
  computed: {
    ...mapState('user', {
      userId: 'id'
    })
  },
  async created() {
    this.tripId = this.$route.params.tripId
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
    // TODO: Hardcoded Google CSE Parameters
    const imgRes = await axios.get(
      'https://www.googleapis.com/customsearch/v1?key=AIzaSyDuwSlA-c6xKWp7K3XPKRhaqE91_iEE5NA&cx=011914005902216404247:ewomagcszot&searchType=image&q=' +
        this.destination
    )
    this.imgSrc = imgRes.data.items[0].link
    this.dataReady = true
  }
}
</script>

<style scoped></style>
