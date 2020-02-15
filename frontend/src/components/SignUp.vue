<template>
  <div class="text-center">
    <v-card class="elevation-12">
      <v-toolbar color="secondary" dark flat>
        <v-toolbar-title>Sign-Up Form</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            outlined
            color="secondary"
            v-model="firstName"
            type="text"
            label="First Name"
            prepend-inner-icon="mdi-pencil"
            :rules="[rules.required, rules.noDigit]"
          >
          </v-text-field>
          <v-text-field
            outlined
            color="secondary"
            type="text"
            v-model="lastName"
            label="Last Name"
            prepend-inner-icon="mdi-pencil-outline"
            :rules="[rules.required, rules.noDigit]"
          >
          </v-text-field>
          <v-autocomplete
            no-data-text="Couldn't find that :("
            outlined
            color="secondary"
            v-model="gender"
            label="Gender"
            :items="genderSelection"
            prepend-inner-icon="mdi-gender-male-female"
            :rules="[rules.required]"
          >
          </v-autocomplete>
          <v-select
            outlined
            color="secondary"
            v-model="age"
            label="Age"
            type="number"
            :items="ages"
            prepend-inner-icon="mdi-glass-mug-variant"
            :rules="[rules.required]"
          ></v-select>
          <v-autocomplete
            no-data-text="Couldn't find that :("
            outlined
            color="secondary"
            chips
            multiple
            prepend-inner-icon="mdi-translate"
            v-model="languages"
            :search-input.sync="search"
            label="Languages"
            :items="langSelection"
            :rules="[langRule]"
          ></v-autocomplete>
          <v-row align="center" justify="space-between">
            <v-col cols="4">
              <v-select
                outlined
                color="secondary"
                label="Country Code"
                prepend-inner-icon="mdi-flag"
                :rules="[rules.required]"
                v-model="countryCode"
                :items="countryCodes"
              >
                <template v-slot:selection="data">
                  {{ data.item.code }}
                </template>
                <template v-slot:item="data">
                  {{ data.item.name }} ({{ data.item.code }})
                </template>
              </v-select>
            </v-col>
            <v-col cols="8">
              <v-text-field
                outlined
                color="secondary"
                v-model="number"
                label="Phone Number"
                prepend-inner-icon="mdi-phone"
                @change="beautifyNumber()"
                :rules="[rules.required, rules.spaceyNumber]"
                :hint="phoneNumber"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field
            color="secondary"
            v-model="email"
            label="E-Mail"
            prepend-icon="mdi-mail"
            type="text"
            :rules="[rules.required, rules.email]"
          />
          <v-text-field
            color="secondary"
            v-model="password"
            label="Password"
            prepend-icon="mdi-lock"
            type="password"
            :rules="[rules.required, rules.password]"
          />
          <transition name="fade" mode="out-in">
            <v-text-field
              v-show="!!password"
              transition="scroll-y-transition"
              v-model="rePassword"
              color="secondary"
              label="Verify Password"
              type="password"
              :rules="[rules.required, passwordConfirmationRule]"
            />
          </transition>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="px-4"
          color="secondary"
          :loading="loading"
          :disabled="!valid || loading"
          @click="submit()"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="snackbar"
      :color="snackcolor"
      :top="true"
      :right="true"
      :timeout="timeout"
    >
      {{ snacktext }}
      <v-btn color="white" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
import langPack from '@/assets/languages'
import countryCodes from '@/assets/countrycodes'

export default {
  name: 'Login',
  data: () => {
    return {
      backendUrl: process.env.VUE_APP_BACKENDURL,
      valid: true,
      loading: false,
      email: '',
      password: '',
      rePassword: '',
      firstName: '',
      lastName: '',
      gender: '',
      genderSelection: ['Male', 'Female', 'Non-Binary'],
      age: 18,
      languages: [],
      countryCodes: countryCodes,
      countryCode: {
        code: '+49',
        name: 'Germany'
      },
      number: '',
      search: null,
      rules: {
        required: v => !!v || 'Required',
        email: v =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Not a valid E-Mail',
        password: v =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v) ||
          'Minimum eight characters, at least one uppercase letter, one lowercase letter and one number',
        noDigit: v => /^([^0-9]*)$/.test(v) || 'No digits are allowed',
        spaceyNumber: v =>
          /^[\s\d]+$/.test(v) || 'Only digits and whitespaces are allowed'
      },
      snackbar: false,
      snackcolor: '',
      snacktext: '',
      timeout: 3000
    }
  },
  methods: {
    beautifyNumber() {
      // No special characters
      // eslint-disable-next-line no-control-regex
      this.number = this.number.replace(/[^\x00-\x7F]+/g, '')
      // No latin characters
      this.number = this.number.replace(/[^0-9 ]+/g, '')
      // No extra spaces
      this.number = this.number.replace(/\s\s+/g, ' ')
      this.number = this.number.trim()
    },
    invokeSnackbar(text, color) {
      this.snacktext = text
      this.snackcolor = color
      this.snackbar = true
    },
    async login() {
      const cred = {
        email: this.email,
        password: this.password
      }
      const res = await axios.post(this.backendUrl + 'users/login', cred)
      this.$store.commit('auth/login', res.data.token)
      const userId = res.data.userId
      const userResponse = await axios.get(this.backendUrl + 'users/' + userId)
      const firstName = userResponse.data.user.first_name
      this.$store.commit('user/setUser', {
        id: userId,
        firstName: firstName
      })
    },
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const user = {
            email: this.email,
            password: this.password,
            first_name: this.firstName,
            last_name: this.lastName,
            gender: this.gender,
            age: this.age,
            languages: this.languages,
            phone_number: this.phoneNumber
          }
          const res = await axios.post(this.backendUrl + 'users/signup', user)
          this.login()
          this.invokeSnackbar(res.data.message, 'success')
          this.loading = false
          setTimeout(() => {
            this.$router.push({ name: 'home' })
          }, 1500)
        } catch (error) {
          this.invokeSnackbar('Authorization Error', 'error')
          this.loading = false
        }
      }
    }
  },
  computed: {
    phoneNumber() {
      return this.countryCode.code + ' ' + this.number
    },
    passwordConfirmationRule() {
      return () => this.password === this.rePassword || 'Password must match'
    },
    langSelection() {
      const result = []
      for (let i = 0; i < langPack.length; i++) {
        result.push(langPack[i].name)
      }
      return result
    },
    langRule() {
      return () =>
        this.languages.length !== 0 || 'Atleast one language should be selected'
    },
    ages() {
      const result = []
      for (let index = 17; index < 100; index++) {
        result.push(index + 1)
      }
      return result
    }
  },
  watch: {
    languages() {
      this.search = ''
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
