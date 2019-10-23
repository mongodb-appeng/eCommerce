<template>
<!-- Vue.js component which lets the user view and edit their profile details -->
    <div class="container">
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Name</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control is-expanded has-icons-left">
                        <input 
                            v-model="localCustomer.name.first" 
                            class="input" 
                            type="name" 
                            placeholder="First">
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
                            <input 
                                v-model="localCustomer.contact.phone.mobile" 
                                class="input" 
                                type="tel" 
                                placeholder="Mobile phone number">
                            <span class="icon is-small is-left">
                                <i class="fas fa-phone"></i>
                            </span>
                        </p>
                    </div>
                    <p class="help">Include +CC</p>
                </div>
                <div class="field">
                    <p class="control is-expanded has-icons-left">
                        <input 
                            v-model="localCustomer.contact.phone.home" 
                            class="input" 
                            type="tel" 
                            placeholder="Home phone number">
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
                            <input 
                                v-model="localCustomer.contact.phone.work" 
                                class="input" 
                                type="tel" 
                                placeholder="Work phone number">
                            <span class="icon is-small is-left">
                                <i class="fas fa-phone"></i>
                            </span>
                        </p>
                    </div>
                    <p class="help">Include +CC</p>
                </div>
                <div class="field is-expanded">
                    <p class="control is-expanded has-icons-left">
                        <input 
                            v-model="localCustomer.contact.email" 
                            class="input" 
                            type="email" 
                            placeholder="Email" 
                            :disabled="localCustomer.contact.email">
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
                        <input 
                            v-model="localCustomer.contact.deliveryAddress.number" 
                            class="input" 
                            type="text" 
                            placeholder="House name or number">
                        <span class="icon is-small is-left">
                            <i class="fas fa-home"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control is-expanded has-icons-left">
                        <input 
                            v-model="localCustomer.contact.deliveryAddress.street" 
                            class="input" 
                            type="text" 
                            placeholder="Street name">
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
                        <input 
                            v-model="localCustomer.contact.deliveryAddress.city" 
                            class="input" 
                            type="text" 
                            placeholder="Town or city">
                        <span class="icon is-small is-left">
                            <i class="fas fa-building"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control is-expanded has-icons-left">
                        <input 
                            v-model="localCustomer.contact.deliveryAddress.state" 
                            class="input" 
                            type="text" 
                            placeholder="State">
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
                        <input 
                            v-model="localCustomer.contact.deliveryAddress.postalCode" 
                            class="input" 
                            type="text" 
                            placeholder="Postal code">
                        <span class="icon is-small is-left">
                            <i class="fas fa-map-pin"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <div class="control is-expanded has-icons-left">
                        <div class="select">
                            <select v-model="localCustomer.contact.deliveryAddress.country" 
                                class="input" type="text" placeholder="Country">
                                <option selected value>Country</option>
                                <option 
                                    v-for="country in countries" 
                                    v-bind:key="country.name">{{ country.name }}
                                </option>
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
                            <input 
                                class="file-input" 
                                type="file" 
                                name="resume" 
                                v-on:change="uploadMugshot">
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
                        <input 
                            v-model="localCustomer.mugshotURL"
                            class="input" 
                            type="url" 
                            placeholder="Mugshot image URL">
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
                <button v-if="allowSubmit" v-on:click="saveProfile" class="button is-success">
                    Save Profile
                </button>
                <button v-else class="button is-grey" disbaled>
                    Save Profile
                </button>
            </p>
        </div>
        <Status v-bind:status="status"></Status>
    </div>
</template>

