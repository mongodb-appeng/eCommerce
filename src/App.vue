<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import Vuex from 'vuex'
import config from './config.js'

Vue.use(Buefy);
Vue.use(Vuex);

export default {
  name: config.appName,
  data() {
    return {
    }
  }
}
</script>