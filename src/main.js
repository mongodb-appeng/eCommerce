import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex';
import router from './router'
import 'bulma/css/bulma.css'
import './main.scss'
import config from './config.js'
import createPersistedState from 'vuex-persistedstate'

Vue.config.productionTip = false;

/**
 * Wrapper for `console.error` which first checks whether error logging is turned on or not.
 * @param {string} error - The string to log
 */
function flagError (error) {
  if (config.logErrors) {
    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    console.error(error);
  }
}

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
  shoppingBasketValue: 0
}

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    userLoggedIn: false,
    userFirstName: "Guest",
    customer: nullCustomer,
    metaCustomer: nullMetaCustomer,
    categoryFilter: [],
    checkoutID: ''
  },

  mutations: {
    // Any changes to state held in `store` should be done through these
    // mutations. No asynchronous calls should be made from a mutation
    // (that should be performed within an action which in turn
    // invokes the relevant mutation(s))
    
    /**
     * Sets the Vuex state to indicate whether there is currently a loggged-in user or not
     * @param {object} state - Supplied by Vuex
     * @param {boolean} payload - Whether there is currently a logged-in user
     */
    setLoggedIn (state, payload) {state.userLoggedIn = payload},

    /**
     * Sets the user's first name in Vuex state
     * @param {object} state - Supplied by Vuex
     * @param {string} payload - The user's first name
     */
    setUserFirstName (state, payload) {state.userFirstName = payload},
    
    /**
     * Set's the category hierarchy in Vuex state
     * @param {object} state - Supplied by Vuex
     * @param {string[]} payload - Categoty hierarchy for the product filter
     */
    setCategoryFilter (state, payload) { state.categoryFilter = payload},
    
    /**
     * Updates the entire `customer` document in Vuex state
     * @param {object} state - Supplied by Vuex
     * @param {object} payload - Customer object
     */
    setCustomer (state, payload) {state.customer = payload},
    
    /**
     * Set's the customer's email address in Vues state
     * @param {object} state - Supplied by Vuex
     * @param {string} payload - email address
     */
    setEmail (state, payload) {Vue.set(state.customer.contact, 'email', payload)},
    
    /**
     * Stores the array of out-of-stock products currently being watched by this user
     * (in Vuex state)
     * @param {object} state - Supplied by Vuex
     * @param {string[]} payload - Array of `productID`s
     */
    setWaitingOnProducts (state, payload) {
      // Create a "by-value" copy of the array as arrays are passed by reference
      const newList = payload.slice();
      Vue.set(state.customer, 'waitingOnProducts', newList);
    },
    
    /**
     * Store the array of products in the customer's shopping basket
     * @param {object} state - Supplied by Vuex
     * @param {object[]} payload - Array of shopping item objects
     * @param {number} payload[].price - The price of each instance of the product
     * @param {string} payload[].productID - The `productID` for the product being added
     * @param {string} payload[].productImage - URI for an image representing the product
     * @param {number} payload[].quantity - How many instances of the product to add
     */
    setShoppingBasket (state, payload) {Vue.set(state.customer, 'shoppingBasket', payload)},
    
    /**
     * Sets the total number of items in the shopping basket (including multiple instances of the same product), thus
     * avoiding the need to recalculate it on every render
     * @param {object} state - Supplied by Vuex
     * @param {number} payload - Total number of items currently in the shopping basket
     */
    setShoppingBasketSize (state, payload) {Vue.set(state.metaCustomer, 'shoppingBasketSize', payload);},
    
    /**
     * Sets the total cost of all items currently in the shopping basket, thus
     * avoiding the need to recalculate it on every render
     * @param {object} state - Supplied by Vuex
     * @param {number} payload - Total value of products in the shopping basket
     */
    setShoppingBasketValue (state, payload) {Vue.set(state.metaCustomer, 'shoppingBasketValue', payload)},
    
    /**
     * Add another item (product details + quantity) to the shopping basket held in Vuex state
     * @param {object} state - Supplied by Vuex
     * @param {object} payload - Object containing details of the product + quantity to be ordered
     */
    pushBasketItem (state, payload) {state.customer.shoppingBasket.push(payload)},
    
    /**
     * The user is adding more instances of a product that is already in the shopping basket.
     * @param {object} state - Supplied by Vuex
     * @param {object} payload - Details of the addition to make to the basket
     * @param {number} payload.index - Index of the product within the basket array
     * @param {number} payload.quantity - How many extra instances to add to the basket
     */
    increaseBasketItemQuantity (state, payload) {
      Vue.set(
        state.customer.shoppingBasket[payload.index], 
        'quantity',
        state.customer.shoppingBasket[payload.index].quantity + payload.quantity)
    },
    
    /**
     * Sets the number of items (for the indicated `productID`) for a product already in the shopping basket
     * @param {bject} state - Supplied by Vuex
     * @param {object} payload - Identifies the product and increment
     * @param {number} payload.index - Position of the product within the basket array
     * @param {number} payload.quantity - How many instances should be inluded in the shopping basket
     */
    setBasketItemQuantity (state, payload) {
      state.customer.shoppingBasket[payload.index].quantity =  payload.quantity;
    },
    
    /**
     * Empties the shopping basket within the Vuex state. Also resets the basket statistics.
     * @param {object} state - Supplied by Vuex
     */
    clearBasket (state) {
      Vue.set(state.customer, 'shoppingBasket', []);
      Vue.set(state.metaCustomer, 'shoppingBasketSize', 0);
      Vue.set(state.metaCustomer, 'shoppingBasketValue', 0);
    },
    
    /**
     * Resets the `customer` data held in Vuex state when the user logs out. Also resets some of
     * the meta data also held in Vuex state.
     * @param {object} state - Supplied by Vuex
     */
    signout (state) {
      Vue.set(state, 'customer', nullCustomer);
      Vue.set(state.customer, 'contact', {});
      Vue.set(state.customer, 'shoppingBasket', []);
      Vue.set(state.customer, 'orders', []);
      Vue.set(state.customer, 'orderOverflow', false);
      state.metaCustomer.shoppingBasketSize = 0;
      state.metaCustomer.shoppingBasketValue = 0;
      state.userLoggedIn = false;
      state.userFirstName = 'Guest';
      state.categoryFilter = [];
    },
    
    /**
     * Sets the array of orders for this customer within Vuex state
     * @param {object} state - Supplied by Vuex
     * @param {object} payload - The new set of orders and whether more orders are stored outside of the customer document in the databasde
     * @param {object[]} payload.orders - Array of order items
     * @param {boolean} payload.orderOverflow - Whether there are additional orders for this customer held in the `orderOverflow` collectionm
     */
    setOrders (state, payload) {
      Vue.set(state.customer, 'orders', payload.orders);
      Vue.set(state.customer, 'orderOverflow', payload.orderOverflow);
    }
  },

  actions: {
    // Actions should be used when the store state needs to be updated together
    // with other (asynchronous) tasks.

    /**
     * Adds new items to the customers shopping basket. Adds them to the Vuex state as well as
     * the database (if the user is already logged in). Recalculates the shopping basket meta data.
     * @param {*} param0 - Supplied by Vuex
     * @param {object} payload 
     * @param {object} payload.database - The database where the data should be stored
     * @param {object[]} - Array of products to be added to the basket
     */
    addToBasket ({commit, state, dispatch}, payload) {
      if (payload.itemArray && payload.itemArray.length > 0) {
        payload.itemArray.forEach((item, incomingIndex) => {
          const existingIndex = state.customer.shoppingBasket.findIndex((entry) => {
            return entry.productID === item.productID;
          });
          if (existingIndex < 0) {
            // No matching productID in existing basket
            commit('pushBasketItem', payload.itemArray[incomingIndex]);
          } else {
            commit('increaseBasketItemQuantity', {
              index: incomingIndex,
              quantity: payload.itemArray[incomingIndex].quantity});
          }
        });
        if (state.userLoggedIn) {
          if (payload.database) {
            const customers = payload.database.collection('customers');
            customers.updateOne(
              {"contact.email": state.customer.contact.email},
              {$set: {shoppingBasket: state.customer.shoppingBasket}}
            )
            .catch ((error) => {
              flagError(`Failed to update the shopping basket in the database: ${error}`);
            });
          }
        }        
      }
      // Update the Vuex state
      dispatch('calcBasketStats');
    },

    /**
     * Removes a product from the shopping basket, both from the Vuex state and the database (if
     * the customer is logged in).
     * @param {*} param0  - Supplied by Vuex
     * @param {object} payload
     * @param {object} payload.database - The database where the data should be stored
     * @param {string} payload.productID - Identifies the product that should be removed from the basket
     */
    deleteFromBasket ({commit, state, dispatch}, payload) {
      if (payload.productID) {
        const existingIndex = state.customer.shoppingBasket.findIndex((entry) => {
          return entry.productID === payload.productID;
        });
        if (existingIndex >= 0) {
          // Copy by value
          let newBasket = state.customer.shoppingBasket.slice();
          // Strip this product from the array
          newBasket.splice(existingIndex, 1);
          commit('setShoppingBasket', newBasket);
          dispatch('calcBasketStats');
          if (state.userLoggedIn) {
            if (payload.database) {
              const customers = payload.database.collection('customers');
              customers.updateOne(
                {"contact.email": state.customer.contact.email},
                {$set: {shoppingBasket: newBasket}}
              )
              .catch ((error) => {
                flagError(`Failed to update the shopping basket in the database: ${error}`);
              });
            }
          }
        }
      }
    },

    /**
     * Updates the number of instances of a particular product in the customer's Vuex state and in the
     * database (if the customer is logged in).
     * @param {*} param0 - Supplied by Vuex
     * @param {object} payload 
     * @param {object} payload.database - The database where the data should be stored
     * @param {string} payload.productID - Identifies the product that should be updated within the basket
     * @param {number} payload.quantity – The revised quantity
     */
    updateBasketItemQuantity ({commit, state, dispatch}, payload) {
      if (payload) {
        const existingIndex = state.customer.shoppingBasket.findIndex((entry) => {
          return entry.productID === payload.productID;
        });
        if (existingIndex >= 0) {
          commit('setBasketItemQuantity', {index: existingIndex, quantity: payload.quantity});
          dispatch('calcBasketStats');
          if (state.userLoggedIn) {
            if (payload.database) {
              const customers = payload.database.collection('customers');
              customers.updateOne(
                {"contact.email": state.customer.contact.email},
                {$set: {shoppingBasket: state.customer.shoppingBasket}}
              )
              .catch ((error) => {
                flagError(`Failed to update the shopping basket in the database: ${error}`);
              });
            }
          }
        }
      }
    },

    /**
     * Empties the shopping basket in the customer's Vuex state and in the
     * database (if the customer is logged in).
     * @param {*} param0 - Supplied by Vuex
     * @param {object} database - The database where the data should be removed
     */
    emptyBasket ({state, commit}, database) {
      commit('clearBasket');
      if (state.userLoggedIn) {
        if (database) {
          const customers = database.collection('customers');
          customers.updateOne(
            {"contact.email": state.customer.contact.email},
            {$set: {shoppingBasket: state.customer.shoppingBasket}}
          )
          .catch ((error) => {
            flagError(`Failed to update the shopping basket in the database: ${error}`);
          });
        }
      }
    },

    /**
     * Recalculates the meta data for the shopping basket and stores the results in the
     * Vuex state for this customer
     * @param {*} param0 - Supplied by Vuex
     */
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

    /**
     * Store the provided (sparse) user data in Vuex state and then see if there is customer
     * data in the database for this user (based on their email address) - if there is, store
     * it against the customer in Vuex state.
     * @param {*} param0 - Supplied by Vuex
     * @param {object} payload 
     * @param {object} payload.database - The database from where the customer data can be read 
     * @param {object} payload.user - The user that is logging in
     * @returns {Promise}
     */
    setUserLoggedIn ({commit, state, dispatch}, payload) {
      commit('setLoggedIn', true);
      commit('setEmail', payload.user.profile.email);
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
                let localBasket = [];
                state.customer.shoppingBasket.forEach((item) => {localBasket.push(item)});
                commit('setCustomer', customerDoc);
                // Avoid losing contents of local basket (created before customer logged in)
                dispatch('addToBasket', {
                  database: payload.database,
                  itemArray: localBasket});
              commit('setUserFirstName', customerDoc.name.first);
            }
              resolve();
          }, (error) => {
            let errorMessage = `Error: attempt to read customer document failed: ${error}`;   
              flagError(errorMessage);
              reject (errorMessage);
          }) 
        }
        catch (error) {
          let errorMessage = `Error: Call to fetch customer document failed: ${error}`;   
          flagError(errorMessage);
          reject(errorMessage);
        }
      })
    },

    /**
     * Reload the customer's VueX state using data read from the database.
     * @param {*} param0 - Supplied by Vuex
     * @param {object} database - The database from where the customer data can be read from
     * @returns {Promise}
     */
    refreshCustomer ({commit, state}, database) {
      if (state.customer.contact.email) {
        return database.collection('customers').findOne(
          {"contact.email": state.customer.contact.email})
        .then ((customer) => {
          if (customer) {
            commit('setCustomer', customer);
          }
        },
        (error) => {
          flagError(`Error, failed to fetch the customer document: ${error}`);
        })
      }
    },

    /**
     * Reload the customer's VueX state using order data read from the database (using the
     * customer's email address).
     * @param {*} param0 - Supplied by Vuex
     * @param {object} database - The database from where the customer data can be read from
     * @returns {Promise}
     */
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

    /**
     * Removes the specified order from the customer's Vuex state and from the
     * database (if the customer is logged in) using their email address.
     * @param {*} param0 - Supplied by Vuex
     * @param {object} payload
     * @param {object} payload.database - The database where the data should be used
     * @param {string} payload.orderID - Identifies the order to be removed.
     * @param {object} stitchClient - Used to interact with Stitch in the backend
     * @returns {Promise}
     */
    deleteOrder ({commit, state}, payload) {
      return new Promise ((resolve, reject) => {
        if (payload.orderID) {
          const existingIndex = state.customer.orders.findIndex((entry) => {
            return entry.orderID === payload.orderID;
          });
          if (existingIndex >= 0) {
            // Create a by-value copy and remove the order from the derived position
            let newOrders = state.customer.orders.slice();
            newOrders.splice(existingIndex, 1);
            commit('setOrders', {orders: newOrders, orderOverflow: state.customer.orderOverflow});
            // TODO call a `cancelOrder` Stitch function instead so that it can change the stock levels back for
            // the products in the order.
            payload.stitchClient.callFunction('cancelOrder', [payload.orderID])
            .then ((result) => {
              if (result.result) {
                resolve();
              } else {
                reject(`Failed to cancel the order: ${result.error}`);
              }
            },
            (error) => {
              reject(`Cancel order failed: ${error}`);
            }
            )
          } else {
            resolve();
          }
        } else {
          reject('Order ID not provided');
        }
      })
    },

    /**
     * Deregister from back-in-stock notifications for the specified product – updated in both
     * Vuex state and the database (if the customer is logged in).
     * @param {*} param0 - Supplied by Vuex
     * @param {object} payload 
     * @param {object} payload.database - The database where the data should be stored
     * @param {string} payload.productID - Identifies the product to be unwatched
     */
    unWatch ({commit, state}, payload) {
      if (payload.productID) {
        const existingIndex = state.customer.waitingOnProducts.findIndex((entry) => {
          return entry === payload.productID;
        });
        if (existingIndex >= 0) {
          let newList = state.customer.waitingOnProducts.slice();
          newList.splice(existingIndex, 1);
          commit('setWaitingOnProducts', newList);
          if (state.userLoggedIn) {
            if (payload.database) {
              const customers = payload.database.collection('customers');
              customers.updateOne(
                {"contact.email": state.customer.contact.email},
                {$set: {waitingOnProducts: newList}}
              )
              .catch ((error) => {
                flagError(`Failed to update the order list in the database: ${error}`);
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
    stitchClient: null, // Structure is too complex to store in persisted Vuex `state`
    database: null // Structure is too complex to store in persisted Vuex `state`
  },
  render: h => h(App)
}).$mount('#app')
