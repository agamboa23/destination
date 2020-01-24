<template>
  <v-card>
    <v-tabs v-model="tab" background-color="secondary" grow>
      <v-tab>
        Stereotypes
      </v-tab>
      <v-tab :disabled="stereotypeSelection.length === 0">
        Options
      </v-tab>
      <v-tab disabled>
        Destinations
      </v-tab>
    </v-tabs>
    <v-overlay v-model="overlay">
      <v-progress-circular
        size="150"
        width="10"
        color="secondary"
        indeterminate
      ></v-progress-circular>
    </v-overlay>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-item-group v-model="stereotypeSelection" multiple mandatory>
              <v-container>
                <v-row align="start" justify="center">
                  <v-col v-for="stereotype in stereotypes" :key="stereotype.id">
                    <v-item
                      v-slot:default="{ active, toggle }"
                      :value="stereotype.id"
                    >
                      <discover-detail-card
                        @click.native="toggle"
                        :active="active"
                        :itemId="stereotype.id"
                        :avatarURL="stereotype.image_url"
                        :isImg="true"
                        :name="stereotype.name"
                        :subName="stereotype.description"
                      ></discover-detail-card>
                    </v-item>
                  </v-col>
                </v-row>
              </v-container>
            </v-item-group>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <discover-options-card v-model="options" />
        <v-btn
          :disabled="nextDisabled"
          class="elevation-12"
          block
          color="secondary"
          @click="getDestinations()"
        >
          Next
        </v-btn>
      </v-tab-item>

      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-row align="start" justify="center">
              <v-col v-for="destination in computedDest" :key="destination.id">
                <discover-detail-card
                  :avatarURL="destination.image"
                  :lat="'' + destination.lat"
                  :lon="'' + destination.lon"
                  :name="
                    destination.tags.name
                      ? destination.tags.name
                      : destination.tags.tourism
                      ? destination.tags.tourism
                      : randomProperty(destination.tags)
                  "
                  :subName="
                    destination.tags.name
                      ? destination.tags.tourism
                        ? destination.tags.tourism
                        : randomProperty(destination.tags)
                      : randomProperty(destination.tags)
                  "
                ></discover-detail-card>
              </v-col>
            </v-row>
            <v-btn outlined color="secondary" @click="morePagination()">
              Load More
            </v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import axios from 'axios'
import DiscoverDetailCardVue from './DiscoverDetailCard.vue'
import DiscoverOptionsCardVue from './DiscoverOptionsCard.vue'

export default {
  name: 'DiscoverCard',
  components: {
    'discover-detail-card': DiscoverDetailCardVue,
    'discover-options-card': DiscoverOptionsCardVue
  },
  data: () => {
    return {
      recommenderUrl: process.env.VUE_APP_RECOMMENDERURL,
      overlay: false,
      tab: null,
      stereotypes: [],
      stereotypeSelection: [],
      options: {},
      destinations: []
    }
  },
  computed: {
    nextDisabled() {
      return !this.options.location
    },
    computedDest() {
      // let temp = []
      // for (let i = 0; i < this.pagination; i++) {
      //   if (this.destinations[i].type !== 'node') {

      //   } else {
      //     temp.push(this.destinations[i])
      //   }
      // }
      return this.destinations.slice(0, this.pagination)
    }
  },
  methods: {
    randomProperty(obj) {
      // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
      var keys = Object.keys(obj)
      return obj[keys[(keys.length * Math.random()) << 0]]
    },
    async getObjWithCommons(dests, n) {
      let coors = ''
      for (let i = 0; i < n - 1; i++) {
        coors = coors + dests[i].lat + '|' + dests[i].lon + ','
      }
      coors = coors + dests[n - 1].lat + '|' + dests[n - 1].lon
      const res = await axios.get(
        this.recommenderUrl + 'recsys/commons/images/' + coors
      )
      const resData = res.data.results
      for (let i = 0; i < n; i++) {
        this.destinations[i].image = resData[i].image_url
      }
      return dests
    },
    async getStereotypes() {
      // TODO Try Catch
      this.overlay = true
      const res = await axios.get(this.recommenderUrl + 'recsys/stereotypes/')
      const stereotypes = res.data.Stereotypes
      this.stereotypes = stereotypes
      this.overlay = false
    },
    async getDestinations() {
      this.overlay = true
      const optString = this.stereotypeSelection.toString() + '/destinations'
      let wheelie = ''
      if (this.options.wheelchair) {
        wheelie = 't["wheelchair"]%3D%3D"yes"'
      } else {
        wheelie = 't["wheelchair"]%3D%3D"no"'
      }
      let paramObj = {}
      if ('maxDistance' in this.options) {
        paramObj = {
          location: this.options.location,
          maxDistance: this.options.maxDistance,
          minDistance: this.options.minDistance,
          aroundMetric: this.options.aroundMetric,
          bt_reachable: this.options.bt_reachable,
          filter: wheelie
        }
      } else {
        paramObj = {
          location: this.options.location
        }
      }
      const res = await axios.get(
        this.recommenderUrl + 'recsys/recommendations/stereotypes/' + optString,
        {
          params: paramObj
        }
      )
      let destinations = res.data.destinations
      this.destinations = destinations
      this.destinations = this.getObjWithCommons(
        this.destinations,
        this.pagination
      )
      this.tab = 2
      this.overlay = false
    }
  },
  created() {
    this.getStereotypes()
  }
}
</script>

<style></style>
