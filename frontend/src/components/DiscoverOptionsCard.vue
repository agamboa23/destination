<template>
  <v-card
    class="text-center"
    flat
  >
    <v-card-text>
      <v-row
        align="center"
        justify="center"
      >
        <v-col cols="4">
          <v-switch
            v-model="moreOptions"
            label="More Options"
            color="secondary"
          />
        </v-col>
      </v-row>
      <v-row
        align="center"
        justify="center"
      >
        <v-col cols="4">
          <v-facebook-login
            :login-options="permissions"
            v-model="model"
            @sdk-init="handleSdkInit"
            @login="onLogin"
            app-id="1139571796385665"
          />
        </v-col>
      </v-row>
      <v-row>
        <h1>My Facebook Information</h1>
        <div class="well">
          <div class="list-item">
            <img :src="picture">
          </div>
          <div class="list-item">
            <i>{{ name }}</i>
          </div>
          <div class="list-item">
            <i>{{ email }}</i>
          </div>
          <div class="list-item">
            <i>{{ isProfileReady }}</i>
          </div>
        </div>
      </v-row>
      <v-btn
        @click="getCurrentLocation()"
        class="my-6 mr-12"
        color="secondary"
      >
        {{ isLoc ? `Don't use Current Location` : 'Use Current Location' }}
      </v-btn>
      <span class="my-6 ml-12 headline font-weight-thin">
        {{ isLoc ? location : 'or' }}
      </span>
      <v-autocomplete
        v-model="location"
        :disabled="isLoc"
        :items="places"
        class="my-6"
        outlined
        color="secondary"
        label="Choose from List"
        hint="e.g. Tegernsee"
        prepend-inner-icon="mdi-city-variant"
        no-data-text="Couldn't find location :("
        item-text="name"
        item-value="geo"
      />
      <template v-if="moreOptions">
        <v-row
          align="center"
          justify="center"
        >
          <v-col cols="6">
            <v-select
              v-model="aroundMetric"
              :items="aroundSelection"
              color="secondary"
              label="Distance in"
              item-text="name"
              item-value="abbr"
            />
            <v-text-field
              v-model="minDistance"
              :hint="minDistance + ' ' + aroundMetric"
              :rules="[rules.betweenZeroAndHundred]"
              color="secondary"
              label="Minimum Distance"
              type="number"
              persistent-hint
            />
            <v-text-field
              v-model="maxDistance"
              :hint="maxDistance + ' ' + aroundMetric"
              :rules="[rules.betweenZeroAndHundred]"
              color="secondary"
              label="Maximum Distance"
              type="number"
              persistent-hint
            />
            <v-checkbox
              v-model="bt_reachable"
              label="BayernTicket Reachable"
              color="secondary"
            />
            <v-checkbox
              v-model="wheelchair"
              label="Wheelchair Accessible"
              color="secondary"
            />
          </v-col>
        </v-row>
      </template>
    </v-card-text>
    <v-card-actions>
      <v-btn
        :disabled="nextDisabled"
        @click="$emit('next')"
        class="elevation-12"
        large
        block
        color="secondary"
      >
        Next
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import placesPack from '@/assets/destinations.js'
import VFacebookLogin from 'vue-facebook-login-component'
import axios from 'axios'

export default {
  name: 'DiscoverOptionsCard',
  components: {
    VFacebookLogin
  },
  props: {
    nextDisabled: Boolean
  },
  data: () => {
    return {
      recommenderUrl: process.env.VUE_APP_RECOMMENDERURL,
      FB: {},
      model: {},
      scope: {},
      permissions: {
        scope: 'email,user_friends,user_photos,user_posts,user_likes'
      },
      name: '',
      email: '',
      personalID: '',
      isProfileReady: 'No FB profile',
      picture: '',
      photos: {},
      moreOptions: false,
      isLoc: false,
      location: '',
      maxDistance: 15,
      minDistance: 0,
      aroundSelection: [
        { name: 'Meters', abbr: 'm' },
        { name: 'Kilometers', abbr: 'km' },
        { name: 'Hours', abbr: 'h' },
        { name: 'Minutes', abbr: 'min' }
      ],
      aroundMetric: 'km',
      bt_reachable: true,
      wheelchair: false,
      rules: {
        betweenZeroAndHundred: v => (v <= 100 && v >= 0) || 'Between 0 and 100'
      }
    }
  },
  computed: {
    places () {
      const result = []
      for (let i = 0; i < placesPack.length; i++) {
        const item = {
          name: placesPack[i].name,
          geo: placesPack[i].geo
        }
        result.push(item)
      }
      return result
    },
    smartModel () {
      if (this.moreOptions) {
        return {
          location: this.location,
          maxDistance: this.maxDistance,
          minDistance: this.minDistance,
          aroundMetric: this.aroundMetric,
          bt_reachable: this.bt_reachable,
          wheelchair: this.wheelchair,
          personalID: this.personalID
        }
      } else {
        return {
          location: this.location,
          personalID: this.personalID
        }
      }
    }
  },
  watch: {
    smartModel () {
      this.$emit('input', this.smartModel)
    }
  },
  methods: {
    handleSdkInit ({ FB, scope }) {
      this.FB = FB
      this.scope = scope
      if (this.scope.connected) this.getUserData()
    },
    async getUserData () {
      this.FB.api(
        '/me',
        'GET',
        { fields: 'id,name,email,picture' },
        async user => {
          this.personalID = user.id
          this.email = user.email
          this.name = user.name
          this.picture = user.picture.data.url
          this.isProfileReady = 'Loading Data'
          const fbProfile = {
            fbId: user.id,
            access_code: this.FB.getAccessToken(),
            name: user.name,
            email: this.email
          }
          const responseBuildProfile = await axios.post(
            this.recommenderUrl + 'recsys/profiler/build_profile/',
            fbProfile
          )
          if (responseBuildProfile.status === 200) {
            this.isProfileReady = 'Ready to go'
          } else {
            this.isProfileReady = 'Error when loading'
          }
        }
      )
    },
    async buildProfile () {
      // Get all facebook data (posts and geographic points)
      // store in backend
      // all good
      await this.FB.api(
        '/me',
        'GET',
        { fields: 'id,name,email,picture,photos' },
        user => {
          this.photos.photos = user.photos
        }
      )
    },
    async onLogin () {
      await this.getUserData()
    },
    getCurrentLocation () {
      if (!this.isLoc) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            this.location =
              position.coords.latitude + '|' + position.coords.longitude
          })
          this.isLoc = !this.isLoc
        } else {
          window.alert('Geolocation is not supported by this browser.')
        }
      } else {
        this.location = ''
        this.isLoc = !this.isLoc
      }
    }
  }
}
</script>

<style></style>
