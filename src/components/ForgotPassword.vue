<template>
    <div>
        <body class="gradientStyle1">

        <div class="root">

            <div class="systemAccessCard">
                <div class="logo">
                    <img src="@/assets/creativeguild-logo.png" alt="Creative Guild" />
                </div>
                <h1>Password Reset Request</h1>
                <p>Have an Account? <router-link to="login">Login</router-link></p>
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
                        <label>Email</label>
                        <input type="email" v-model="email" placeholder="Enter Your Email" />
                    </div>


                    <div class="formButton">
                        <button type="submit" class="primaryBtn" :disabled="loading">
                            <!-- Add disabled="" attribute when user click on button -->
                            <span class="btnLoader">
                                <span class="spinLoader"></span>
                            </span>
                            Submit Reset Request
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
Vue.use(axios)

export default {
    name: 'Forgot',
    data() {
        return {
            loading: false,
            successMsg: '',
            errorMsg: '',
            emailTextboxErrMsg:'',
            email: '',
        }
    },
    methods: {
        async submitData() {
            this.loading = true;
            await axios.post("api/auth/forget-password", { email: this.email })
                .then(
                    ({ data }) => {
                        console.log(data);
                        try {
                            this.loading = false;
                            if (data.success == false) {
                                this.errorMsg = data.msg;
                                this.successMsg = "";
                                return false;
                            }
                            else
                            {
                                this.errorMsg = "";
                                this.successMsg = data.msg;
                            }
                        }
                        catch (err) {
                            this.loading = false;
                            //alert("Failed");
                            console.log(err);
                            this.errorMsg = "Invalid Credentials";
                        }
                    }
                )
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
