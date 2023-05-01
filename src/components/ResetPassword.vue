<template>
    <div>

        <body class="gradientStyle1">

            <div class="root">

                <div class="systemAccessCard">
                    <div class="logo">
                        <img src="@/assets/creativeguild-logo.png" alt="Creative Guild" />
                    </div>
                    <h1>Change Password</h1>
                    <p>Use the Reset Code sent to your inbox</p>
                    <!--<p><router-link to="forgot"><u>Resend Link</u></router-link></p>-->
                    <p><a href="/forgot"><u>Resend Link</u></a></p>
                    <form @submit.prevent="submitData">

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
                            <label>Reset Code</label>
                            <input type="text" v-model="verification_code" @focus="clearError('verification_code')" placeholder="2FA78B" />
                            <span v-if="errors.verification_code" style="color:red">{{errors.verification_code[0]}}</span>
                        </div>

                        <div class="formRow">
                            <label>Password</label>
                            <div class="passwordField loginPassword">
                                <input type="password" v-model="password" :type="showPassword ? 'text' : 'password'" @focus="clearError('password')" placeholder="************" />
                                <a href="javascript:;" @click="showPassword = !showPassword" class="eye">
                                    <span class="show" :style="showPassword ? { 'backgroundImage': 'url(' + eyeActiveImageUrl + ')' } : { 'backgroundImage': 'url(' + eyeInActiveImageUrl + ')' } "></span>
                                </a>   
                            </div>
                            <!--<div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword">
                                <i class="fa fa-eye" :class="showPassword ? 'text-primary' : ''"></i>
                                </button>
                            </div>-->
                            <div class="validationMessage" v-if="errors.password" >{{errors.password[0]}}</div>
                        </div>

                        <div class="formRow">
                            <label>Confirm Password</label>
                            <div class="passwordField loginPassword">
                            <input type="password" v-model="confirm_password" :type="showCPassword ? 'text' : 'password'" @focus="clearError('confirm_password')" placeholder="************" />
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
import eyeActiveImage from '../assets/eye_active.png';
import eyeInActiveImage from '../assets/eye_inactive.png';
Vue.use(axios)

export default {
    name: 'ResetPassword',
    data() {
        return {
            showPassword: false,
            showCPassword: false,
            loading: false,
            successMsg: '',
            errorMsg: '',
            passwordTextboxErrMsg:'',
            cpasswordTextboxErrMsg:'',
            password: '',
            confirm_password: '',
            verification_code: '',
            errors: {},
            eyeActiveImageUrl: eyeActiveImage,
            eyeInActiveImageUrl: eyeInActiveImage,
        }
    },
    methods: {
        async submitData() {
            this.loading = true;
            await axios.post("api/auth/reset-password", {
                password: this.password,
                confirm_password: this.confirm_password,
                verification_code: this.verification_code,
                token: this.$route.params.token
            }).then(
                ({ data }) => {
                    console.log(data);
                    try {
                        this.loading = false;
                        if (data.success == false) {
                            this.errorMsg = data.msg;
                            return false;
                        }
                        else if(data.message == 'Link Expired')
                        {
                            console.log("Line no::98::errors::",data.errors);
                            this.errorMsg = data.errors;
                        }
                        else if(data.message == 'Validation Fails')
                        {
                            console.log("Line no::98::errors::",data.errors);
                            this.errors = data.errors;
                        }
                        else
                        {
                            this.successMsg = data.msg;
                            this.$router.push('/login');
                        }
                    }
                    catch (err) {
                        this.loading = false;
                        //alert("Failed");
                        console.log(err);
                        //this.printErrorMsg(data);
                    }
                }
            )
        },//saveData() function ends here
        clearError(field) {
            this.errors[field] = [];
        }
    },
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
<style scoped>
</style>
