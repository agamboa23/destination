<template>
  <v-card class="mx-auto" max-width="344" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">From {{ origin }}</div>
        <v-list-item-title class="headline mb-1">{{
          destination
        }}</v-list-item-title>
        <v-list-item-subtitle>{{ date }} </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar tile size="80" color="secondary"></v-list-item-avatar>
    </v-list-item>

    <v-card-actions>
      <v-btn text>Join</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'TripCard',
  props: {
    origin: String,
    destination: String,
    date: String,
    id: String
  }
}
</script>

<style></style>
