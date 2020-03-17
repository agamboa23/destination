<template>
  <span>{{ name }}</span>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Name',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      backendUrl: process.env.VUE_APP_BACKENDURL,
      name: ''
    }
  },
  async mounted () {
    const res = await axios.get(this.backendUrl + 'users/' + this.id)
    const resData = res.data
    this.name = resData.user.first_name + ' ' + resData.user.last_name
  }
}
</script>

<style></style>
