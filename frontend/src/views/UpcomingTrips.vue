<template>
  <div v-if="dataReady">
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
            :origin="items.trips[items.count - 1].origin"
            :destination="items.trips[items.count - 1].destination"
            :date="items.trips[items.count - 1].date"
            :id="items.trips[items.count - 1]._id"
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
  name: 'UpcomingTrips',
  components: {
    'trip-card': TripCardVue
  },
  data: () => {
    return {
      dataReady: false,
      items: {},
      res: null
    }
  },
  methods: {
    async init() {
      const res = await axios.get('http://localhost:3000/trips/')
      this.res = res
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
  async mounted() {
    console.log('MOUNTED')
    this.init().then(() => {
      this.items = this.res.data
      this.dataReady = true
    })
  }
}
</script>

<style scoped></style>
