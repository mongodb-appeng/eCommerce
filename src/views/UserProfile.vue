<template>
  <div class="profile">
    <MyHeader></MyHeader>
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
                                <input v-model="localCustomer.contact.phone.mobile" class="input" type="tel" placeholder="Mobile phone number">
                                <span class="icon is-small is-left">
                                    <i class="fas fa-phone"></i>
                                </span>
                            </p>
                        </div>
                        <p class="help">Include +CC</p>
                    </div>
                    <div class="field">
                        <p class="control is-expanded has-icons-left">
                            <input v-model="localCustomer.contact.phone.home" class="input" type="tel" placeholder="Home phone number">
                            <span class="icon is-small is-left">
                                <i class="fas fa-phone"></i>
                            </span>
                        </p>
                        <p class="help">Include +CC</p>
                    </div>
                </div>
            </div>
            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label"></label>
                </div>
                <div class="field-body">
                    <div class="field is-expanded">
                        <div class="field">
                            <p class="control is-expanded has-icons-left">
                                <input v-model="localCustomer.contact.phone.work" class="input" type="tel" placeholder="Work phone number">
                                <span class="icon is-small is-left">
                                    <i class="fas fa-phone"></i>
                                </span>
                            </p>
                        </div>
                        <p class="help">Include +CC</p>
                    </div>
                    <div class="field is-expanded">
                        <p class="control is-expanded has-icons-left">
                            <input v-model="localCustomer.contact.email" class="input" type="email" placeholder="Email" :disabled="localCustomer.contact.email">
                            <span class="icon is-small is-left">
                                <i class="fas fa-envelope"></i>
                            </span>
                        </p>
                    </div>
                </div>
            </div> 
             <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Delivery address</label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <p class="control is-expanded has-icons-left">
                            <input v-model="localCustomer.contact.deliveryAddress.number" class="input" type="text" placeholder="House name or number">
                            <span class="icon is-small is-left">
                                <i class="fas fa-home"></i>
                            </span>
                        </p>
                    </div>
                    <div class="field">
                        <p class="control is-expanded has-icons-left">
                            <input v-model="localCustomer.contact.deliveryAddress.street" class="input" type="text" placeholder="Street name">
                            <span class="icon is-small is-left">
                                <i class="fas fa-road"></i>
                            </span>
                        </p>
                    </div>
                </div>
             </div>
             <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label"></label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <p class="control is-expanded has-icons-left">
                            <input v-model="localCustomer.contact.deliveryAddress.city" class="input" type="text" placeholder="Town or city">
                            <span class="icon is-small is-left">
                                <i class="fas fa-building"></i>
                            </span>
                        </p>
                    </div>
                    <div class="field">
                        <p class="control is-expanded has-icons-left">
                            <input v-model="localCustomer.contact.deliveryAddress.state" class="input" type="text" placeholder="State">
                            <span class="icon is-small is-left">
                                <i class="fas fa-map"></i>
                            </span>
                        </p>
                    </div>
                </div>
             </div>
             <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label"></label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <p class="control is-expanded has-icons-left">
                            <input v-model="localCustomer.contact.deliveryAddress.postalCode" class="input" type="text" placeholder="Postal code">
                            <span class="icon is-small is-left">
                                <i class="fas fa-map-pin"></i>
                            </span>
                        </p>
                    </div>

                    <div class="dropdown is-active">
                        <div class="dropdown-trigger">
                            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                <span>Country</span>
                                <span class="icon is-small">
                                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control is-expanded has-icons-left">
                            <div class="select">
                                <select v-model="localCustomer.contact.deliveryAddress.country" 
                                    class="input" type="text" placeholder="Country">
                                    <option selected value>Country</option>
                                    <option v-for="country in countries" v-bind:key="country.name">{{ country.name }}</option>
                                </select>
                            </div>
                            <div class="icon is-small is-left">
                                <i class="fas fa-globe"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Marketing preferences</label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <label class="checkbox">
                            <input v-model="localCustomer.marketingPreferences.email" type="checkbox">
                            I agree to receive notifications by email
                        </label>
                    </div>
                    <div class="field">
                        <label class="checkbox">
                            <input v-model="localCustomer.marketingPreferences.sms" type="checkbox">
                            I agree to receive notifications by SMS text message
                        </label>
                    </div>
                </div>
            </div>
            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Headshot</label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <div class="file has-name">
                            <label class="file-label">
                                <input class="file-input" type="file" name="resume" v-on:change="uploadMugshot">
                                <span class="file-cta">
                                <span class="file-icon">
                                    <i class="fas fa-upload"></i>
                                </span>
                                <span class="file-label">
                                    Upload a mugshot image…
                                </span>
                                </span>
                                <span class="file-name">
                                    {{mugshotFile.name}}
                                </span>
                            </label>
                        </div>
                    </div>
                    <div class="field">
                        <p class="control is-expanded has-icons-left">
                            <input v-model="localCustomer.mugshotURL" class="input" type="url" placeholder="Mugshot image URL">
                            <span class="icon is-small is-left">
                                <i class="fas fa-link"></i>
                            </span>
                        </p>
                    </div>
                    <div class="field" v-if="localCustomer.mugshotURL">
                        <figure class="image is-128x128">
                            <img :src="localCustomer.mugshotURL">
                        </figure>
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
import {
  AwsServiceClient,
  AwsRequest
} from 'mongodb-stitch-browser-services-aws'
import BSON from 'bson'
import { 
    mapState, 
    mapMutations 
    } from 'vuex';
