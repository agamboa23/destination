<template>
  <v-card
    class="mx-auto"
    max-width="400"
    outlined
    :color="hover ? 'info' : ''"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4 text-capitalize">{{ subName }}</div>
        <v-list-item-title class="headline mb-1 text-capitalize">
          {{ name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-btn x-small outlined color="black">More Information</v-btn>
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar tile size="80">
        <v-img v-if="isImg" :src="avatarURL" contain></v-img>
        <v-btn x-large v-else text icon color="red" @click="toGoogleMaps()">
          <v-icon>mdi-map-marker</v-icon>
        </v-btn>
      </v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: 'DiscoverDetailCard',
  props: {
    type: String,
    itemId: Number,
    avatarURL: String,
    isImg: Boolean,
    name: String,
    subName: String,
    lat: String,
    lon: String
  },
  data: () => {
    return {
      hover: false
    }
  },
  methods: {
    toGoogleMaps() {
      window.open(
        'https://www.google.com/maps/search/?api=1&query=' +
          this.lat +
          ',' +
          this.lon,
        '_blank'
      )
    }
  }
}
</script>

<style></style>
