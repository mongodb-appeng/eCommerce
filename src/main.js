import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex';
// import {
//   mapState,
//   mapGetters,
//   mapMutations } from 'vuex';

// import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'
import router from './router'
// TODO turn this back on
// import createPersistedState from 'vuex-persistedstate'

Vue.config.productionTip = false
// Vue.use(Buefy)

// Access this state from any component using computed parameters and
// `this.$store.state.____`
const store = new Vuex.Store({
  // TODO: turn this back on
  // plugins: [createPersistedState()],
  state: {
    stitchClient: {},
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
      }
    },
    test: 42
  },
  getters: {
    // stitchClient: state => {
    //   return state.stitchClient;
    // },
    // database: state => {
    //   return state.database;
    // },
    // userLoggedIn: state => {
    //   return state.userLoggedIn;
    // },
    // userFirstName: state => {
    //   return state.userFirstName;
    // },
    // user: state => {
    //   return state.user;
    // },
    // customer: state => {
    //   return state.customer;
    // }
  },
  mutations: {
    incrTest (state) {state.test++;},
    setStitchClient (state, payload) {state.stitchClient = payload},
    setDatabase (state, payload) {state.database = payload},
    setLoggedIn (state, payload) {state.userLoggedIn = payload},
    setUserFirstName (state, payload) {state.userFirstName = payload},
    setUser (state, payload) {state.user = payload},
    setCustomer (state, payload) {state.customer = payload}

  //   // Mutations must be syncrhonous! -> wrap in actions
  //   increment (state) {
  //       state.count++
  //   },
  //   incrementBy (state, n) {
  //     state.count += n
  //   }
  //   // this.$store.commit('increment');
  //   // this.$store.commit('incrementBy', 8);
  // },
  // methods: mapMutations([
  //   'increment',
  //   'incrementBy'
  // ]),
  // actions: {
  //   increment (context) {
  //       context.commit('increment')
  //   }
  //   // this.$store.dispatch('incrementAsync');
  },
  actions: {
    setUserLoggedIn ({commit, state}, user) {
      commit('setLoggedIn', true);
      // this.userLoggedIn = true;
      // this.user = user;
      commit('setUser', user);
      // this.setUser(user);
      if (user.profile.firstName) {
        commit('setUserFirstName', user.profile.firstName);
        // this.setUserFirstName(user.profile.firstName)
        // this.userFirstName = user.profile.firstName
      } else if (user.profile.email) {
        commit('setUserFirstName', user.profile.email);  
        // this.setUserFirstName(user.profile.email)
        // this.userFirstName = user.profile.email
      }
      return new Promise ((resolve, reject) => {
        try {
          // this.database.collection("customers")
          state.database.collection("customers")
          .findOne({"contact.email": state.user.profile.data.email}) 
          .then (customerDoc => {
                  if (customerDoc) {
                  commit('setCustomer', customerDoc);
                  commit('setUserFirstName', customerDoc.name.first);
                  // this.userFirstName = customerDoc.name.first;
                  /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                  console.log('Read a customer document from the database.');
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
  store,      // Enables the Vuex data to be access from any comppnent
              // using `this.$store.state._____`
  data: {

  },
  computed: {
    // ...mapState(['test']),
    // ...mapGetters([]),
    // ...mapMutations([])
  },
  render: h => h(App)
}).$mount('#app')
