<template>
  <div>
    <div v-if="isEven">
      <v-row align="center" justify="center">
        <v-col cols="5" v-for="(item, index) in items.trips" :key="index">
          <trip-card
            :origin="item.origin"
            :destination="item.destination"
            :date="item.date"
            :id="item._id"
          />
        </v-col>
      </v-row>
    </div>
    <div v-if="!isEven">
      <v-row align="center" justify="center">
        <v-col cols="5" v-for="(item, index) in evenTrips" :key="index">
          <trip-card
            :origin="item.origin"
            :destination="item.destination"
            :date="item.date"
            :id="item._id"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="5">
          <trip-card
            :origin="items.trips[items.trips.length - 1].origin"
            :destination="items.trips[items.trips.length - 1].destination"
            :date="items.trips[items.trips.length - 1].date"
            :id="items.trips[items.trips.length - 1]._id"
          />
        </v-col>
        <v-col cols="5"></v-col>
      </v-row>
    </div>
  </div>
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
  computed: {
    isEven() {
      return this.items.count % 2 == 0
    },
    evenTrips() {
      const copy = [...this.items.trips]
      copy.pop()
      return copy
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped></style>
