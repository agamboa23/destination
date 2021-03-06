<template>
  <v-container
    fill-height
    fluid
    class="pa-0"
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col cols="10">
        <v-card
          v-if="dataReady"
          class="mx-auto"
          max-width="500"
        >
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
          <v-card-subtitle class="pb-2">
            {{ date }}
          </v-card-subtitle>
          <v-card-text class="text--primary">
            <div
              class="pb-2"
              style="border-bottom: 1px solid grey;"
            >
              From
              <code class="mx-2">{{ origin }}</code>
              to
              <code class="mx-2">{{ destination }}</code>
            </div>

            <div class="mt-1 pb-n3">
              {{
                description
                  ? description
                  : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione quasi aperiam provident cumque blanditiis ipsum, officiis facere, animi et veritatis eum perspiciatis quaerat? Doloremque culpa nihil error, totam dolor aspernatur?'
              }}
            </div>
          </v-card-text>
          <v-row
            justify="start"
            align="center"
            no-gutters
            dense
          >
            <v-col
              class="overline ml-4 text-justify-center"
              cols="5"
            >
              Languages spoken by Host:
            </v-col>
            <v-col
              v-for="(item, index) in userLangs"
              :key="index"
              cols="2"
            >
              <v-chip
                color="accent"
                small
              >
                {{ item }}
              </v-chip>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-btn
              :loading="loading"
              :disabled="loading"
              class="mx-2 mb-2"
              :color="buttonColor"
              depressed
              @click="joinTrip()"
            >
              {{ buttonText }}
            </v-btn>
            <v-spacer />
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="secondary"
                  icon
                  v-on="on"
                >
                  <v-icon>mdi-share</v-icon>
                </v-btn>
              </template>
              <span>Share this trip</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'UpcomingTripDetailed',
  props: {
    tripId: {
      type: String,
      required: true
    }
  },
  data: () => {
    return {
      backendUrl: process.env.VUE_APP_BACKENDURL,
      dataReady: false,
      loading: false,
      buttonColor: 'secondary',
      buttonText: 'Send Join Request',
      numberOfMembers: 0,
      maxMembers: 0,
      creatorId: '',
      userLangs: [],
      origin: '',
      destination: '',
      description: '',
      date: '',
      imgSrc: ''
    }
  },
  computed: {
    ...mapState('user', {
      userId: 'id'
    })
  },
  async created () {
    const res = await axios.get(this.backendUrl + 'trips/' + this.tripId)
    const resData = res.data.trip
    this.numberOfMembers = resData.members.length
    this.maxMembers = resData.number_of_members
    this.creatorId = resData.user._id
    this.userLangs = resData.user.languages
    this.origin = resData.origin
    this.destination = resData.destination
    this.description = resData.description
    const dateObj = new Date(resData.date_of_trip)
    this.date = dateObj.toLocaleString('en-DE', {
      dateStyle: 'full',
      timeStyle: 'short'
    })
    // TODO: Hardcoded Google CSE Parameters
    const imgRes = await axios.get(
      'https://www.googleapis.com/customsearch/v1?key=AIzaSyDuwSlA-c6xKWp7K3XPKRhaqE91_iEE5NA&cx=011914005902216404247:ewomagcszot&searchType=image&q=' +
        this.destination
    )
    this.imgSrc = imgRes.data.items[0].link
    this.dataReady = true
  },
  methods: {
    async joinTrip () {
      try {
        this.loading = true
        if (this.userId) {
          // User is signed in
          if (this.userId !== this.creatorId) {
            // Trying to join someone else's trip
            if (this.numberOfMembers < this.maxMembers) {
              // Member limit is not reached
              const res = await axios.patch(
                this.backendUrl +
                  'trips/addreq/' +
                  this.tripId +
                  '/' +
                  this.userId
              )
              const resData = res.data.message
              if (resData === 'Trip updated') {
                this.buttonText = 'Request Sent'
                this.buttonColor = 'success'
                this.loading = false
              }
            } else {
              this.buttonText = 'Member limit is reached'
              this.buttonColor = 'error'
              this.loading = false
            }
          } else {
            // Trying to join own trip
            this.buttonText = 'Can\'t join your own trip'
            this.buttonColor = 'error'
            this.loading = false
          }
        } else {
          this.buttonText = 'Not Signed In'
          this.buttonColor = 'error'
          this.loading = false
        }
      } catch (error) {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped></style>
