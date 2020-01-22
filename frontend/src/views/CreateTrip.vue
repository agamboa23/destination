<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="elevation-12">
        <v-toolbar color="secondary" dark flat>
          <v-icon>mdi-image-filter-hdr</v-icon>
          <v-spacer></v-spacer>
          <v-toolbar-title>Create a Trip</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon>mdi-road-variant</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-autocomplete
              outlined
              color="secondary"
              label="Origin"
              hint="e.g. Tegernsee"
              prepend-inner-icon="mdi-city-variant"
              :rules="[rules.required]"
              no-data-text="Couldn't find Origin :("
              :items="places"
              v-model="origin"
            ></v-autocomplete>
            <v-autocomplete
              outlined
              color="secondary"
              label="DestiNation"
              hint="e.g. Starnberg"
              prepend-inner-icon="mdi-run-fast"
              :rules="[rules.required]"
              no-data-text="Couldn't find DestiNation :("
              :items="places"
              v-model="destination"
            ></v-autocomplete>
            <v-row align="center" justify="space-around">
              <v-col cols="4">
                <v-dialog
                  ref="dialog1"
                  v-model="modal"
                  :return-value.sync="date"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="date"
                      label="Date of Trip"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    scrollable
                    :first-day-of-week="1"
                    :allowed-dates="allowedDates"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="success"
                      @click="$refs.dialog1.save(date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
              <v-col cols="4">
                <v-dialog
                  ref="dialog2"
                  v-model="modal2"
                  :return-value.sync="time"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="time"
                      label="Time of Trip"
                      prepend-icon="mdi-clock-outline"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="modal2"
                    v-model="time"
                    scrollable
                    format="24hr"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal2 = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="success"
                      @click="$refs.dialog2.save(time)"
                      >OK</v-btn
                    >
                  </v-time-picker>
                </v-dialog>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  color="secondary"
                  v-model="numberOfMembers"
                  label="Number of Participants"
                  type="number"
                  prepend-icon="mdi-nature-people"
                  :rules="[moreThanTwoRule]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-textarea
              outlined
              color="secondary"
              label="Description of Trip"
              :rules="[rules.required]"
              v-model="description"
              rows="1"
              auto-grow
              counter
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn class="px-4" color="error" @click="resetEntries()"
            >Reset Entries</v-btn
          >
          <v-spacer />
          <v-btn
            class="px-4"
            color="secondary"
            :loading="loading"
            :disabled="!valid || loading"
            @click="createTrip()"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
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
    </v-col>
  </v-row>
</template>

<script>
import placesPack from '@/assets/destinations.js'
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'CreateTrip',
  data: () => {
    return {
      valid: true,
      rules: {
        required: v => !!v || 'Required'
      },
      origin: '',
      destination: '',
      date: '',
      time: '08:00',
      numberOfMembers: 2,
      description: 'An awesome trip to an awesome DestiNation!',
      modal: false,
      modal2: false,
      loading: false,
      snackbar: false,
      snackcolor: '',
      snacktext: '',
      timeout: 3000
    }
  },
  computed: {
    ...mapState('user', {
      userId: 'id'
    }),
    moreThanTwoRule() {
      return () =>
        this.numberOfMembers >= 2 || 'Min. number of participants is 2 :)'
    },
    places() {
      const result = []
      for (let i = 0; i < placesPack.length; i++) {
        result.push(placesPack[i].name)
      }
      return result
    },
    betterDate() {
      return this.date + ' ' + this.time + ':00'
    }
  },
  methods: {
    invokeSnackbar(text, color) {
      this.snacktext = text
      this.snackcolor = color
      this.snackbar = true
    },
    getTodaysDate() {
      //https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
      var yyyy = today.getFullYear()
      return yyyy + '-' + mm + '-' + dd
    },
    resetEntries() {
      this.origin = ''
      this.destination = ''
      this.date = this.getTodaysDate()
      this.numberOfMembers = 2
      this.description = 'An awesome trip to an awesome DestiNation!'
    },
    allowedDates(val) {
      return val >= this.getTodaysDate()
    },
    async createTrip() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const trip = {
            userId: this.userId,
            destination: this.destination,
            origin: this.origin,
            // "year-month-day hour:minute:second"
            date_of_trip: this.betterDate,
            number_of_members: this.numberOfMembers,
            isOpen: true,
            description: this.description,
            members: [],
            requests: []
          }
          //POST Request
          const res = await axios.post('http://localhost:3000/trips', trip)
          this.invokeSnackbar(res.data.message, 'success')
          this.loading = false
          setTimeout(() => {
            this.$router.push({ name: 'home' })
          }, 1500)
        } catch (error) {
          // this.$refs.form.reset()
          console.log(error)
          this.invokeSnackbar("Couldn't create Trip :(", 'error')
          this.loading = false
        }
      }
    }
  },
  mounted() {
    this.date = this.getTodaysDate()
  }
}
</script>

<style></style>
