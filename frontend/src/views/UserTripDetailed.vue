<template>
  <v-row align="center" justify="space-around">
    <v-col cols="11" md="5">
      <v-card>{{ tripId }}</v-card>
    </v-col>
    <v-divider class="mx-2 hidden-sm-and-down" vertical inset />
    <v-col cols="11" md="5">
      <v-row align="center" justify="center">
        <v-col cols="12">
          <div class="display-1 font-weight-thin">Members</div>
          <v-divider />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <template v-if="members.length !== 0">
          <v-col cols="12">
            <v-list>
              <template v-for="(item, index) in members">
                <v-list-item :key="index" @click="toUser(item)">
                  <v-list-item-avatar>
                    <v-icon large>mdi-account-circle</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      <name :id="item" />
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider
                  v-if="!(index + 1 === members.length)"
                  inset
                  :key="index + 'divider'"
                />
              </template>
            </v-list>
          </v-col>
        </template>
        <template v-else>
          <v-col class="text-sm-left text-md-center" cols="12">
            <span class="title font-italic">Nothing to show here</span>
          </v-col>
        </template>
      </v-row>

      <v-row align="center" justify="center">
        <v-col cols="12">
          <div class="display-1 font-weight-thin">Requests</div>
          <v-divider />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <template v-if="requests.length !== 0">
          <v-col cols="12">
            <v-list>
              <template v-for="(item, index) in requests">
                <v-hover :key="index + 'hover'" v-slot:default="{ hover }">
                  <v-list-item
                    :key="index"
                    :class="hover ? 'elevation-12' : ''"
                  >
                    <v-list-item-avatar
                      class="hoverClick"
                      @click="toUser(item)"
                    >
                      <v-icon large>mdi-account-circle</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        <name :id="item" />
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon v-if="isAdmin">
                      <v-dialog v-model="joinDialog" width="350">
                        <template v-slot:activator="{ on }">
                          <v-btn class="mr-4" icon v-on="on">
                            <v-icon color="success">mdi-check</v-icon>
                          </v-btn>
                        </template>
                        <v-card>
                          <v-card-title>
                            Let this user join your trip?
                          </v-card-title>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="secondary"
                              text
                              @click="acceptJoin(item)"
                            >
                              Accept Join Request
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                      <v-btn icon @click="rejectJoin(item)">
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                    </v-list-item-icon>
                  </v-list-item>
                </v-hover>
                <v-divider
                  v-if="!(index + 1 === requests.length)"
                  inset
                  :key="index + 'divider'"
                />
              </template>
            </v-list>
          </v-col>
        </template>
        <template v-else>
          <v-col class="text-sm-left text-md-center" cols="12">
            <span class="title font-italic">Nothing to show here</span>
          </v-col>
        </template>
      </v-row>
    </v-col>
    <v-overlay v-model="overlay">
      <v-progress-circular
        size="150"
        width="10"
        color="secondary"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
    <v-snackbar
      v-model="snackbar"
      :color="snackcolor"
      :top="true"
      :right="true"
      :timeout="3000"
    >
      {{ snacktext }}
      <v-btn color="white" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import NameVue from '@/components/Name.vue'

export default {
  name: 'UserTripDetailedView',
  components: {
    name: NameVue
  },
  data: () => {
    return {
      joinDialog: false,
      overlay: false,
      snackbar: false,
      snackcolor: '',
      snacktext: '',
      members: [],
      requests: [],
      tripCreator: ''
    }
  },
  props: {
    tripId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('user', {
      userId: 'id'
    }),
    isAdmin() {
      return this.userId === this.tripCreator
    }
  },
  methods: {
    toUser(id) {
      console.log('USER ID ', id)
    },
    invokeSnackbar(text, color) {
      this.snacktext = text
      this.snackcolor = color
      this.snackbar = true
    },
    removeFromArray(arr, item) {
      return arr.filter(ele => {
        return ele !== item
      })
    },
    async acceptJoin(id) {
      try {
        this.overlay = true
        this.dialog = false
        await axios.patch(
          'http://localhost:3000/trips/accreq/' + this.tripId + '/' + id
        )
        // No more complete refresh of state with killing DOM
        this.members.push(id)
        this.requests = this.removeFromArray(this.requests, id)
        this.overlay = false
        this.invokeSnackbar('Join successful', 'success')
      } catch (error) {
        this.overlay = false
        this.invokeSnackbar('Join unsuccessful', 'error')
      }
    },
    async rejectJoin(id) {
      try {
        this.overlay = true
        await axios.patch(
          'http://localhost:3000/trips/rejectreq/' + this.tripId + '/' + id
        )
        this.requests = this.removeFromArray(this.requests, id)
        this.overlay = false
        this.invokeSnackbar('Reject successful', 'success')
      } catch (error) {
        this.overlay = false
        this.invokeSnackbar('Reject unsuccessful', 'error')
      }
    }
  },
  async created() {
    this.overlay = true
    const res = await axios.get('http://localhost:3000/trips/' + this.tripId)
    const resData = res.data.trip
    this.members = resData.members
    this.requests = resData.requests
    this.tripCreator = resData.user._id
    this.overlay = false
  }
}
</script>

<style scoped>
.hoverClick:hover {
  cursor: pointer;
}
</style>
