<template>
  <v-card class="mx-auto" outlined :disabled="completed" @click="toDetail()">
    <v-card-title class="title mb-1">
      {{ origin }}
      <v-icon class="mx-2">mdi-arrow-right</v-icon>
      {{ destination }}
      <v-spacer />
      <span class="font-italic font-weight-light">
        {{ members.length }}/{{ maxMembers }}
      </span>
    </v-card-title>
    <v-card-subtitle class="overline">
      {{ date }}
    </v-card-subtitle>
    <v-card-text>
      <div>
        Members:
        <span v-for="(item, index) in members" :key="index">
          <name :id="item" /> {{ members.length == 1 ? '' : '/' }}
        </span>
      </div>
      <div>
        Requests:
        <span v-for="(name, index) in requests" :key="index">
          <name :id="name" /> {{ members.length == 1 ? '' : '/' }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import NameVue from './Name.vue'

export default {
  name: 'MiniTripOverview',
  components: {
    name: NameVue
  },
  props: {
    tripId: String,
    requests: Array,
    members: Array,
    maxMembers: Number,
    origin: String,
    destination: String,
    date: String,
    completed: Boolean
  },
  methods: {
    toDetail() {
      this.$router.push({
        name: 'userTripDetailed',
        params: { destination: this.destination, tripId: this.tripId }
      })
    }
  }
}
</script>

<style></style>
