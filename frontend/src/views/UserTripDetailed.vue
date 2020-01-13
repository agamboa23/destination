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
                <v-hover :key="index" v-slot:default="{ hover }">
                  <v-list-item
                    :key="index"
                    @click="toUser(item)"
                    :class="hover ? 'elevation-12' : ''"
                  >
                    <v-list-item-avatar>
                      <v-icon large>mdi-account-circle</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        <name :id="item" />
                      </v-list-item-title>
                    </v-list-item-content>

                    <!-- <v-list-item-icon>
                  <v-icon>chat_bubble</v-icon>
                </v-list-item-icon> -->
                  </v-list-item>
                </v-hover>
                <v-divider
                  v-if="!(index + 1 === members.length)"
                  inset
                  :key="index"
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
                <v-hover :key="index" v-slot:default="{ hover }">
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

                    <v-list-item-icon>
                      <v-btn class="mr-4" icon>
                        <v-icon color="success">mdi-check</v-icon>
                      </v-btn>
                      <v-btn icon>
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                    </v-list-item-icon>
                  </v-list-item>
                </v-hover>
                <v-divider
                  v-if="!(index + 1 === requests.length)"
                  inset
                  :key="index"
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
  </v-row>
</template>

<script>
import axios from 'axios'
import NameVue from '@/components/Name.vue'

export default {
  name: 'UserTripDetailedView',
  components: {
    name: NameVue
  },
  data: () => {
    return {
      members: [],
      requests: []
    }
  },
  props: {
    tripId: {
      type: String,
      required: true
    }
  },
  methods: {
    toUser(id) {
      console.log('USER ID ', id)
    }
  },
  async created() {
    const res = await axios.get('http://localhost:3000/trips/' + this.tripId)
    const resData = res.data.trip
    this.members = resData.members
    this.requests = resData.requests
  }
}
</script>

<style scoped>
.hoverClick:hover {
  cursor: pointer;
}
</style>
