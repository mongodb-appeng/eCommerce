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
                <a class="navbar-item is-active">
                Home
                </a>
                <a class="navbar-item">
                Examples
                </a>
                <a class="navbar-item" v-if="userLoggedIn">
                    <span v-on:click="gotoProfile">Hi {{userFirstName}}</span>
                </a>
                <a class="navbar-item" v-if="!userLoggedIn">
                    <span v-on:click="showLoginModal">Login/Register</span>
                </a>
                <span class="navbar-item">
                <a class="button is-info is-inverted">
                    <span class="icon">
                    <i class="fab fa-github"></i>
                    </span>
                    <span>Download</span>
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
        <div v-if="loginModalVisible" class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-content">
                <UserLogin 
                    v-bind:stitchClient="stitchClient"
                    v-on:setDatabase="setDatabase"
                    v-on:user-logged-in="setUserLoggedIn">
                </UserLogin>
                <button class="modal-close is-large" aria-label="close" v-on:click="hideLoginModal"></button>
            </div>
        </div>
    </div>
</body>
</div>
</template>

<script>
import UserLogin from "../components/UserLogin.vue"

export default {
    name: "Header",
    props: [
        "userLoggedIn",
        "userFirstName",
        "stitchClient"
    ], 
    components: {
        UserLogin
    },
    data() {
        return {
            loginModalVisible: false
        }
    },
    methods: {
        setUserLoggedIn (user) {
            this.$emit("user-logged-in", user);
            this.hideLoginModal();
        },
        setDatabase (db) {
            this.$emit("setDatabase", db)
        },
        showLoginModal () {
            this.loginModalVisible = true;
        },
        hideLoginModal () {
            this.loginModalVisible = false;
        },
        gotoProfile () {
            this.$router.push({name: 'profile'})
        }
    },
    created() {

  }
}
</script>

<style scoped>
</style>