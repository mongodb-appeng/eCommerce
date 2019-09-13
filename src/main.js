import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex';
import router from './router'
import 'bulma/css/bulma.css'
import './main.scss'
// TODO turn this back on
// import createPersistedState from 'vuex-persistedstate'

Vue.config.productionTip = false

const nullCustomer =  {
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
    deliveryAddress: {
      number: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    }
  }
};

const store = new Vuex.Store({
  // TODO: turn this back on
  // plugins: [createPersistedState()],
  state: {
    stitchClient: null,
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
        deliveryAddress: {
          number: '',
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        }
      },
      marketingPreferences: {
        email: false,
        sms: false
      },
    },
    categoryFilter: [],
    test: 42
  },
  getters: {
    // stitchClient: state => {
    //   return state.stitchClient;
    // },
  },
  mutations: {
    incrTest (state) {state.test++;},
    setStitchClient (state, payload) {state.stitchClient = payload},
    setDatabase (state, payload) {state.database = payload},
    setLoggedIn (state, payload) {state.userLoggedIn = payload},
    setUserFirstName (state, payload) {state.userFirstName = payload},
    setUser (state, payload) {state.user = payload},
    setCustomer (state, payload) {state.customer = payload},
    setCategoryFilter (state, payload) {state.categoryFilter = payload},
    signout (state) {
      state.customer = nullCustomer;
      state.user = null;
      state.userLoggedIn = false;
      state.userFirstName = 'Guest';
      state.stitchClient = null;
      state.database = null;
      state.categoryFilter = [];
    }
  },
  actions: {
    setUserLoggedIn ({commit, state}, user) {
      commit('setLoggedIn', true);
      commit('setUser', user);
      if (user.profile.firstName) {
        commit('setUserFirstName', user.profile.firstName);
      } else if (user.profile.email) {
        commit('setUserFirstName', user.profile.email);  
      }
      return new Promise ((resolve, reject) => {
        try {
          state.database.collection("customers")
          .findOne({"contact.email": state.user.profile.data.email}) 
          .then (customerDoc => {
                  if (customerDoc) {
                  commit('setCustomer', customerDoc);
                  commit('setUserFirstName', customerDoc.name.first);
              } else {
                  // No record found for this customer – doesn't mean that it's a problem
                  /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                  console.log('No matching customer document found in the database.');
              }
              resolve();
          }, (err) => {
              /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
              console.error(`Error: attempt to read customer document failed: ${err.message}`);
              reject ({message: `Error: attempt to read customer document failed: ${err.message}`});
          }) 
        }
        catch (err) {
          /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
          console.error(`Error: Call to fetch customer document failed: ${err.message}`);
          reject({message: `Error: Call to fetch customer document failed: ${err.message}`});
        }
      })
    }
  }
});

new Vue({
  router,
  store,
  data: {
  },
  computed: {
  },
  render: h => h(App)
}).$mount('#app')
