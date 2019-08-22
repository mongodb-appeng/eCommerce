<template>
  <div class="profile">
    <MyHeader 
        v-bind:stitchClient="stitchClient"
        v-bind:userLoggedIn="userLoggedIn"
        v-bind:userFirstName="userFirstName">
    </MyHeader>
    <div class="section">
        <div class="container">
            <h1 class="title is-2">User Profile</h1>
            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Name</label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <p class="control is-expanded has-icons-left">
                            <input v-model="localCustomer.name.first" class="input" type="name" placeholder="First">
                            <span class="icon is-small is-left">
                                <i class="fas fa-user"></i>
                            </span>
                        </p>
                    </div>
                    <div class="field">
                        <p class="control is-expanded has-icons-left">
                            <input v-model="localCustomer.name.last" class="input" type="name" placeholder="Last">
                            <span class="icon is-small is-left">
                                <i class="fas fa-user"></i>
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Contact</label>
                </div>
                <div class="field-body">
                    <div class="field is-expanded">
                        <div class="field">
                            <p class="control is-expanded has-icons-left">
                                <input v-model="localCustomer.contact.phone.mobile" class="input" type="tel" placeholder="Moile phone number">
                                <span class="icon is-small is-left">
                                    <i class="fas fa-phone"></i>
                                </span>
                            </p>
                        </div>
                        <p class="help">Include +CC</p>
                    </div>
                    <div class="field">
                        <p class="control is-expanded has-icons-left">
                            <input v-model="localCustomer.contact.email" class="input" type="email" placeholder="Email">
                            <span class="icon is-small is-left">
                                <i class="fas fa-envelope"></i>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="field is-grouped is-grouped-centered">
                <p class="control">
                    <button v-on:click="saveProfile" class="button is-success">
                        Save Profile
                    </button>
                </p>
            </div>
            <div v-if="progress" class="notification is-info">
                {{ progress }}
            </div>
            <div v-if="error" class="notification is-danger">
                <strong>{{ error }}</strong>
            </div>
            <div v-if="success" class="notification is-success">
                {{ success }}
            </div>
        </div>
    </div>
</div>
</template>

<script>

import MyHeader from '../components/Header.vue'

export default {
    name: 'profile',
    props: [
      "stitchClient",
      "database",
      "userLoggedIn",
      "userFirstName",
      "customer"
    ],
    components: {
        MyHeader
    },
    data() {
        return {
            error: '',
            success: '',
            progress: '',
            localCustomer: {
                contact: {
                    deliveryAddress: {},
                    phone: {}
                },
                name: {}
            },
            originalEmail: ''
        }
    },
    methods: {
        setLocalCustomer (customer) {
            this.customer = customer;
        },
        propBackCustomer () {
            this.$emit("setCustomer", this.localCustomer);
        },
        fetchCustomer () {
            this.progress = 'Looking for existing user profile.';
            this.database.collection("customers")
            .findOne({})
            .then (customerDoc => {
                    if (customerDoc) {
                    this.localCustomer = customerDoc
                    this.progress = ''
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                    console.log('Read a customer document from the database.');
                } else {
                    // No record found for this customer – doesn't mean that it's a problem
                    this.progress = ''
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                    console.log('No matching customer document found in the database.');
                }
            }, (err) => {
                
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                console.error(`Error: attempt to read customer document failed: ${err.message}`);
            })
        },
        saveProfile ()
        {
            this.progress = 'Writing profile to database.';
            this.error = '';
            this.success = '';
            this.database.collection("customers").updateOne(
                {"contact.email": this.localCustomer.contact.email},
                this.localCustomer,
                {upsert: true}
            ).then (() => {
                this.progress = '';
                this.propBackCustomer();
                if (this.localCustomer.name.first) {
                    this.$emit("setUserFirstName", this.localCustomer.name.first)
                }
                this.success = "User profile updated.";
                //TODO propagate the user name back up to the header and app
            }, (err) => {
                this.progress = '';
                this.error = `Error: Writing profile to the database - ${err.message}`;
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                console.error(this.error);
            })
        }
    },
    mounted() {
        if (this.userLoggedIn) {
            this.localCustomer = this.$props.customer;
            this.fetchCustomer();
            this.originalEmail = this.localCustomer.contact.email;
        } else {
            this.error = "Cannot access customer profile until user is logged in";
            /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
            console.error(this.error);
        }
    }
}
</script>
