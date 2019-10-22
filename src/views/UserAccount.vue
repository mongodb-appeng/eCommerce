<template>
<!-- Vue.js view to view and manage data associated with the customer account.
Includes profile data, current and past orders, and items being watched for 
back-in-stock notifications. -->
  <div class="user-account">
    <MyHeader></MyHeader>
    <div v-if="stitchReady" class="section">
        <h1 class="title is-3">{{ userFirstName }}'s Account</h1>
        <div class="tabs is-toggle is-toggle-rounded is-fullwidth">
        <ul>
            <li 
                v-bind:class="{'is-active': profileTab}"
                v-on:click="pickProfile">
            <a>
                <span class="icon is-small"><i class="fas fa-id-card"></i></span>
                <span>User Profile</span>
            </a>
            </li>
            <li 
                v-bind:class="{'is-active': ordersTab}"
                v-on:click="pickOrders">
            <a>
                <span class="icon is-small"><i class="fas fa-truck"></i></span>
                <span>Orders</span>
            </a>
            </li>
            <li
                v-bind:class="{'is-active': watchingTab}"
                v-on:click="pickWatching">
            <a>
                <span class="icon is-small"><i class="fas fa-eye"></i></span>
                <span>Watching</span>
            </a>
            </li>
        </ul>
        </div>
        <div v-if="profileTab">
            <UserProfile></UserProfile>
        </div>
        <div v-if="ordersTab">
            <OrderCards></OrderCards>
        </div>
        <div v-if="watchingTab">
            <WatchingCards></WatchingCards>
        </div>
    </div>
</div>
</template>

<script>

import MyHeader from '../components/Header.vue'
import UserProfile from '../components/UserProfile.vue'
import OrderCards from '../components/Orders/OrderCards.vue'
import WatchingCards from '../components/Product/WatchingCards.vue'

import { 
    mapState
    } from 'vuex';

export default {
    name: 'account',
    props: [
    ],
    components: {
        MyHeader,
        UserProfile,
        OrderCards,
        WatchingCards
    },
    data() {
        return {
            profileTab: true,
            ordersTab: false,
            watchingTab: false,
            stitchReady: false
        }
    },
    computed: {
        ...mapState([
            'userFirstName'
        ])
    },
    methods: {

        /**
         * Show profile tab
         */
        pickProfile () {
            this.profileTab = true;
            this.ordersTab = false;
            this.watchingTab = false;
        },

        /**
         * Show orders tab
         */
            pickOrders () {
            this.profileTab = false;
            this.ordersTab = true;
            this.watchingTab = false;
        },

        /**
         * Show watching tab
         */
        pickWatching () {
            this.profileTab = false;
            this.ordersTab = false;
            this.watchingTab = true;
        },

        /**
         * Hold of on rendering anything until we've authenticated with Stitch and have a client
         * connection to use
         */
        waitUntilStitchReady() {
            if (this.$root.$data.stitchClient && this.$root.$data.stitchClient.auth.isLoggedIn) {
                this.stitchReady = true;
            } else {
                let _this = this;
                setTimeout(_this.waitUntilStitchReady, 100);
            }
        },
    },
    mounted() {
        this.waitUntilStitchReady();
    }
}
</script>
