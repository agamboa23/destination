<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      cols="6"
      md="4"
    >
      <p class="display-2 font-weight-light">
        Search
      </p>
      <v-form ref="form">
        <v-autocomplete
          v-model="origin"
          rounded
          outlined
          label="Start of your Journey"
          :items="destSelection"
          :rules="[rules.required]"
        />
        <v-autocomplete
          v-model="destination"
          rounded
          outlined
          label="End of your Journey"
          :items="destSelection"
          :rules="[rules.required, startFinishRule]"
        />
        <v-row
          align="center"
          justify="center"
        >
          <v-col>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-text-field
                  readonly
                  outlined
                  rounded
                  label="Date"
                  :value="date"
                  :rules="[rules.required]"
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="date" />
            </v-menu>
          </v-col>
          <v-col>
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-text-field
                  readonly
                  outlined
                  rounded
                  label="Time"
                  :value="time"
                  :rules="[rules.required]"
                  v-on="on"
                />
              </template>
              <v-time-picker
                v-model="time"
                format="24hr"
              />
            </v-menu>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
    <v-col cols="4">
      <v-row justify="center">
        <v-btn
          class="my-6"
          color="secondary"
          width="220"
          min-width="200"
          @click="go()"
        >
          Take me there
          <v-icon class="ml-2">
            mdi-train
          </v-icon>
        </v-btn>
        <v-btn
          class="my-6"
          color="secondary"
          width="220"
          min-width="200"
          @click="random()"
        >
          DestiNation Unknown
        </v-btn>
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
  computed: {
    destSelection () {
      const result = []
      for (let i = 0; i < destinations.length; i++) {
        result.push(destinations[i].name)
      }
      return result
    },
    startFinishRule () {
      return (
        this.origin !== this.destination ||
        "Origin and DestiNation can't be the same"
      )
    },
    formattedDate () {
      if (this.date) {
        const input = this.date.split('-')
        return input[2] + '.' + input[1] + '.' + input[0]
      } else {
        return ''
      }
    }
  },
  methods: {
    async go () {
      // No search functionality implemented
      this.$refs.form.validate()
    },
    random () {
      const max = this.destSelection.length
      const random = Math.floor(Math.random() * max)
      this.destination = this.destSelection[random]
    }
  }
}
</script>

<style scoped></style>
