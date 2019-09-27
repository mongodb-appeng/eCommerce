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
                <span class="navbar-burger burger" data-target="navbarMenuHeroB">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>
            <div id="navbarMenuHeroB" class="navbar-menu">
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
                        <img v-on:click="gotoProfile" class="is-rounded" :src="customer.mugshotURL" alt="mugshot">
                    </figure>
                </a>
                <a class="navbar-item" v-on:click="gotoProfile">
                    <span >Hi {{userFirstName}}</span>
                </a>
                <a class="navbar-item" v-if="!userLoggedIn">
                    <span v-on:click="showLoginModal">Login/Register</span>
                </a>
                <a class="navbar-item" v-if="userLoggedIn">
                    <span v-on:click="logout">Sign out</span>
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
    <div class="container">
        <div v-if="loginModalVisible || (loginRequested && !userLoggedIn)" class="modal is-active">
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
import UserLogin from "../components/UserLogin.vue"
import { 
    mapState, 
    mapMutations 
    } from 'vuex';

export default {
    name: "Header",
    props: [
        'needLogin',
        'homePage'
    ], 
    components: {
        UserLogin
    },
    data() {
        return {
            loginModalVisible: false,
            loginRequested: false,
            searchTerm: ''
        }
    },
    computed: {
        ...mapState([
            'stitchClient',
            'customer',
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
            this.needLogin = false;
        },
        gotoProfile () {
            if (this.userLoggedIn) {
                this.$router.push({name: 'profile'})
            }
        },
        gotoHome () {
            this.$router.push({name: 'home'})
        },
        logout () {
            this.stitchClient.auth.logout()
            .then (() => {
                this.signout();
            },
            (error) => {
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                console.error(`Error: Failed to sign out ${error.message}`);
            })
        },
        search () {
            this.$emit('search-term', this.searchTerm);
        }
    },
    created() {
        this.loginRequested = this.loginRequested;
  }
}
</script>

<style scoped>
div#search-box {
    padding-top: 12px;
}
</style>