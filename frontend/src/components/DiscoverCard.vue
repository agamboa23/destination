<template>
  <v-card>
    <v-tabs
      v-model="tab"
      background-color="secondary"
      grow
    >
      <v-tab @click="reloadPage()">
        1. Interests
      </v-tab>
      <v-tab :disabled="stereotypeSelection.length === 0">
        2. Options
      </v-tab>
      <v-tab disabled>
        3. Destinations
      </v-tab>
    </v-tabs>
    <v-overlay v-model="overlay">
      <v-progress-circular
        size="150"
        width="10"
        color="secondary"
        indeterminate
      />
    </v-overlay>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-item-group
              v-model="stereotypeSelection"
              multiple
              mandatory
            >
              <v-container>
                <v-row
                  align="start"
                  justify="center"
                >
                  <v-col
                    v-for="stereotype in stereotypes"
                    :key="stereotype.id"
                  >
                    <v-item
                      v-slot:default="{ active, toggle }"
                      :value="stereotype.id"
                    >
                      <discover-detail-card
                        :active="active"
                        :avatar-u-r-l="stereotype.image_url"
                        :is-destination="false"
                        :name="stereotype.name"
                        :sub-name="stereotype.description"
                        @click.native="toggle"
                      />
                    </v-item>
                  </v-col>
                </v-row>
              </v-container>
            </v-item-group>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="stereotypeSelection.length === 0"
              @click="tab = 1"
              class="elevation-12"
              large
              block
              color="secondary"
            >
              Next Page
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <discover-options-card
          v-model="options"
          :next-disabled="nextDisabled"
          @next="getDestinations()"
        />
      </v-tab-item>

      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-btn
              @click="rankSort('random')"
              outlined
              color="secondary"
            >
              Random Sort
            </v-btn>
            <v-btn
              @click="rankSort('location')"
              outlined
              color="secondary"
            >
              Geo-Rank Sort
            </v-btn>
            <v-btn
              @click="rankSort('semantic')"
              outlined
              color="secondary"
            >
              Semantic Sort
            </v-btn>
            <v-btn
              @click="rankSort('all')"
              outlined
              color="secondary"
            >
              Geo-Semantic Sort
            </v-btn>
            <v-row
              align="start"
              justify="center"
            >
              <v-col
                v-for="destination in topDests"
                :key="destination.id"
              >
                <discover-detail-card
                  :is-destination="true"
                  :avatar-u-r-l="destination.image"
                  :lat="
                    destination.center
                      ? destination.center.lat.toString()
                      : destination.lat.toString()
                  "
                  :lon="
                    destination.center
                      ? destination.center.lon.toString()
                      : destination.lon.toString()
                  "
                  :tags="destination.tags"
                  :users-location="usersLocation"
                />
              </v-col>
            </v-row>
            <v-btn
              :disabled="loadDisable"
              @click="morePagination()"
              outlined
              color="secondary"
            >
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
      loadDisable: false,
      pagination: 20,
      startIndex: 0,
      stereotypes: [],
      stereotypeSelection: [],
      options: {},
      destinations: [],
      topDests: [],
      usersLocation: ''
    }
  },
  computed: {
    nextDisabled () {
      return !this.options.location
    }
  },
  created () {
    this.getStereotypes()
  },
  methods: {
    reloadPage () {
      window.location.reload()
    },
    async rankSort (prankSort) {
      this.overlay = true
      var currentList = {
        destination_list: this.destinations,
        user_id: this.options.personalID
      }
      if (prankSort === 'random') {
        this.destinations = this.destinations.sort(() => Math.random() - 0.5)
      } else {
        const responseRank = await axios.post(this.recommenderUrl + 'recsys/recommendations/rank_sort/' + prankSort, currentList).catch(x => console.log(x))
        this.destinations = responseRank.data.destinations
      }
      // this.destinations = this.destinations.sort(() => Math.random() - 0.5)
      var tempTop = this.destinations.slice(0, this.pagination)
      this.startIndex = 0
      // var tempTop = responseRank.data.destinations.slice(0, this.pagination)
      tempTop = await this.updateImages(
        tempTop)
      this.topDests = []
      this.topDests = tempTop
      this.overlay = false
    },
    async morePagination () {
      this.startIndex = this.startIndex + this.pagination
      if (this.startIndex + this.pagination <= this.destinations.length) {
        this.overlay = true
        const sliced = this.destinations.slice(
          this.startIndex,
          this.startIndex + this.pagination
        )
        const temp = await this.getObjWithCommons(sliced)
        this.topDests = [...this.topDests, ...temp]
        this.overlay = false
      } else {
        this.loadDisable = true
      }
    },
    async updateImages (arr) {
      let coors = ''
      coors = arr
        .map(x =>
          x.type === 'node'
            ? x.lat + '|' + x.lon
            : x.center.lat + '|' + x.center.lon
        )
        .join(',')
      const res = await axios.get(
        this.recommenderUrl + 'recsys/commons/images/' + coors
      )
      const resData = res.data.results
      for (let i = 0; i < arr.length; i++) {
        arr[i].image = resData[i].image_url
      }
      return arr
    },
    async getObjWithCommons (arr) {
      let coors = ''

      coors = arr
        .slice(0, this.pagination)
        .map(x =>
          x.type === 'node'
            ? x.lat + '|' + x.lon
            : x.center.lat + '|' + x.center.lon
        )
        .join(',')
      const res = await axios.get(
        this.recommenderUrl + 'recsys/commons/images/' + coors
      )
      const resData = res.data.results
      for (let i = 0; i < Math.min(this.pagination, arr.length); i++) {
        arr[i].image = resData[i].image_url
      }
      return arr
    },
    async getStereotypes () {
      // TODO Try Catch
      this.overlay = true
      const res = await axios.get(this.recommenderUrl + 'recsys/stereotypes/')
      const stereotypes = res.data.Stereotypes
      this.stereotypes = stereotypes
      this.overlay = false
    },
    async getDestinations () {
      this.overlay = true
      const optString = this.stereotypeSelection.toString() + '/destinations'
      let wheelie = ''
      this.usersLocation = this.options.location
      if (this.options.wheelchair) {
        wheelie = 't["wheelchair"]%3D%3D"yes"'
      } else {
        wheelie = ''
      }
      let paramObj = {}
      if ('maxDistance' in this.options) {
        if (wheelie) {
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
            location: this.options.location,
            maxDistance: this.options.maxDistance,
            minDistance: this.options.minDistance,
            aroundMetric: this.options.aroundMetric,
            bt_reachable: this.options.bt_reachable
          }
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
      const destinations = res.data.destinations
      this.destinations = destinations
      this.topDests = destinations.slice(this.startIndex, this.pagination)
      this.topDests = await this.getObjWithCommons(
        this.topDests,
        this.pagination
      )
      this.tab = 2
      this.overlay = false
    }
  }
}
</script>

<style></style>
