import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#f44336',
        secondary: '#00bcd4',
        accent: '#795548',
        error: '#ff5722',
        warning: '#ffeb3b',
        info: '#3f51b5',
        success: '#cddc39'
      }
    }
  }
})
