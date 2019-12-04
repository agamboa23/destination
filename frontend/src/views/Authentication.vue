<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <login v-if="isLogin" />
      <sign-up v-if="!isLogin" />
    </v-col>
  </v-row>
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
  computed: {
    isLogin() {
      return this.type === 'login'
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  }
}
</script>
