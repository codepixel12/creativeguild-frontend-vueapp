<template>
    <div>
        <body class="gradientStyle1">
            <div class="root">
            <div class="systemAccessCard">
                <div class="logo">
                    <img src="@/assets/creativeguild-logo.png" alt="Creative Guild" />
                </div>
                <h1>Login to your account</h1>
                <p>Don't have an Account? <router-link to="register">Create an Account</router-link></p>
                <form id="login_form" @submit.prevent="saveData">

                    <div class="alertMessage error" v-if="errorMsg">
                        <span>{{errorMsg}}</span>
                    </div>

                    <!--<div class="alertMessage warning">
                        <span>Warning Message</span>
                    </div>-->

                    <div class="alertMessage success" v-if="successMsg">
                        {{successMsg}}
                    </div>

                    <div class="formRow">
                        <label>Email</label>
                        <input type="email" v-model="user.email" name="email" @focus="clearError('email')" placeholder="Enter Your Email" />
                        <div class="validationMessage" v-if="errors.email" >{{errors.email[0]}}</div>
                    </div>

                    <div class="formRow">
                        <label>Password</label>
                        <div class="passwordField loginPassword">
                            <input type="password" v-model="user.password" :type="showPassword ? 'text' : 'password'" name="password" @focus="clearError('password')" placeholder="************" />
                            <a href="javascript:;" @click="showPassword = !showPassword" class="eye">
                                <span class="show" :style="showPassword ? { 'backgroundImage': 'url(' + eyeActiveImageUrl + ')' } : { 'backgroundImage': 'url(' + eyeInActiveImageUrl + ')' } "></span>
                            </a>
                        </div> 

                        <!--<input type="password" v-model="user.password" :type="showPassword ? 'text' : 'password'" name="password" @focus="clearError('password')" placeholder="************" />
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword">
                            <i class="fa fa-eye" :class="showPassword ? 'text-primary' : ''"></i>
                            </button>
                        </div>-->

                        <div class="validationMessage" v-if="errors.password">{{errors.password[0]}}</div>
                    </div>

                    <div class="formLinks">
                        <router-link to="forgot">Forgot Password?</router-link>
                    </div>

                    <div class="formButton">
                        <button type="submit" class="primaryBtn" :disabled="loading">
                            <!-- Add disabled="" attribute when user click on button -->
                            <span class="btnLoader">
                                <span class="spinLoader"></span>
                            </span>
                            Login
                        </button>
                    </div>

                </form>
            </div>
            </div> <!-- root ENDS -->
        </body>
    </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import ErrorMessage from './ErrorMessage.vue';
Vue.use(axios);
import eyeActiveImage from '../assets/eye_active.png';
import eyeInActiveImage from '../assets/eye_inactive.png';

export default {
    name: 'Login',
    components: {
        ErrorMessage
    },
    data() {
        return {
            loading: false,
            showPassword: false,
            successMsg: '',
            errorMsg: '',
            result: {},
            errors: {},
            user: {
                email: '',
                password: '',
            },
            eyeActiveImageUrl: eyeActiveImage,
            eyeInActiveImageUrl: eyeInActiveImage,
        }
    },
    created() {
        console.log("created() called.....");
    },
    mounted() {
        console.log("mounted() called.....");
    },
    methods: {
        async saveData() {
            this.loading = true;
            await axios.post("api/auth/login", this.user)
                .then(
                    ({ data }) => {
                        console.log(data);
                        try {
                            this.loading = false;
                            if (data.success == false) {
                                this.errorMsg = data.msg;
                                return false;
                            }
                            else if(data.message == 'Validation Fails')
                            {
                                this.errors = data.errors;
                            }
                            else {
                                this.successMsg = data.message;
                                localStorage.setItem('user_token', data.token_type + ' ' + data.access_token);
                                this.$store.dispatch('user', data.data); //call action in src/vuex.js file for state management
                                this.$router.push('/');//redirect to home page
                            }
                           

                        }
                        catch (err) {
                            this.loading = false;
                            //alert("Failed");
                            console.log(err);
                            this.errorMsg = "Invalid Credentials";
                            return false;
                        }
                    }
                )
        },//saveData() function ends here
        clearError(field) {
            this.errors[field] = [];
        }
    },//methods ends here 
    watch: {
        errors: {
        handler() {
            this.$nextTick(() => {
            console.log('nextTick Updating error messages:', this.errors);
            // Hide any existing error messages
            const errorElements = this.$el.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.style.display = 'none';
            });
            // Show new error messages
            Object.keys(this.errors).forEach(field => {
                const errorMessages = this.errors[field];
                const errorElement = this.$el.querySelector(`#${field}-error`);
                if (errorElement) {
                errorElement.style.display = 'block';
                errorElement.textContent = errorMessages[0];
                }
            });
            });
        },
        deep: true //deep: true in the watch object to watch for changes in the errors object, including changes to its nested properties.
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
