<template>
  <v-card class="text-center" flat>
    <v-card-text>
      <v-row align="center" justify="center">
        <v-col cols="4">
          <v-switch
            v-model="moreOptions"
            label="More Options"
            color="secondary"
          ></v-switch>
        </v-col>
      </v-row>
      <v-btn class="my-6 mr-12" @click="getCurrentLocation()" color="secondary">
        {{ isLoc ? `Don't use Current Location` : 'Use Current Location' }}
      </v-btn>
      <span class="my-6 ml-12 headline font-weight-thin">
        {{ isLoc ? location : 'or' }}
      </span>
      <v-autocomplete
        :disabled="isLoc"
        class="my-6"
        outlined
        color="secondary"
        label="Choose from List"
        hint="e.g. Tegernsee"
        prepend-inner-icon="mdi-city-variant"
        no-data-text="Couldn't find location :("
        :items="places"
        item-text="name"
        item-value="geo"
        v-model="location"
      ></v-autocomplete>
      <template v-if="moreOptions">
        <v-row align="center" justify="center">
          <v-col cols="6">
            <v-select
              color="secondary"
              label="Distance in"
              v-model="aroundMetric"
              :items="aroundSelection"
              item-text="name"
              item-value="abbr"
            >
            </v-select>
            <v-text-field
              color="secondary"
              v-model="minDistance"
              label="Minimum Distance"
              type="number"
              persistent-hint
              :hint="minDistance + ' ' + aroundMetric"
              :rules="[rules.betweenZeroAndHundred]"
            ></v-text-field>
            <v-text-field
              color="secondary"
              v-model="maxDistance"
              label="Maximum Distance"
              type="number"
              persistent-hint
              :hint="maxDistance + ' ' + aroundMetric"
              :rules="[rules.betweenZeroAndHundred]"
            ></v-text-field>
            <v-checkbox
              v-model="bt_reachable"
              label="BayernTicket Reachable"
              color="secondary"
            ></v-checkbox>
            <v-checkbox
              v-model="wheelchair"
              label="Wheelchair Accessible"
              color="secondary"
            ></v-checkbox>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import placesPack from '@/assets/destinations.js'

export default {
  name: 'DiscoverOptionsCard',
  data: () => {
    return {
      moreOptions: false,
      isLoc: false,
      location: '',
      maxDistance: 10,
      minDistance: 0,
      aroundSelection: [
        { name: 'Meters', abbr: 'm' },
        { name: 'Kilometers', abbr: 'km' },
        { name: 'Hours', abbr: 'h' },
        { name: 'Minutes', abbr: 'min' }
      ],
      aroundMetric: 'km',
      bt_reachable: true,
      wheelchair: false,
      rules: {
        betweenZeroAndHundred: v => (v <= 100 && v >= 0) || 'Between 0 and 100'
      }
    }
  },
  computed: {
    places() {
      const result = []
      for (let i = 0; i < placesPack.length; i++) {
        let item = {
          name: placesPack[i].name,
          geo: placesPack[i].geo
        }
        result.push(item)
      }
      return result
    },
    smartModel() {
      if (this.moreOptions) {
        return {
          location: this.location,
          maxDistance: this.maxDistance,
          minDistance: this.minDistance,
          aroundMetric: this.aroundMetric,
          bt_reachable: this.bt_reachable,
          wheelchair: this.wheelchair
        }
      } else {
        return { location: this.location }
      }
    }
  },
  methods: {
    getCurrentLocation() {
      if (!this.isLoc) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            this.location =
              position.coords.latitude + '|' + position.coords.longitude
          })
          this.isLoc = !this.isLoc
        } else {
          window.alert('Geolocation is not supported by this browser.')
        }
      } else {
        this.location = ''
        this.isLoc = !this.isLoc
      }
    }
  },
  watch: {
    smartModel() {
      this.$emit('input', this.smartModel)
    }
  }
}
</script>

<style></style>
