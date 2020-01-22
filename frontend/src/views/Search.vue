<template>
  <v-row align="center" justify="center">
    <v-col cols="6" md="4">
      <p class="display-2 font-weight-light">Search</p>
      <v-form ref="form">
        <v-autocomplete
          rounded
          outlined
          label="Start of your Journey"
          v-model="origin"
          :items="destSelection"
          :rules="[rules.required]"
        ></v-autocomplete>
        <v-autocomplete
          rounded
          outlined
          label="End of your Journey"
          v-model="destination"
          :items="destSelection"
          :rules="[rules.required, startFinishRule]"
        ></v-autocomplete>
        <v-row align="center" justify="center">
          <v-col>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-on="on"
                  readonly
                  outlined
                  rounded
                  label="Date"
                  :value="date"
                  :rules="[rules.required]"
                />
              </template>
              <v-date-picker v-model="date" />
            </v-menu>
          </v-col>
          <v-col>
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-on="on"
                  readonly
                  outlined
                  rounded
                  label="Time"
                  :value="time"
                  :rules="[rules.required]"
                />
              </template>
              <v-time-picker format="24hr" v-model="time"></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
    <v-col cols="4">
      <v-row justify="center">
        <v-btn
          @click="go()"
          class="my-6"
          color="secondary"
          width="220"
          min-width="200"
          >Take me there
          <v-icon class="ml-2">mdi-train</v-icon>
        </v-btn>
        <v-btn
          @click="random()"
          class="my-6"
          color="secondary"
          width="220"
          min-width="200"
          >DestiNation Unknown</v-btn
        >
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import destinations from '@/assets/destinations.js'

export default {
  name: 'Search',
  data: () => {
    return {
      origin: '',
      destination: '',
      date: null,
      rules: {
        required: v => !!v || 'Should be filled in'
      }
    }
  },
  methods: {
    async go() {
      if (this.$refs.form.validate()) {
        //console.log('ARAMA')
      }
    },
    random() {
      const max = this.destSelection.length
      const random = Math.floor(Math.random() * max)
      this.destination = this.destSelection[random]
    }
  },
  computed: {
    destSelection() {
      const result = []
      for (let i = 0; i < destinations.length; i++) {
        result.push(destinations[i].name)
      }
      return result
    },
    startFinishRule() {
      return (
        this.origin !== this.destination ||
        "Origin and DestiNation can't be the same"
      )
    },
    formattedDate() {
      if (this.date) {
        const input = this.date.split('-')
        return input[2] + '.' + input[1] + '.' + input[0]
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped></style>
