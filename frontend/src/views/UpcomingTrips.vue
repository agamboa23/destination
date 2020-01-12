<template>
  <v-row v-if="isEven" align="center" justify="center">
    <v-col cols="5" v-for="(item, index) in items.trips" :key="index">
      <trip-card
        :id="item._id"
        :origin="item.origin"
        :destination="item.destination"
        :date="item.date"
        :membersLength="item.members_length"
        :maxMembers="item.number_of_members"
      />
    </v-col>
  </v-row>

  <div v-else>
    <v-row align="center" justify="center">
      <v-col cols="5" v-for="(item, index) in evenTrips" :key="index">
        <trip-card
          :id="item._id"
          :origin="item.origin"
          :destination="item.destination"
          :date="item.date"
          :membersLength="item.members_length"
          :maxMembers="item.number_of_members"
        />
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="5">
        <trip-card
          :id="items.trips[items.count - 1]._id"
          :origin="items.trips[items.count - 1].origin"
          :destination="items.trips[items.count - 1].destination"
          :date="items.trips[items.count - 1].date"
          :membersLength="items.trips[items.count - 1].members_length"
          :maxMembers="items.trips[items.count - 1].number_of_members"
        />
      </v-col>
      <v-col cols="5"></v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import UpcomingTripCardVue from '../components/UpcomingTripCard.vue'

export default {
  name: 'UpcomingTrips',
  components: {
    'trip-card': UpcomingTripCardVue
  },
  data: () => {
    return {
      items: {
        count: 0,
        trips: []
      }
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
  async created() {
    const res = await axios.get('http://localhost:3000/trips/upcoming')
    this.items = res.data
  }
}
</script>

<style scoped></style>
