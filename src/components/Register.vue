<template>
    <div>
        <body class="gradientStyle1">

            <div class="root">

                <div class="systemAccessCard registerForm">
                    <div class="logo">
                        <img src="@/assets/creativeguild-logo.png" alt="Creative Guild" />
                    </div>
                    <h1>Register an account</h1>
                    <p>Have an Account? <router-link to="login">Login</router-link></p>
                    <form id="register_form" @submit.prevent="registerData">

                        <div class="alertMessage error" v-if="errorMsg">
                            <span>{{errorMsg}}</span>
                        </div>

                        <!--<div class="alertMessage warning">
                            <span>Warning Message</span>
                        </div>-->

                        <div class="alertMessage success" v-if="successMsg">
                            {{successMsg}}
                        </div>

                        <div class="col2">

                            <div class="formRow">
                                <label>Name</label>
                                <input type="text" v-model="user.name" name="name" @focus="clearError('name')" placeholder="Full Name" />
                                <div class="validationMessage" v-if="errors.name">{{errors.name[0]}}</div>
                            </div>

                            <div class="formRow">
                                <label>Email</label>
                                <input type="email" v-model="user.email" name="email" @focus="clearError('email')" placeholder="Enter Your Email" />
                                <div class="validationMessage" v-if="errors.email">{{errors.email[0]}}</div>
                            </div>

                            <div class="formRow">
                                <label>Phone Number</label>
                                <input type="tel" v-model="user.phone" name="phone" @focus="clearError('phone')" placeholder="Phone Number" />
                                 <div class="validationMessage" v-if="errors.phone">{{errors.phone[0]}}</div>
                            </div>

                            <div class="formRow">
                                <label>Bio</label>
                                <input type="text" v-model="user.bio" name="bio" @focus="clearError('bio')" placeholder="Bio" />
                                <div class="validationMessage" v-if="errors.bio">{{errors.bio[0]}}</div>
                            </div>

                            <div class="formRow">
                                <label>Password</label>
                                <div class="passwordField loginPassword">
                                <input type="password" v-model="user.password" :type="showPassword ? 'text' : 'password'" name="password" @focus="clearError('password')" placeholder="************" />
                                <a href="javascript:;" @click="showPassword = !showPassword" class="eye">
                                    <span class="show" :style="showPassword ? { 'backgroundImage': 'url(' + eyeActiveImageUrl + ')' } : { 'backgroundImage': 'url(' + eyeInActiveImageUrl + ')' } "></span>
                                </a>
                                </div>
                                <!--<div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword">
                                    <i class="fa fa-eye" :class="showPassword ? 'text-primary' : ''"></i>
                                    </button>
                                </div>-->
                                <div class="validationMessage" v-if="errors.password">{{errors.password[0]}}</div>
                            </div>

                            <div class="formRow">
                                <label>Confirm Password</label>
                                <div class="passwordField loginPassword">
                                <input type="password" v-model="user.confirm_password" :type="showCPassword ? 'text' : 'password'" name="confirm_password" @focus="clearError('confirm_password')" placeholder="************" />
                                <a href="javascript:;" @click="showCPassword = !showCPassword" class="eye">
                                    <span class="show" :style="showCPassword ? { 'backgroundImage': 'url(' + eyeActiveImageUrl + ')' } : { 'backgroundImage': 'url(' + eyeInActiveImageUrl + ')' } "></span>
                                </a>
                                </div>
                                <!--<div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" @click="showCPassword = !showCPassword">
                                    <i class="fa fa-eye" :class="showCPassword ? 'text-primary' : ''"></i>
                                    </button>
                                </div>-->
                                <div class="validationMessage" v-if="errors.confirm_password">{{errors.confirm_password[0]}}</div>
                            </div>

                        </div>

                        <div class="formButton">
                            <button type="submit" class="primaryBtn" :disabled="loading">
                                <!-- Add disabled="" attribute when user click on button -->
                                <span class="btnLoader">
                                    <span class="spinLoader"></span>
                                </span>
                                Register
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
import eyeActiveImage from '../assets/eye_active.png';
import eyeInActiveImage from '../assets/eye_inactive.png';
Vue.use(axios)

export default {
    name: 'Register',
    data() {
        return {
            showPassword: false,
            showCPassword: false,
            loading: false,
            successMsg: '',
            errorMsg: '',
            nameTextboxErrMsg:'',
            emailTextboxErrMsg:'',
            phoneTextboxErrMsg:'',
            bioTextboxErrMsg:'',
            passwordTextboxErrMsg: '',
            cpasswordTextboxErrMsg:'',
            result: {},
            errors: {},
            user: {
                name: '',
                email: '',
                phone: '',
                bio: '',
                password: '',
                confirm_password: ''
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
        async registerData() {
            this.loading = true;
            await axios.post("api/auth/register", this.user)
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
                                console.log("Line no::157::errors::",data.errors);
                                this.errors = data.errors;
                            }
                            else {
                                this.successMsg = data.message;
                                this.$router.push('/login');
                            }
                            
                        }
                        catch (err) {
                            this.loading = false;
                            //alert("Failed");
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
<style scoped></style>
