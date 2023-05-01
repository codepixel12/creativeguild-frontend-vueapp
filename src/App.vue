<template>
  <div>
    <!-- We don't need :user="user" because we use vuex
      <Navigation :user="user" />-->
    <div>
      <!--<router-view :user="user" />-->
      <router-view />

    </div>
  </div>
</template>

<script>
//import Navigation from './components/Navigation.vue'
//import Home from './components/Home.vue'
//import Register from './components/Register.vue'
import axios from 'axios';

export default {
  name: 'App',
  /*components: {
    //Navigation,
    //Home,
    //Register
  },*/
  data() {
    return {
      user: null
    }
  },
  async created() {
    //console.log(" user token::" + localStorage.getItem('user_token'));
    /*const response = await axios.get('api/auth/user', {
        headers: {
            Authorization: localStorage.getItem('user_token')
        }
    });*/
    if(localStorage.getItem('user_token')){
      const response = await axios.get('api/auth/user')
      .then(res => {
        //console.log("user response::::" + JSON.stringify(res.data));
        //console.log(JSON.stringify(res.data.data))
        //console.log("user name::" + res.data.data.name);

        //We use vux here
        this.$store.dispatch('user', res.data.data); //call action in vuex.js file for state management
        //this.user = res.data.data;
      });
    }//if ends here
    
  }
}
</script>

<style>
</style>
