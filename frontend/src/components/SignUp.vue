<template>
  <div class="text-center">
    <v-card class="elevation-12">
      <v-toolbar color="secondary" dark flat>
        <v-toolbar-title>Sign-Up Form</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            outlined
            color="secondary"
            v-model="firstName"
            label="First Name"
            prepend-inner-icon="mdi-pencil"
            :rules="[rules.required]"
          >
          </v-text-field>
          <v-text-field
            outlined
            color="secondary"
            v-model="lastName"
            label="Last Name"
            prepend-inner-icon="mdi-pencil-outline"
            :rules="[rules.required]"
          >
          </v-text-field>
          <v-select
            outlined
            color="secondary"
            v-model="gender"
            label="Gender"
            :items="genderSelection"
            prepend-inner-icon="mdi-gender-male-female"
            :rules="[rules.required]"
          >
          </v-select>
          <v-text-field
            outlined
            color="secondary"
            :value="age"
            label="Age"
            prepend-inner-icon="mdi-glass-mug-variant"
            :rules="[rules.required, rules.age]"
          ></v-text-field>
          <v-autocomplete
            outlined
            color="secondary"
            chips
            v-model="languages"
            label="Languages"
            :items="langSelection"
          ></v-autocomplete>
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
          <v-text-field
            v-show="!!password"
            transition="scroll-y-transition"
            v-model="rePassword"
            color="secondary"
            label="Verify Password"
            type="password"
            :rules="[rules.required, passwordConfirmationRule]"
          />
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
import langPack from '@/assets/languages'

export default {
  name: 'Login',
  data: () => {
    return {
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
      rules: {
        required: v => !!v || 'Required',
        email: v =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Not a valid E-Mail',
        password: v =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v) ||
          'Minimum eight characters, at least one uppercase letter, one lowercase letter and one number',
        age: v => (v >= 18 && v <= 100) || 'Minimum Age is 18'
      },
      snackbar: false,
      snackcolor: '',
      snacktext: '',
      timeout: 3000
    }
  },
  methods: {
    invokeSnackbar(text, color) {
      this.snacktext = text
      this.snackcolor = color
      this.snackbar = true
    },
    async submit() {
      console.log(this.$refs.form.validate())
    }
  },
  computed: {
    passwordConfirmationRule() {
      return () => this.password === this.rePassword || 'Password must match'
    },
    langSelection() {
      const result = []
      for (let i = 0; i < langPack.length; i++) {
        result.push(langPack[i].name)
      }
      return result
    }
  }
}
</script>

<style scoped></style>
