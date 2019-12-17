import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#D32F2F',
        secondary: '#F9B02C',
        accent: '#795548',
        error: '#ff5722',
        warning: '#ffeb3b',
        info: '#3f51b5',
        success: '#43A047'
      }
    }
  }
})
