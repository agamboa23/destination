<template>
  <v-container
    fill-height
    fluid
    class="pa-0"
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="9"
        md="5"
      >
        <login v-if="isLogin" />
        <sign-up v-else />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Login from '@/components/Login.vue'
import SignUp from '@/components/SignUp.vue'

export default {
  name: 'Authentication',
  components: {
    login: Login,
    'sign-up': SignUp
  },
  props: {
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    isLogin () {
      return this.type === 'login'
    }
  }
}
</script>
