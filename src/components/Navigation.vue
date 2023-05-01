<template>
    <div>
        <!--<a href="/login">Home</a>-->
        <!--User router-link instead of anchor tag because the page is not refresh when you click on the link-->
        <router-link to="/">Home</router-link>
        <ul v-if="!user">
            <li><router-link to="/login">Login</router-link></li>
            <li><router-link to="/register">Register</router-link></li>
        </ul>
        <ul v-if="user">
            <!--<li><a href="javascript:void(0);" @click="logout">Logout</a></li>-->
            <li><a href="#" @click="logout">Logout</a></li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Navigation',
    //props: ['user'], //we don't need props from parent component App.vue because we use vuex through mapGetters computed
    methods: {
        logout() {
            //remove user_token from local storage
            localStorage.removeItem('user_token');
            this.$store.dispatch('user', null); //call action in src/vuex.js file for state management
            this.$router.push('/login');
        }
    },
    computed: {
        ...mapGetters(['user'])
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
