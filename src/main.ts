import Vue from 'vue'
import App from './App.vue'
// ui framework
import vuetify from './plugins/vuetify'
// access to clipboard
import VueClipboard from 'vue-clipboard2'
// page router
import VueRouter from 'vue-router'
// @ts-ignore
import routes from './routes'

// load prismjs
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-json.js'
import 'prismjs/components/prism-python.js'
import 'prismjs/components/prism-java.js'
import 'prismjs/components/prism-c.js'
import 'prismjs/components/prism-csharp.js'
import 'prismjs/components/prism-properties.js'
import 'prismjs/components/prism-markdown.js'
// vue-prism-editor dependency
import 'vue-prism-editor/dist/VuePrismEditor.css'

Vue.use(VueClipboard)

// init the page router
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes: routes
})

Vue.config.productionTip = false

// init the vue app
new Vue({
  // @ts-ignore
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
