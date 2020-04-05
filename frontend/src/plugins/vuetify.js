import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#d32f2f',
        secondary: '#f9b02c',
        accent: '#212121',
        error: '#ff5722',
        warning: '#ffeb3b',
        info: '#3f51b5',
        success: '#43A047'
      },
      light: {
        primary: '#f44336',
        secondary: '#ffc107',
        accent: '#009688'
      }
    }
  }
})
