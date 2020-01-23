<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="10">
      <h1 class="display-3 font-weight-thin">
        Discover a DestiNation
      </h1>
      <discover-card />
    </v-col>
  </v-row>
</template>

<script>
import DiscoverCardVue from '../components/DiscoverCard.vue'

export default {
  name: 'DiscoverView',
  components: {
    'discover-card': DiscoverCardVue
  },
  data: () => {
    return {
      //
    }
  }
}
</script>

<style></style>
