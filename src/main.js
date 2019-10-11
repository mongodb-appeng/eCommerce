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
  // TODO: turn this back on
  // plugins: [createPersistedState()],
  state: {
    stitchClient: null,
    database: null,
    userLoggedIn: false,
    userFirstName: "Guest",
    user: null,
    customer: nullCustomer,
    metaCustomer: nullMetaCustomer,
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
    setCategoryFilter (state, payload) {state.categoryFilter = payload},

    // `customer` mutations
    setCustomer (state, payload) {state.customer = payload},
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
      state.customer = nullCustomer;
      state.user = null;
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
      // `payload` must be an array of basket entries
      // if (!state.customer.shoppingBasket) {
      //   state.customer.shoppingBasket = [];
      // }
      if (payload) {
        payload.forEach((item, incomingIndex) => {
          const existingIndex = state.customer.shoppingBasket.findIndex((entry) => {
            return entry.productID === item.productID;
          });
          if (existingIndex < 0) {
            // No matching productID in existing basket
            commit('pushBasketItem', payload[incomingIndex]);
            // state.customer.shoppingBasket.push(payload[incomingIndex]);
          } else {
            commit('increaseBasketItemQuantity', {index: incomingIndex, quantity: payload[incomingIndex].quantity});
            // state.customer.shoppingBasket[existingIndex].quantity += payload[incomingIndex].quantity;
          }
        });
        if (state.userLoggedIn) {
          // If not already logged in then the basket will be written to the database
          // when the customer logs in
          if (state.database) {
            const customers = state.database.collection('customers');
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
      // `payload` is the productID to remove from the basket
      if (payload) {
        const existingIndex = state.customer.shoppingBasket.findIndex((entry) => {
          return entry.productID === payload;
        });
        if (existingIndex >= 0) {
          let newBasket = state.customer.shoppingBasket.slice();
          newBasket.splice(existingIndex, 1);
          commit('setShoppingBasket', newBasket);
          dispatch('calcBasketStats');
          if (state.userLoggedIn) {
            // If not already logged in then the basket will be written to the database
            // when the customer logs in
            if (state.database) {
              const customers = state.database.collection('customers');
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
      // `payload` {productID, quantity}
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
            if (state.database) {
              const customers = state.database.collection('customers');
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

    emptyBasket ({state, commit}) {
      commit('clearBasket');
      if (state.userLoggedIn) {
        // If not already logged in then the basket will be written to the database
        // when the customer logs in
        if (state.database) {
          const customers = state.database.collection('customers');
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

    setUserLoggedIn ({commit, state, dispatch}, user) {
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
              dispatch('addToBasket', localBasket);

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
    },

    fetchOrders ({commit, state}) {
      const customers = state.database.collection('customers');
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
      // `payload` is the orderID to remove from the order list
      if (payload) {
        const existingIndex = state.customer.orders.findIndex((entry) => {
          return entry.orderID === payload;
        });
        if (existingIndex >= 0) {
          let newOrders = state.customer.orders.slice();
          newOrders.splice(existingIndex, 1);
          commit('setOrders', {orders: newOrders, orderOverflow: state.customer.orderOverflow});
          if (state.userLoggedIn) {
            // If not already logged in then the basket will be written to the database
            // when the customer logs in
            if (state.database) {
              const customers = state.database.collection('customers');
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
      // TODO
      // `payload` is the productID to remove from the waitingOnProducts list
      if (payload) {
        const existingIndex = state.customer.waitingOnProducts.findIndex((entry) => {
          return entry === payload;
        });
        if (existingIndex >= 0) {
          let newList = state.customer.waitingOnProducts.slice();
          newList.splice(existingIndex, 1);
          commit('setWaitingOnProducts', newList);
          if (state.userLoggedIn) {
            // If not already logged in then the list will be written to the database
            // when the customer logs in
            if (state.database) {
              const customers = state.database.collection('customers');
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
  },
  computed: {
  },
  render: h => h(App)
}).$mount('#app')
