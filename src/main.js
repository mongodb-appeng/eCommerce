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
  },
  waitingOnProducts: [],
  shoppingBasket: [],
  shoppingBasketSize: 0
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
      waitingOnProducts: [],
      shoppingBasket: [],
      shoppingBasketSize: 0
    },
    categoryFilter: []
  },
  getters: {
    // stitchClient: state => {
    //   return state.stitchClient;
    // },
  },
  mutations: {
    setStitchClient (state, payload) {state.stitchClient = payload},
    setDatabase (state, payload) {state.database = payload},
    setLoggedIn (state, payload) {state.userLoggedIn = payload},
    setUserFirstName (state, payload) {state.userFirstName = payload},
    setUser (state, payload) {state.user = payload},
    setCustomer (state, payload) {state.customer = payload},
    setCategoryFilter (state, payload) {state.categoryFilter = payload},
    setWaitingOnProducts (state, payload) {state.customer.waitingOnProducts.push(payload)},
    addToBasket (state, payload) {
      // `payload` must be an array of basket entries
      if (!state.customer.shoppingBasket) {
        state.customer.shoppingBasket = [];
      }
      if (payload) {
        payload.forEach((item, incomingIndex) => {
          const existingIndex = state.customer.shoppingBasket.findIndex((entry) => {
            return entry.productID === item.productID;
          });
          if (existingIndex < 0) {
            // No matching productID in existing basket
            state.customer.shoppingBasket.push(payload[incomingIndex]);
          } else {
            state.customer.shoppingBasket[existingIndex].quantity += payload[incomingIndex].quantity;
          }
        });
        if (state.userLoggedIn) {
          // If not already logged in then the basket will be written to the database
          // when the customer logs in
          if (this.state.database) {
            const customers = this.state.database.collection('customers');
            customers.updateOne(
              {"contact.email": state.customer.contact.email},
              {$set: {shoppingBasket: state.customer.shoppingBasket}}
            )
            .catch ((error) => {
              /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
              console.error(`Failed to update the shopping basket in the database: ${error.message}`);
            });
          }
        }        
      }
      const shoppingBasketSize = state.customer.shoppingBasket.reduce((total, item) =>
        {
          return total + item.quantity;
        }, 0);
      Vue.set(state.customer, 'shoppingBasketSize', shoppingBasketSize);
    },
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
              const localBasket = state.customer.shoppingBasket;
              commit('setCustomer', customerDoc);
              // Avoid losing contents of local basket (created before customer logged in)
              commit('addToBasket', localBasket);

              // if (localBasket && localBasket.length > 0) {
              //   commit('addToBasket', localBasket);
              // }
              commit('setUserFirstName', customerDoc.name.first);
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
