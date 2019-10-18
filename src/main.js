import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex';
import router from './router'
import 'bulma/css/bulma.css'
import './main.scss'

import createPersistedState from 'vuex-persistedstate'

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
  marketingPreferences: {
    email: false,
    sms: false
  },
  waitingOnProducts: [],
  shoppingBasket: [],
  orders: [],
  orderOverflow: false
};

const nullMetaCustomer = {
  shoppingBasketSize: 0,
  shoppingBasketValue:0
}

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    // stitchClient: null,
    // database: null,
    userLoggedIn: false,
    userFirstName: "Guest",
    // user: null,
    customer: nullCustomer,
    metaCustomer: nullMetaCustomer,
    categoryFilter: [],
    checkoutID: ''
  },
  getters: {
  },
  mutations: {
    // setStitchClient (state, payload) {
    //   /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    //   console.log('Setting Stitch client');
    //   console.log(`app ID: ${payload.info.clientAppId}`);
    //   Vue.set(state, 'stitchClient', payload);
    //   // state.stitchClient = payload;
    //   /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    //   console.log('set stitch client');
    //   console.log(`state app ID: ${state.stitchClient.info.clientAppId}`);
    // },
    // setDatabase (state, payload) {
    //   console.log('mutating database');
    //   state.database = payload
    //   console.log('mutated database');
    // },
    setLoggedIn (state, payload) {state.userLoggedIn = payload},
    setUserFirstName (state, payload) {state.userFirstName = payload},
    // setUser (state, payload) {state.user = payload},
    setCategoryFilter (state, payload) {state.categoryFilter = payload},
    // setCheckoutID (state, payload) {state.checkoutID = payload},
    // `customer` mutations
    setCustomer (state, payload) {state.customer = payload},
    setEmail (state, payload) {Vue.set(state.customer.contact, 'email', payload)},
    setWaitingOnProducts (state, payload) {
      const newList = payload.slice();
      Vue.set(state.customer, 'waitingOnProducts', newList);
    },
    setShoppingBasket (state, payload) {Vue.set(state.customer, 'shoppingBasket', payload)},
    setShoppingBasketSize (state, payload) {Vue.set(state.metaCustomer, 'shoppingBasketSize', payload);},
    setShoppingBasketValue (state, payload) {Vue.set(state.metaCustomer, 'shoppingBasketValue', payload)},
    pushBasketItem (state, payload) {state.customer.shoppingBasket.push(payload)},
    increaseBasketItemQuantity (state, payload) {
      Vue.set(
        state.customer.shoppingBasket[payload.index], 
        'quantity',
        state.customer.shoppingBasket[payload.index].quantity + payload.quantity)
    },
    setBasketItemQuantity (state, payload) {
      state.customer.shoppingBasket[payload.index].quantity =  payload.quantity;
      // Vue.set(state.customer.shoppingBasket[payload.index], 'quantity',  payload.quantity)
    },
    clearBasket (state) {
      Vue.set(state.customer, 'shoppingBasket', []);
      Vue.set(state.metaCustomer, 'shoppingBasketSize', 0);
      Vue.set(state.metaCustomer, 'shoppingBasketValue', 0);
    },
    signout (state) {
      Vue.set(state, 'customer', nullCustomer);
      Vue.set(state.customer, 'contact', {});
      console.log(`email after signing out: ${state.customer.contact.email}`);
      state.metaCustomer.shoppingBasketSize = 0;
      state.metaCustomer.shoppingBasketValue = 0;
      // state.user = null;
      state.userLoggedIn = false;
      state.userFirstName = 'Guest';
      // state.stitchClient = null;
      // state.database = null;
      state.categoryFilter = [];
    },
    setOrders (state, payload) {
      Vue.set(state.customer, 'orders', payload.orders);
      Vue.set(state.customer, 'orderOverflow', payload.orderOverflow);
    }
  },
  actions: {

    addToBasket ({commit, state, dispatch}, payload) {
      // payload = {database, itemArray}
      /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
      if (payload.itemArray && payload.itemArray.length > 0) {
        console.log(`addToBasket: ${payload.itemArray.length} items`);
        if (payload.itemArray.length > 0) {
          console.log(`first item to add: ${payload.itemArray[0].productName}`);
        }
        payload.itemArray.forEach((item, incomingIndex) => {
          const existingIndex = state.customer.shoppingBasket.findIndex((entry) => {
            return entry.productID === item.productID;
          });
          if (existingIndex < 0) {
            // No matching productID in existing basket
            commit('pushBasketItem', payload.itemArray[incomingIndex]);
          } else {
            commit('increaseBasketItemQuantity', {index: incomingIndex, quantity: payload.itemArray[incomingIndex].quantity});
          }
        });
        if (state.userLoggedIn) {
          // If not already logged in then the basket will be written to the database
          // when the customer logs in
          if (payload.database) {
            const customers = payload.database.collection('customers');
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
      dispatch('calcBasketStats');
    },

    deleteFromBasket ({commit, state, dispatch}, payload) {
      // `payload` = {database, productID}
      if (payload.productID) {
        const existingIndex = state.customer.shoppingBasket.findIndex((entry) => {
          return entry.productID === payload.productID;
        });
        if (existingIndex >= 0) {
          let newBasket = state.customer.shoppingBasket.slice();
          newBasket.splice(existingIndex, 1);
          commit('setShoppingBasket', newBasket);
          dispatch('calcBasketStats');
          if (state.userLoggedIn) {
            // If not already logged in then the basket will be written to the database
            // when the customer logs in
            if (payload.database) {
              const customers = payload.database.collection('customers');
              customers.updateOne(
                {"contact.email": state.customer.contact.email},
                {$set: {shoppingBasket: newBasket}}
              )
              .catch ((error) => {
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.error(`Failed to update the shopping basket in the database: ${error.message}`);
              });
            }
          }
        }
      }
    },

    updateBasketItemQuantity ({commit, state, dispatch}, payload) {
      // `payload` = {database, productID, quantity} 
      if (payload) {
        const existingIndex = state.customer.shoppingBasket.findIndex((entry) => {
          return entry.productID === payload.productID;
        });
        if (existingIndex >= 0) {
          commit('setBasketItemQuantity', {index: existingIndex, quantity: payload.quantity});
          dispatch('calcBasketStats');
          if (state.userLoggedIn) {
            // If not already logged in then the basket will be written to the database
            // when the customer logs in
            if (payload.database) {
              const customers = payload.database.collection('customers');
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
      }
    },

    emptyBasket ({state, commit}, database) {
      commit('clearBasket');
      if (state.userLoggedIn) {
        // If not already logged in then the basket will be written to the database
        // when the customer logs in
        if (database) {
          const customers = database.collection('customers');
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
    },

    calcBasketStats ({commit, state}) {
      const shoppingBasketSize = state.customer.shoppingBasket.reduce((total, item) =>
        {
          return total + item.quantity;
        }, 0);
        commit('setShoppingBasketSize', shoppingBasketSize);
      const shoppingBasketValue = state.customer.shoppingBasket.reduce((total, item) =>
        {
          return total + (item.quantity * item.price);
        }, 0);
      commit('setShoppingBasketValue', shoppingBasketValue);
    },

    setUserLoggedIn ({commit, state, dispatch}, payload) {
      // payload = {database, user} 
      commit('setLoggedIn', true);
      commit('setEmail', payload.user.profile.email);
      // commit('setUser', user);
      if (payload.user.profile.firstName) {
        commit('setUserFirstName', payload.user.profile.firstName);
      } else if (payload.user.profile.email) {
        commit('setUserFirstName', payload.user.profile.email);  
      }
      return new Promise ((resolve, reject) => {
        try {
          payload.database.collection("customers")
          .findOne({"contact.email": payload.user.profile.data.email}) 
          .then (customerDoc => {
            if (customerDoc) {
              console.log(`logging in; ${state.customer.shoppingBasket.length} items in temp basket`);
                // const localBasket = state.customer.shoppingBasket;
                let localBasket = [];
                state.customer.shoppingBasket.forEach((item) => {localBasket.push(item)});
                // console.log(`First item in temp basket: ${localBasket[0].productName}`);
                commit('setCustomer', customerDoc);
                // Avoid losing contents of local basket (created before customer logged in)
                dispatch('addToBasket', {
                  database: payload.database,
                  itemArray: localBasket});
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
    },

    refreshCustomer ({commit, state}, database) {
      if (state.customer.contact.email) {
        // TODO
        return database.collection('customers').findOne(
          {"contact.email": state.customer.contact.email})
        .then ((customer) => {
          commit('setCustomer', customer);
        },
        (error) => {
          /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
          console.error(`Error, failed to fetch the customer document: ${error}`);
        })
      }
    },

    fetchOrders ({commit, state}, database) {
      const customers = database.collection('customers');
      return customers.findOne(
        {"contact.email": state.customer.contact.email},
        {$projection: {
          orders: 1,
          orderOverflow: 1
        }}
      )
      .then ((doc) => {
        commit('setOrders', doc);
      });
    },

    deleteOrder ({commit, state}, payload) {
      // `payload` = {database, orderID} 
      if (payload.orderID) {
        const existingIndex = state.customer.orders.findIndex((entry) => {
          return entry.orderID === payload.orderID;
        });
        if (existingIndex >= 0) {
          let newOrders = state.customer.orders.slice();
          newOrders.splice(existingIndex, 1);
          commit('setOrders', {orders: newOrders, orderOverflow: state.customer.orderOverflow});
          if (state.userLoggedIn) {
            // If not already logged in then the basket will be written to the database
            // when the customer logs in
            if (payload.database) {
              const customers = payload.database.collection('customers');
              customers.updateOne(
                {"contact.email": state.customer.contact.email},
                {$set: {orders: newOrders}}
              )
              .catch ((error) => {
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.error(`Failed to update the order list in the database: ${error.message}`);
              });
            }
          }
        }
      }
    },

    unWatch ({commit, state}, payload) {
      // 
      // `payload` = {database, productID}
      if (payload.productID) {
        const existingIndex = state.customer.waitingOnProducts.findIndex((entry) => {
          return entry === payload.productID;
        });
        if (existingIndex >= 0) {
          let newList = state.customer.waitingOnProducts.slice();
          newList.splice(existingIndex, 1);
          commit('setWaitingOnProducts', newList);
          if (state.userLoggedIn) {
            // If not already logged in then the list will be written to the database
            // when the customer logs in
            if (payload.database) {
              const customers = payload.database.collection('customers');
              customers.updateOne(
                {"contact.email": state.customer.contact.email},
                {$set: {waitingOnProducts: newList}}
              )
              .catch ((error) => {
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.error(`Failed to update the order list in the database: ${error.message}`);
              });
            }
          }
        }
      }
    }
  }
});

new Vue({
  router,
  store,
  data: {
    stitchClient: null, // Structure is too complex to store in `state`
    database: null // Structure is too complex to store in `state`
  },
  computed: {
  },
  render: h => h(App)
}).$mount('#app')
