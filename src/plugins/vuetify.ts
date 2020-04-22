import Vue from 'vue'
// @ts-ignore
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

// init the ui framework
export default new Vuetify({
  theme: {
    dark: true
  },
  icons: {
    iconfont: 'mdi'
  }
})
