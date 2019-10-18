<template>
<div>
<header>
    <section class="hero is-primary is-small">
    <div class="hero-head">
        <nav class="navbar">
        <div class="container">
            <div class="navbar-brand">
                <a class="navbar-item">
                    <img src="../assets/MongoDB_Logo_White_RGB.png" alt="Logo">
                </a>
                <div 
                    class="navbar-burger burger"
                    data-target=""
                    v-on:click="showBurgerNav = !showBurgerNav"
                    v-bind:class="{ 'is-active': showBurgerNav }"
                    >
                        <!-- These spans are only there for the 3 stripes of the burger icon -->
                        <span></span>
                        <span></span>
                        <span></span>
                </div>
            </div>
            <div id="" class="navbar-menu" v-bind:class="{ 'is-active': showBurgerNav }">
                <div class="navbar-end">
                    <!-- <a class="navbar-item is-active"> -->
                    <a class="navbar-item" v-on:click="gotoHome">
                        Home
                    </a>
                    <div class="field" id=search-box v-if="homePage">
                        <div class="control has-icons-right">
                            <input class="input is-small" 
                                type="text" 
                                v-model="searchTerm"
                                placeholder="Search for products" 
                                v-on:keyup.enter="search"
                            >
                            <span class="icon is-small is-right" v-on:click="search">
                            <i class="fas fa-search"></i>
                            </span>
                        </div>
                    </div>
                    <a class="navbar-item" v-if="customer.mugshotURL">
                        <figure class="image is-24x24">
                            <img v-on:click="gotoUserAccount" class="is-rounded" :src="customer.mugshotURL" alt="mugshot">
                        </figure>
                    </a>
                    <a v-if="userLoggedIn" class="navbar-item" v-on:click="gotoUserAccount">
                        <span >{{userFirstName}}'s account</span>
                    </a>
                    <a v-else class="navbar-item">
                        <span v-on:click="showLoginModal">Login/Register</span>
                    </a>
                    <a class="navbar-item" v-if="userLoggedIn">
                        <span v-on:click="logout">Sign out</span>
                    </a>
                    <a v-if="metaCustomer.shoppingBasketSize > 0" v-on:click="openBasket" class="navbar-item">
                        <span class="icon">
                            <i class="fas fa-shopping-cart"></i>
                        </span>
                        <span><small>{{ metaCustomer.shoppingBasketSize }}</small> Checkout</span>
                    </a>
                    <span class="navbar-item">
                        <a href="https://github.com/am-MongoDB/eCommerce" target="_blank" class="button is-black">
                            <span class="icon">
                                <i class="fab fa-github"></i>
                            </span>
                            <span>Source</span>
                        </a>
                    </span>
                </div>
            </div>
        </div>
        </nav>
    </div>
    <div class="hero-body">
        <div class="container has-text-centered">
            <p class="title">
                MongoDB Store
            </p>
            <p class="subtitle">
                Get it while it's hot!
            </p>
        </div>
    </div>
    </section>
</header>
<body>
    <AnonymousAuth></AnonymousAuth>
    <div class="container">
        <!-- <div v-if="loginModalVisible || (loginRequested && !userLoggedIn)" class="modal is-active"> -->
        <div v-if="loginModalVisible" class="modal is-active" v-on:close-modal="hideLoginModal">
            <div class="modal-background"></div>
            <div class="modal-content">
                <UserLogin v-on:close-modal="hideLoginModal"></UserLogin>
                <button class="modal-close is-large" aria-label="close" v-on:click="hideLoginModal"></button>
            </div>
        </div>
    </div>
</body>
</div>
</template>

<script>
import AnonymousAuth from '../components/AnonymousAuth.vue'
import UserLogin from "../components/UserLogin.vue"
import { 
    mapState, 
    mapMutations 
    } from 'vuex';

export default {
    name: "Header",
    props: [
        'homePage'
    ], 
    components: {
        AnonymousAuth,
        UserLogin
    },
    data() {
        return {
            loginModalVisible: false,
            showBurgerNav: false,
            // loginRequested: false,
            searchTerm: ''
        }
    },
    computed: {
        ...mapState([
            // 'stitchClient',
            'customer',
            'metaCustomer',
            'userFirstName',
            'userLoggedIn'
        ]),
    },
    methods: {
        ...mapMutations([
            'signout'
        ]),
        showLoginModal () {
            this.loginModalVisible = true;
        },
        hideLoginModal () {
            this.loginModalVisible = false;
            // this.needLogin = false;
        },
        gotoUserAccount () {
            if (this.userLoggedIn) {
                this.$router.push({name: 'account'})
            }
        },
        gotoHome () {
            this.$router.push({name: 'home'})
        },
        openBasket () {
            if (this.userLoggedIn) {
                this.$router.push({name: 'basket'})
            } else {
                this.showLoginModal()
            }
        },
        logout () {
            this.signout();
            // this.$router.push({name: 'home'}); // TODO
            // TODO add this back?
            // this.$root.$data.stitchClient.auth.logout()
            // .then (() => {
            //     this.signout();
            //     this.$router.push({name: 'home'});
            // },
            // (error) => {
            //     /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
            //     console.error(`Error: Failed to sign out ${error.message}`);
            // })
        },
        search () {
            this.$emit('search-term', this.searchTerm);
        }
    },
    created() {
        // this.loginRequested = this.loginRequested;
  }
}
</script>

<style scoped>
div#search-box {
    padding-top: 12px;
}
</style>