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
      <v-col
        cols="12"
        sm="8"
        md="6"
      >
        <v-card class="elevation-12">
          <v-toolbar
            color="secondary"
            dark
            flat
          >
            <v-icon>mdi-image-filter-hdr</v-icon>
            <v-spacer />
            <v-toolbar-title>Create a Trip</v-toolbar-title>
            <v-spacer />
            <v-icon>mdi-road-variant</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-autocomplete
                v-model="origin"
                outlined
                color="secondary"
                label="Origin"
                hint="e.g. Tegernsee"
                prepend-inner-icon="mdi-city-variant"
                :rules="[rules.required]"
                no-data-text="Couldn't find Origin :("
                :items="places"
              />
              <v-autocomplete
                v-model="destination"
                outlined
                color="secondary"
                label="DestiNation"
                hint="e.g. Starnberg"
                prepend-inner-icon="mdi-run-fast"
                :rules="[rules.required]"
                no-data-text="Couldn't find DestiNation :("
                :items="places"
              />
              <v-row
                align="center"
                justify="space-around"
              >
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
                        v-model="computedDate"
                        label="Date of Trip"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="date"
                      scrollable
                      :first-day-of-week="1"
                      :allowed-dates="allowedDates"
                    >
                      <v-spacer />
                      <v-btn
                        text
                        color="primary"
                        @click="modal = false"
                      >
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
                      />
                    </template>
                    <v-time-picker
                      v-if="modal2"
                      v-model="time"
                      scrollable
                      format="24hr"
                    >
                      <v-spacer />
                      <v-btn
                        text
                        color="primary"
                        @click="modal2 = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="success"
                        @click="$refs.dialog2.save(time)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="numberOfMembers"
                    color="secondary"
                    label="Number of Participants"
                    type="number"
                    prepend-icon="mdi-nature-people"
                    :rules="[moreThanTwoRule]"
                  />
                </v-col>
              </v-row>
              <v-textarea
                v-model="description"
                outlined
                color="secondary"
                label="Description of Trip"
                :rules="[rules.required]"
                rows="1"
                auto-grow
                counter
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="px-4"
              color="error"
              @click="resetEntries()"
            >
              Reset Entries
            </v-btn>
            <v-spacer />
            <v-btn
              class="px-4"
              color="secondary"
              :loading="loading"
              :disabled="!valid || loading"
              @click="createTrip()"
            >
              Submit
            </v-btn>
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
          <v-btn
            color="white"
            text
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import placesPack from '@/assets/destinations.js'
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'CreateTrip',
  data: () => {
    return {
      backendUrl: process.env.VUE_APP_BACKENDURL,
      valid: true,
      rules: {
        required: v => !!v || 'Required'
      },
      origin: '',
      destination: '',
      today: new Date().toISOString().split('T')[0],
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
    moreThanTwoRule () {
      return () =>
        this.numberOfMembers >= 2 || 'Min. number of participants is 2 :)'
    },
    places () {
      const result = []
      for (let i = 0; i < placesPack.length; i++) {
        result.push(placesPack[i].name)
      }
      return result
    },
    computedDate () {
      const [year, month, day] = this.date.split('-')
      return `${day}.${month}.${year}`
    },
    dateToSubmit () {
      return this.date + ' ' + this.time + ':00'
    }
  },
  mounted () {
    this.date = this.setDate()
  },
  methods: {
    invokeSnackbar (text, color) {
      this.snacktext = text
      this.snackcolor = color
      this.snackbar = true
    },
    setDate () {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString().split('T')[0]
    },
    resetEntries () {
      this.origin = ''
      this.destination = ''
      this.date = this.setDate()
      this.numberOfMembers = 2
      this.description = 'An awesome trip to an awesome DestiNation!'
    },
    allowedDates (val) {
      return val >= this.today
    },
    async createTrip () {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const trip = {
            userId: this.userId,
            destination: this.destination,
            origin: this.origin,
            // "year-month-day hour:minute:second"
            date_of_trip: this.dateToSubmit,
            number_of_members: this.numberOfMembers,
            isOpen: true,
            description: this.description,
            members: [],
            requests: []
          }
          // POST Request
          const res = await axios.post(this.backendUrl + 'trips', trip)
          this.invokeSnackbar(res.data.message, 'success')
          this.loading = false
          setTimeout(() => {
            this.$router.push({ name: 'home' })
          }, 1500)
        } catch (error) {
          this.invokeSnackbar("Couldn't create Trip :(", 'error')
          this.loading = false
        }
      }
    }
  }
}
</script>

<style></style>