import config from '../config';

export default {
    name: 'profile',
    props: [
    ],
    components: {
        MyHeader
    },
    data() {
        return {
            error: '',
            success: '',
            progress: '',
            localCustomer: {},
            countries: [],
            mugshotFile: {}
        }
    },
    computed: {
        ...mapState([
            'stitchClient',
            'database',
            'userLoggedIn',
            'userFirstName',
            'customer',
            'user'
        ])
    },
    methods: {
        ...mapMutations([
            'setCustomer',
            'setUserFirstName'
        ]),
        getCountriesList () {
            this.stitchClient.callFunction("getCountriesList")
            .then ((results) => {
                this.countries = results;
            },
            (err) => {
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                console.error(`Error: failed to fetch country list: ${err.message}`);
            })
        },
        fetchCustomer () {
            this.progress = 'Looking for existing user profile.';
            this.database.collection("customers")
            .findOne({"contact.email": this.user.profile.data.email}) 
            .then (customerDoc => {
                    if (customerDoc) {
                    this.localCustomer = customerDoc;
                    this.progress = '';
                } else {
                    // No record found for this customer – doesn't mean that it's a problem
                    this.progress = ''
                }
            }, (err) => {
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                console.error(`Error: attempt to read customer document failed: ${err.message}`);
            })
        },
        saveProfile ()
        {   
            // TODO check that email address is unique (will be caught with a duplicate key error)
            this.progress = 'Writing profile to database.';
            this.error = '';
            this.success = '';
            this.database.collection("customers").updateOne(
                {"contact.email": this.localCustomer.contact.email},
                this.localCustomer,
                {upsert: true}
            ).then (() => {
                this.progress = '';
                this.setCustomer(this.localCustomer);
                if (this.localCustomer.name.first) {
                    this.setUserFirstName(this.localCustomer.name.first)
                }
                this.success = "User profile updated.";
                this.progress = 'Returning to main page in 2 seconds';
                const _this = this;
                setTimeout(function(){
                    _this.$router.push({name: 'home'});
                }, 2000);
            }, (err) => {
                this.progress = '';
                this.error = `Error: Writing profile to the database - ${err.message}`;
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                console.error(this.error);
            })
        },
        convertImageToBSON (file) {
            return new Promise(
                resolve => {
                    const fileReader = new FileReader;
                    fileReader.onload = event => {
                        const eventBinary = new BSON.Binary(new Uint8Array(event.target.result));
                        resolve(eventBinary);
                    }
                    fileReader.readAsArrayBuffer(file);
                }
            )
        },
        uploadMugshot (event) {
            this.error = '';
            this.progress = '';
            this.success = '';
            const files = event.target.files || event.dataTransfer.files;
            if (files.length) {
                this.mugshotFile = files[0];
                // TODO switch to MongoDB marketing account AWS2 / ecommerce-mongodb-mugshots
                const s3 = this.stitchClient.getServiceClient(AwsServiceClient.factory, config.aws.serviceName);
                this.convertImageToBSON (this.mugshotFile)
                .then ((bsonFile) => {
                        let now = Date.now();
                    const s3Args = { 
                        ACL: "public-read",
                        // TODO: Make configurable
                        Bucket: config.aws.bucket,
                        // Bucket: "clusterdb-ecommerce-mugshots",
                        ContentType: this.mugshotFile.type,
                        Key: `mug_${this.customer.contact.email}_${now}`,
                        Body: bsonFile
                    };
                    const request = new AwsRequest.Builder()
                        .withService("s3")
                        .withAction("PutObject")
                        .withArgs(s3Args);
                    s3.execute(request.build())
                    .then (() => {
                        // TODO include timestamp in the URL
                        // this.customer.mugshotURL = `https://clusterdb-ecommerce-mugshots.s3.amazonaws.com/mug_${this.customer.contact.email}_${now}`
                        // this.customer.mugshotURL = `https://ecommerce-mongodb-mugshots.s3.amazonaws.com/mug_${this.customer.contact.email}_${now}`
                        /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                        console.log('storing new url');
                        this.localCustomer.mugshotURL = `https://${config.aws.bucket}.s3.amazonaws.com/mug_${this.customer.contact.email}_${now}`
                        /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                        console.log(`newURL = ${this.localCustomer.mugshotURL}`);
                    },
                    (error) => {
                        this.error = `Failed to upload image file: ${error.message}`;
                    })
                },
                (error) => {
                    this.error = `Error: Failed to convert image file: ${error.messahge}.`;
                })
            } else {
                this.error = "Failed to select a file";
            }
        }
    },
    created() {
        this.getCountriesList();
        if (this.userLoggedIn) {
            this.localCustomer = this.customer;
            this.localCustomer.owner_id = this.stitchClient.auth.user.id;
            this.localCustomer.contact.email = this.user.profile.data.email;
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
