<template>
  <v-card
    :color="active ? 'info' : hover ? 'info' : ''"
    :style="hover ? 'cursor: pointer;' : ''"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click="isDestination ? (clicked = !clicked) : ''"
    class="mx-auto"
    max-width="400"
    min-width="350"
    outlined
  >
    <v-list-item>
      <v-list-item-content>
        <div class="overline mb-4 text-capitalize">
          {{ isDestination ? underscoreToSpace(second) : subName }}
        </div>
        <v-list-item-title class="headline mb-1 text-capitalize">
          {{ isDestination ? underscoreToSpace(first) : name }}
        </v-list-item-title>
        <v-list-item-subtitle v-if="isDestination">
          <v-btn
            @click="toGoogleMapsDirections()"
            small
            outlined
            color="black"
          >
            To Maps <v-icon>mdi-map-marker</v-icon>
          </v-btn>
          <template v-if="expand">
            <div class="mt-1">
              <ul>
                <li
                  v-for="(value, tag) in restTags"
                  :key="tag"
                  style="word-break: break-word;white-space: normal;"
                  class="text-capitalize grey--text"
                >
                  {{ underscoreToSpace(tag) }}: {{ underscoreToSpace(value) }}
                </li>
              </ul>
            </div>
          </template>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-avatar
        v-if="!expand"
        tile
        size="80"
      >
        <v-img :src="avatarURL" />
      </v-list-item-avatar>
      <v-list-item-avatar
        v-if="expand"
        tile
        size="160"
      >
        <v-img :src="avatarURL" />
      </v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: 'DiscoverDetailCard',
  props: {
    isDestination: { type: Boolean, required: true },
    name: {
      type: String,
      default: ''
    },
    subName: {
      type: String,
      default: ''
    },
    active: Boolean,
    avatarURL: {
      type: String,
      default: ''
    },
    lat: {
      type: String,
      default: ''
    },
    lon: {
      type: String,
      default: ''
    },
    tags: {
      type: Object,
      default: () => {}
    },
    usersLocation: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      hover: false,
      clicked: false,
      first: '',
      second: '',
      restTags: {}
    }
  },
  computed: {
    expand () {
      return this.isDestination && this.clicked
    }
  },
  mounted () {
    if (this.isDestination) {
      this.getTags()
    }
  },
  methods: {
    toGoogleMapsDirections () {
      const latLons = this.usersLocation.split('|')
      const origin = latLons[0] + ',' + latLons[1]
      window.open(
        'https://www.google.com/maps/dir/?api=1&origin=' +
          origin +
          '&destination=' +
          this.lat +
          ',' +
          this.lon +
          '&travelmode=driving'
      )
    },
    underscoreToSpace (str) {
      return str.replace(/_/g, ' ')
    },
    randomProperty (obj) {
      // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
      var keys = Object.keys(obj)
      const randomKey = keys[(keys.length * Math.random()) << 0]
      return randomKey + ': ' + obj[randomKey]
    },
    getTags () {
      const temp = []
      temp.push(this.tags.name)
      const tagList = [
        'sport',
        'tourism',
        'amenity',
        'historic',
        'natural',
        'building',
        'aerialway',
        'leisure',
        'route',
        'shop'
      ]
      for (let i = 0; i < tagList.length; i++) {
        if (tagList[i] in this.tags) {
          if (temp.length === 2) {
            break
          }
          temp.push(tagList[i] + ': ' + this.tags[tagList[i]])
        }
      }
      // If no tags of list is there
      // Though 'name' is always guaranteed, this stays as a second error handle
      if (temp.length < 2) {
        if (temp.length === 1) {
          this.first = temp[0]
          this.second = this.randomProperty(this.tags)
        } else {
          this.first = this.randomProperty(this.tags)
          this.second = this.randomProperty(this.tags)
        }
      } else {
        // Assignment
        this.first = temp[0]
        this.second = temp[1]
      }
      this.getRestTags()
    },
    getRestTags () {
      const entries = Object.entries(this.tags)
      for (const [tag, value] of entries) {
        if (value !== this.first && value !== this.second && !tag.includes('addr') && !tag.includes('Addr')) {
          this.restTags[tag] = value
        }
      }
    }
  }
}
</script>

<style></style>
