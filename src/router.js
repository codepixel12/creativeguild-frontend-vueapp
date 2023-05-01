import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Register from './components/Register.vue'
import Login from './components/Login.vue'
import Forgot from './components/ForgotPassword.vue'
import ResetPassword from './components/ResetPassword.vue'

Vue.use(Router)

export default new Router({
    mode: 'history', //to remove # in the URL
    routes: [
        { path: '/', component: Home },
        { path: '/register', component: Register },
        { path: '/login', component: Login },
        { path: '/forgot', component: Forgot },
        { path: '/reset-password/:token', component: ResetPassword }

    ]
})