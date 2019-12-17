<template>
  <div>
    <v-row align="center" justify="center">
      <v-btn class="ma-4 elevation-6" color="secondary" width="600">
        Create a Trip
      </v-btn>
    </v-row>
    <v-row align="center" justify="center">
      <v-btn disabled class="ma-4 elevation-6" color="secondary" width="600">
        Discover DestiNations
      </v-btn>
    </v-row>
    <v-row align="center" justify="center">
      <v-btn
        :to="{ name: 'upcoming' }"
        class="ma-4"
        color="secondary"
        width="600"
      >
        Upcoming Trips
      </v-btn>
    </v-row>
  </div>
</template>
