<template>
  <v-app>
    <v-app-bar app>
      <v-img
        class="mx-2"
        :src="require('./assets/vfk_logo_new.png')"
        max-height="40"
        max-width="80"
        contain
      ></v-img>
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light">MSB Studio</span>
      </v-toolbar-title>
      <!-- <router-link to='/'>Code Generator</router-link> -->
      <v-spacer></v-spacer>
      <v-chip
        outlined
        small
        style="margin-right: 6px;"
      >
        PoC {{ appVersion }}
      </v-chip>
      <v-btn
        v-if="false"
        text
        href="https://github.com/research-virtualfortknox"
        target="_blank"
      >
        <span class="mr-2">Documentation</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>

    <v-footer app
    >
      <v-layout
        justify-center
        text-left
        row
        style="color: rgba(255, 255, 255, 0.7);"
      >
        {{ new Date().getFullYear() }} — <strong>VFK Research</strong>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App',
  components: {
  },
  data: () => ({
    appVersion: process.env.APP_VERSION || '0'
  })
})
</script>