<script>
import Status from './Status.vue'
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
    name: 'user-profile',
    components: {
        Status
    },
    data() {
        return {
            status: null,
            localCustomer: {},
            countries: [],
            mugshotFile: {},
            allowSubmit: true
        }
    },
    computed: {
        ...mapState([
            'userLoggedIn',
            'userFirstName',
            'customer'
        ])
    },
    methods: {
        ...mapMutations([
            'setCustomer',
            'setUserFirstName'
        ]),

        /**
         * Fetches a list of countries via a Stitch function
         */
        getCountriesList () {
            this.$root.$data.stitchClient.callFunction("getCountriesList")
            .then ((results) => {
                this.countries = results;
            },
            (error) => {
                this.status = {state: 'error', text: `Error: failed to fetch country list: ${error}`};
            })
        },

        /**
         * Uses the user's email address to retrieve a `customer` document from the database.
         * The user only has a customer document after they've submited their profile details
         * through this component for the first time.
         */
        fetchCustomer () {
            this.status = {state: 'progress', text: `Looking for existing user profile.`};
            this.$root.$data.database.collection("customers")
            .findOne({"contact.email": this.customer.contact.email}) 
            .then (customerDoc => {
                if (customerDoc) {
                    this.localCustomer = customerDoc;
                    this.status = null;
                } else {
                    // No record found for this customer – doesn't mean that it's a problem, just
                    // that they haven't yet submited their profile details.
                    // Initialise some default data to avoid rendering errors.
                    this.localCustomer.contact.phone = {
                        home: '',
                        work: '',
                        mobile: ''
                    };
                    this.localCustomer.deliveryAddress = {
                        number: '',
                        street: '',
                        city: '',
                        state: '',
                        postalCode: '',
                        country: ''
                    };
                    this.localCustomer.mugshotURL = '',
                    this.status = null;
                }
            }, (error) => {
                this.status = {state: 'error', text: `Error: attempt to read customer document failed: ${error}`};
            })
        },

        /**
         * Store the profile data in the `customer` collection in teh database, as well as
         * in the frontend Vuex state.
         */
        saveProfile () {
            this.status = {state: 'progress', text: 'Writing profile to database.'};
            this.$root.$data.database.collection("customers").updateOne(
                {"contact.email": this.localCustomer.contact.email},
                this.localCustomer,
                {upsert: true}
            ).then (() => {
                this.status = null;
                this.setCustomer(this.localCustomer);
                if (this.localCustomer.name.first) {
                    this.setUserFirstName(this.localCustomer.name.first)
                }
                this.status = {state: 'success', text: `User profile updated.`,time: 1000};             
            }, (error) => {
                this.status = {state: 'error', text: `Error: Writing profile to the database - ${error}`};
            })
        },

        /**
         * @param {string} file - The local file name for the file to be converted
         * @returns {Promise} - Resolves to a BSON file containing the image data
         */
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

        /**
         * Uploads the requested image file to Amazon S3 (via MongoDB Stitch), and stores its
         * resulting URL in the frontend Vuex state. It is not sent to the Atlas `customer`
         * document at this point.
         * @param {event} event - Vue.js event containing the file path
         */
        uploadMugshot (event) {
            this.status = null;
            const files = event.target.files || event.dataTransfer.files;
            if (files.length) {
                this.status = {state: 'progress', text: `Uploading image`};
                this.allowSubmit = false;
                this.mugshotFile = files[0];
                const s3 = this.$root.$data.stitchClient.getServiceClient(
                    AwsServiceClient.factory, 
                    config.aws.serviceName);
                // It's common to use email addresses of the form
                // `first.last+test-string@domain.com` when testing but S3 doesn't like
                // `+` in file names.
                const cleanEmail = this.customer.contact.email.replace("+", "_");
                this.convertImageToBSON (this.mugshotFile)
                .then ((bsonFile) => {
                    let now = Date.now();
                    const s3Args = { 
                        ACL: "public-read",
                        Bucket: config.aws.bucket,
                        ContentType: this.mugshotFile.type,
                        Key: `mug_${cleanEmail}_${now}`,
                        Body: bsonFile
                    };
                    const request = new AwsRequest.Builder()
                        .withService("s3")
                        .withAction("PutObject")
                        .withArgs(s3Args);
                    s3.execute(request.build())
                    .then (() => {
                        this.status = null;
                        this.localCustomer.mugshotURL = 
                            `https://${config.aws.bucket}.s3.amazonaws.com/mug_${cleanEmail}_${now}`;
                        this.allowSubmit = true;
                    },
                    (error) => {
                        this.status = {state: 'error', text: `Failed to upload image file: ${error}`};
                    })
                },
                (error) => {
                    this.status = {state: 'error', text: `Error: Failed to convert image file: ${error}`};
                    this.allowSubmit = true;
                })
            } else {
                this.status = {state: 'error', text: `Failed to select a file`};
                this.allowSubmit = true;
            }
        }
    },
    created() {
        this.getCountriesList();
        if (this.userLoggedIn) {
            this.localCustomer = this.customer;
            this.localCustomer.owner_id = this.$root.$data.stitchClient.auth.user.id;
            this.localCustomer.contact.email = this.customer.contact.email;
            this.fetchCustomer();
            this.originalEmail = this.localCustomer.contact.email;
        } else {
            this.status = {state: 'error', text: `Cannot access customer profile until user is logged in`};
        }
    }
}
</script>