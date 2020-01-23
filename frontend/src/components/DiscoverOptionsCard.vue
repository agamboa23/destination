<template>
  <v-card flat>
    <v-card-text>
      <v-row align="center" justify="center">
        <v-col cols="12" md="5">
          <v-btn color="secondary">Use Current Location</v-btn>
        </v-col>
        <v-col cols="12" md="1">
          <span class="headline font-weight-thin">or</span>
        </v-col>
        <v-col cols="12" md="5">
          <v-autocomplete
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
        </v-col>
      </v-row>
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
      location: '',
      maxDistance: 15,
      minDistance: 0,
      aroundMetric: 'km',
      bt_reachable: true,
      wheelchair: false
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
  watch: {
    smartModel() {
      this.$emit('input', this.smartModel)
    }
  }
}
</script>

<style></style>
