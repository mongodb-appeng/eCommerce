<template>
  <div id="app">
    <!-- TODO should be able to remove all of these bindings -->
    <!-- Keep setUserLoggedIn -->
    <router-view></router-view>
    <!-- <router-view 
      v-bind:stitchClient="stitchClient" 
      v-bind:database="database" v-on:setDatabase="setDatabase"
      v-bind:userLoggedIn="userLoggedIn" v-on:user-logged-in="setUserLoggedIn"
      v-bind:user="user"
      v-bind:userFirstName="userFirstName" v-on:setUserFirstName="setUserFirstName"
      v-bind:customer="customer" v-on:setCustomer="setCustomer">
    </router-view> -->
  </div>
</template>

<script>
// TODO check if the user already has an entry in the 
import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
// import { Stitch } from "mongodb-stitch-browser-sdk";
import Vuex from 'vuex'
import {
    mapState, 
    mapMutations 
    } from 'vuex';
Vue.use(Buefy);
Vue.use(Vuex);

export default {
  name: "buefy_test",
  // TODO should be able to get rid of this data
  data() {
    return {
      // stitchClient: "",
      // database: null,
      // userLoggedIn: false,
      // userFirstName: "Guest",
      // user: null,
      // customer: {
      //   name: {
      //     title: '',
      //     first: '',
      //     last: '',
      //   },
      //   contact: {
      //     email: '',
      //     phone: {
      //       home: '',
      //       work: '',
      //       mobile: ''
      //     },
      //     deliveryAddress: {
      //       number: '',
      //       street: '',
      //       city: '',
      //       state: '',
      //       postalCode: '',
      //       country: ''
      //     }
      //   },
      //   marketingPreferences: {
      //     email: false,
      //     sms: false
      //   }
      // }
    }
  },
  computed: {
    ...mapState([
        'database',
        'user',
        'userFirstName'
    ]),
  },
  methods: {
    ...mapMutations([
      'setLoggedIn',
      'setUser',
      'setUserFirstName',
      // 'setStitchClient'
    ]),
    // setUserLoggedIn (user) {
    //   this.setLoggedIn (true);
    //   // this.userLoggedIn = true;
    //   // this.user = user;
    //   this.setUser(user);
    //   if (user.profile.firstName) {
    //     this.setUserFirstName(user.profile.firstName)
    //     // this.userFirstName = user.profile.firstName
    //   } else if (user.profile.email) {
    //     this.setUserFirstName(user.profile.email)
    //     // this.userFirstName = user.profile.email
    //   }
    //   // TODO check if the customer already has an entry in the database
    //   // and use the document to populate the customer and userFirstName values.
    //   try {
    //     this.database.collection("customers")
    //     .findOne({"contact.email": this.user.profile.data.email}) 
    //     .then (customerDoc => {
    //             if (customerDoc) {
    //             this.customer = customerDoc;
    //             this.userFirstName = customerDoc.name.first;
    //             /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
    //             console.log('Read a customer document from the database.');
    //         } else {
    //             // No record found for this customer – doesn't mean that it's a problem
    //             /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
    //             console.log('No matching customer document found in the database.');
    //         }
    //     }, (err) => {
            
    //         /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
    //         console.error(`Error: attempt to read customer document failed: ${err.message}`);
    //     }) 
    //   }
    //   catch (err) {
    //     /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
    //     console.error(`Error: Call to fetch customer document failed: ${err.message}`);
    //   }

    // },
    // TODO should be able to remove these
    // setDatabase (database) {
    //   this.database = database;
    // },
    // setUserFirstName (name) {
    //   this.userFirstName = name
    // },
    // setCustomer (customer) {
    //   this.customer = customer;
    //   if (customer.name.first) {
    //     this.userFirstName = customer.name.first
    //   }
    // },
    // setMugshotURL(url) {
    //   this.mugshotURL = url
    // }
  },
  created() {
    // this.setStitchClient(Stitch.initializeDefaultAppClient("ecommerce-iukkg"));
  }
}
</script>


