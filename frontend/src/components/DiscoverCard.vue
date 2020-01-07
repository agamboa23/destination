<template>
  <v-card>
    <v-tabs v-model="tab" background-color="secondary" grow>
      <v-tab v-for="item in items" :key="item">
        {{ item }}
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
            <v-row align="start" justify="center">
              <v-col v-for="province in provinces" :key="province.osm_id">
                <discover-detail-card
                  type="province"
                  :itemId="province.osm_id"
                  :avatarURL="province.wappen_url"
                  :isImg="true"
                  :name="province.name_eng"
                  :subName="province.name"
                  @click.native="getDistricts(province.osm_id)"
                ></discover-detail-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-row align="start" justify="center">
              <v-col v-for="district in districts" :key="district.osm_id">
                <discover-detail-card
                  type="district"
                  :itemId="district.osm_id"
                  :avatarURL="district.wappen_url"
                  :isImg="true"
                  :name="district.name"
                  :subName="
                    'Population: ' + beautifyPopulation(district.population)
                  "
                  @click.native="getDestinations(district.osm_id)"
                ></discover-detail-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-row align="start" justify="center">
              <v-col v-for="destination in destinations" :key="destination.id">
                <discover-detail-card
                  type="destination"
                  :isImg="false"
                  :lat="destination.lat"
                  :lon="destination.lon"
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
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import axios from 'axios'
import DiscoverDetailCardVue from './DiscoverDetailCard.vue'

export default {
  name: 'DiscoverCard',
  components: {
    'discover-detail-card': DiscoverDetailCardVue
  },
  data: () => {
    return {
      overlay: false,
      tab: null,
      items: ['Provinces', 'Districts', 'DestiNations'],
      provinces: [],
      districts: [],
      destinations: []
    }
  },
  methods: {
    beautifyPopulation(pop) {
      let result = pop.slice(1)
      // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
      return result.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    randomProperty(obj) {
      // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
      var keys = Object.keys(obj)
      return obj[keys[(keys.length * Math.random()) << 0]]
    },
    async getProvinces() {
      // TODO Try Catch
      this.overlay = true
      const res = await axios.get(
        'http://localhost:3001/recsys/recommendations/00'
      )
      const provinces = res.data.provinces
      this.provinces = provinces
      this.overlay = false
    },
    async getDistricts(province) {
      // TODO Try Catch
      this.overlay = true
      const res = await axios.get(
        'http://localhost:3001/recsys/recommendations/00/province/' + province
      )
      const districts = res.data.districts
      this.districts = districts
      this.tab = 1
      this.overlay = false
    },
    async getDestinations(district) {
      // TODO Try Catch
      this.overlay = true
      const res = await axios.get(
        'http://localhost:3001/recsys/recommendations/00/district/' + district
      )
      const destinations = res.data.destinations
      this.destinations = destinations
      this.tab = 2
      this.overlay = false
    }
  },
  created() {
    this.getProvinces()
  }
}
</script>

<style></style>
