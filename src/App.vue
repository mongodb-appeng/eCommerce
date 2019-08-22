<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <router-link to="/confirm">ConfirmEmail</router-link>
    </div> -->
    <router-view 
      v-bind:stitchClient="stitchClient" 
      v-bind:database="database" v-on:setDatabase="setDatabase"
      v-bind:userLoggedIn="userLoggedIn" v-on:user-logged-in="setUserLoggedIn"
      v-bind:userFirstName="userFirstName" v-on:setUserFirstName="setUserFirstName"
      v-bind:customer="customer" v-on:setCustomer="setCustomer">
    </router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import { Stitch } from "mongodb-stitch-browser-sdk";
Vue.use(Buefy)

export default {
  name: "buefy_test",
  data() {
    return {
      stitchClient: "",
      database: null,
      userLoggedIn: false,
      userFirstName: "Guest",
      user: null,
      customer: {
        name: {
          title: '',
          first: '',
          last: '',
        },
        contact: {
          email: '',
          phone: {
            home: '',
            work: '',
            mobile: ''
          },
          devileryAddress: {
            number: '',
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
          }
        },
        marketingPreferences: []
      }
    }
  },
  methods: {
    setUserLoggedIn (user) {
      this.userLoggedIn = true;
      this.user = user;
      if (user.profile.firstName) {
        this.userFirstName = user.profile.firstName
      } else if (user.profile.email) {
        this.userFirstName = user.profile.email
      }
    },
    setDatabase (database) {
      this.database = database;
    },
    setUserFirstName (name) {
      this.userFirstName = name
    },
    setCustomer (customer) {
      this.customer = customer;
      // TODO update userFirstName
    }
  },
  created() {
    this.stitchClient = Stitch.initializeDefaultAppClient("ecommerce-iukkg");
  }
}
</script>


