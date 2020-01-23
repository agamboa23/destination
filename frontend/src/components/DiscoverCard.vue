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
        <v-btn class="elevation-12" block color="secondary">Next</v-btn>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-row align="start" justify="center">
              <!-- <v-col v-for="destination in destinations" :key="destination.id">
                <discover-detail-card
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
              </v-col> -->
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
  methods: {
    randomProperty(obj) {
      // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
      var keys = Object.keys(obj)
      return obj[keys[(keys.length * Math.random()) << 0]]
    },
    async getStereotypes() {
      // TODO Try Catch
      this.overlay = true
      const res = await axios.get(this.recommenderUrl + 'recsys/stereotypes/')
      const stereotypes = res.data.Stereotypes
      this.stereotypes = stereotypes
      this.overlay = false
    },
    async getDestination() {}
  },
  created() {
    this.getStereotypes()
  }
}
</script>

<style></style>
