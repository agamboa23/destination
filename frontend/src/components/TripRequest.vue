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
      <v-dialog v-model="dialog" persistent max-width="290">
        <template v-slot:activator="{ on }">
          <v-btn class="ml-5" color="error" small tile outlined v-on="on">
            <v-icon class="mr-2">mdi-cancel</v-icon>
            Cancel Trip
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">
            Cancel Trip from {{ origin }} to {{ destination }}?
          </v-card-title>
          <v-card-text>
            By clicking on "Cancel Trip" you're irreversibly deleting the trip.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">
              Back
            </v-btn>
            <v-btn
              color="error"
              :disabled="cancelDisabled"
              @click="deleteTrip()"
            >
              Cancel Trip
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-spacer />
      {{ members.length }}/{{ maxMembers }}
    </v-card-title>
    <v-card-subtitle class="overline">
      {{ date }}
    </v-card-subtitle>
    <v-card-text>
      Members:
      <span v-for="(item, index) in members" :key="index">
        <name :id="item" /> {{ members.length == 1 ? '' : '/' }}
      </span>
    </v-card-text>
    <v-card-actions>
      <span class="overline">Requests:</span>
      <div v-for="(name, index) in requests" :key="index">
        <name class="mx-12" :id="name"></name>
        <v-btn color="green" small icon @click="accept(name)">
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn color="red" small icon @click="reject(name)">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </div>
    </v-card-actions>
    <v-snackbar
      v-model="snackbar"
      :color="snackcolor"
      :top="true"
      :right="true"
      :timeout="timeout"
    >
      {{ snacktext }}
      <v-btn color="white" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
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
      cancelDisabled: false,
      dialog: false,
      requests: [],
      members: [],
      maxMembers: 0,
      origin: '',
      destination: '',
      date: ''
    }
  },
  methods: {
    invokeSnackbar(text, color) {
      this.snacktext = text
      this.snackcolor = color
      this.snackbar = true
    },
    async deleteTrip() {
      //Delete Trip set dialog false reload page
      try {
        this.cancelDisabled = true
        const res = await axios.delete(
          'http://localhost:3000/trips/' + this.tripId
        )
        this.dialog = false
        this.cancelDisabled = false
        this.invokeSnackbar(res.data.message, 'success')
        setTimeout(() => {
          location.reload()
        }, 1000)
      } catch (error) {
        this.dialog = false
        this.cancelDisabled = false
        this.invokeSnackbar(`Couldn't delete trip :(`, 'error')
      }
    },
    async accept(id) {
      await axios.patch(
        'http://localhost:3000/trips/accreq/' + this.tripId + '/' + id
      )
      this.init()
    },
    async reject(id) {
      await axios.patch(
        'http://localhost:3000/trips/rejectreq/' + this.tripId + '/' + id
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
