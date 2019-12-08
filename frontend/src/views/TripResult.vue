<template>
  <v-row align="center" justify="center">
    <v-col cols="10" v-for="(item, key) in items.trips" :key="key">
      <trip-card
        :origin="item.origin"
        :destination="item.destination"
        :date="item.date"
        :id="item._id"
      />
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import TripCardVue from '../components/TripCard.vue'

export default {
  name: 'TripResult',
  components: {
    'trip-card': TripCardVue
  },
  data: () => {
    return {
      items: {}
    }
  },
  methods: {
    async init() {
      const res = await axios.get('http://localhost:3000/trips/')
      console.log(res.data)
      const result = {
        count: res.data.count,
        trips: res.data.trips
      }
      this.items = result
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped></style>
