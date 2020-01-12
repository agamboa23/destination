<template>
  <v-row>
    <v-col>
      <v-card>{{ tripId }}</v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'UserTripDetailedView',
  data: () => {
    return {
      //
    }
  },
  props: {
    tripId: {
      type: String,
      required: true
    }
  }
}
</script>

<style></style>
