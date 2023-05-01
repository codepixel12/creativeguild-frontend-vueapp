<template>
    <div>
        <body class="gradientStyle2">

            <div class="wrapper">

                <section class="card profileInfo">

                    <div class="profilePic">
                        <a href="#" @click="visible = !visible">
                            <!--<img src="@/assets/default-profile-avtar.jpeg" class="avatar" />-->
                            <img v-if="user.profile_picture" :src="user.profile_picture" class="avatar" />
                            <img v-else src="@/assets/default-profile-avtar.jpeg" class="avatar" />
                        </a>
                    </div>

                    

                    <div class="profileBio">
                        <h1> {{userFullName}} </h1>
                        <h3>Bio</h3>
                        <p>{{user.bio}}</p>
                    </div>

                    <div class="profileContactInfo">
                        
                        <div>
                            <label>Phone</label>
                            <a>{{user.phone}}</a>
                        </div>
                        <div>
                            <label>Email</label>
                            <a>{{user.email}}</a>
                        </div>
                        <div>
                             <label>Logout</label>
                            <a href="#" @click="logout">Logout</a>
                        </div>
                    </div>
                </section>

                <section class="albumLists">

                    <ul>
                        <li class="card" v-for="album in userAlbumList" :key="album.id">
                            <a href="" class="albumThumbnail">
                                <span>{{album.title}}</span>
                                <img :src="getImgUrl(album.featured_image)" />
                            </a>
                            <div class="excerpt">
                                <p>{{album.description}}</p>
                                <div class="albumMeta">
                                    <div><span v-if="album.is_featured=='true'"><img src="@/assets/heart.svg" /></span></div>
                                    <div><span>{{album.date}}</span></div>
                                </div>
                            </div>
                        </li>
                      
                    </ul>

                </section>

            </div> <!-- root ENDS -->


            <!--
                Edit Profile Pic Model Box
            -->
            <div class="modelOverlay" v-if="visible"></div>
            <div class="model" v-if="visible">
                
                <form @submit.prevent="handleSubmit(user.id)">
                <div class="modelWrapper">
                    <a href="#" @click="visible = false" class="close"><img src="@/assets/close.svg" /></a>
                    <h5>Profile Photo {{user.id}}</h5>
                    <div class="uploadProfilePic">
                        
                            <div class="avtar" v-if="user.profile_picture"><img :src="user.profile_picture" class="avatar" /></div>
                            <div class="avtar" v-else><img src="@/assets/default-profile-avtar.jpeg" class="avatar" /></div>
                            <div>
                                <span v-if="errors" style="color:red">{{errors}}</span>
                                <h6>Image Specification</h6>
                                <p>
                                    - Image Size is less than 5 MB <br>
                                    - Formate JPG, PNG Files<br>
                                    - Make sure image is not blured
                                </p>

                                <input type="file" accept="image/*" @change="previewImage"/>

                                <button type="submit" class="primaryBtn" :disabled="loading">
                                    <!-- Add disabled="" attribute when user click on button -->
                                    <span class="btnLoader">
                                        <span class="spinLoader"></span>
                                    </span>
                                    Upload
                                </button>
                            </div>
                    </div><!--uploadProfilePic ends here-->
                </div> <!--modelWrapper ends here-->
                </form>

            </div>

        </body>

    </div>
</template>

<script>
import {ref,watch} from 'vue';
import Vue from 'vue';
import axios from 'axios';
Vue.use(axios)

import { mapGetters } from 'vuex';

export default {
    name: 'Home',
    // props: ['user'], //we don't need props from parent component App.vue because we use vuex through mapGetters computed
    computed: {
        ...mapGetters(['user'])
    },
    data() {
        return {
            loading: false,
            errors: '',
            user_id:'',
            userFullName: '',
            errorMsg: '',
            userAlbumList: [],
            visible: false,
            imageData: "",
            imageFile: "",
            imageUrl: "/img/default-profile-avtar.be7a6dcb.jpeg", //we will store base64 format of image in this string
        }
    },
    created() {
        //this.$store.dispatch('initializeData');
        if(this.user){
            const userInfo = this.user; // fetch the value of the getter
            console.log("user information::",userInfo); // print the value to the console
            this.getUSerAlbum();
        }
        else
        {
           this.$router.push('/login'); 
        }
        
    },
    methods: {
        logout() {
            //remove user_token from local storage
            localStorage.removeItem('user_token');
            this.$store.dispatch('user', null); //call action in src/vuex.js file for state management
            this.$router.push('/login');
        },
        async getUSerAlbum() {
            console.log("Get Album function called");
            console.log(" user Id::" +this.user.id);
            console.log(" user name::" +this.user.name);
            this.userFullName = this.user.name;
            await axios.post("api/auth/user-album", { id: this.user.id })
                .then(
                    ({ data }) => {
                        console.log(data);
                        try {
                           if (data.success == false) {
                                this.errorMsg = data.msg;
                                return false;
                            }
                            else {
                                this.userAlbumList = data.data;
                            }
                        }
                        catch (err) {
                            this.errorMsg = "Invalid Credentials";
                            return false;
                        }
                    }
                )
        },
        getImgUrl(album) {
            var images = require.context('../assets/', false, /\.jpg$/);
                
            if (album !== ''){ 
                return images('./' + album);
            }
            else{
                return images('./album1-thumb.jpeg'); // Default image. 
            }
        },
        previewImage: function(event) {
            this.errors = "";
            const imageFiles = [];

            // Reference to the DOM input element
            var input = event.target;
            this.imageData = event.target.files[0];
            // Ensure that you have a file before attempting to read it
            if (input.files && input.files[0]) {
                // create a new FileReader to read this image and convert to base64 format
                var reader = new FileReader();
                // Define a callback function to run, when FileReader finishes its job
                reader.onload = (e) => {
                    // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                    // Read image as base64 and set to imageData
                    this.imageUrl = e.target.result;//return image base64
                    this.user.profile_picture = e.target.result;//return image base64

                    const file = new File([reader.result], input.files[0].name, { type: input.files[0].type });
                    imageFiles.push(file);
                    //this.imageData = file;//return image array
                    
                }
                // Start the reader job - read file as a data url (base64 format)
                reader.readAsDataURL(input.files[0]);
            }
            else
            {
                this.user.profile_picture = require('../assets/default-profile-avtar.jpeg');
            }
        },
        async handleSubmit(userId) {
            this.loading = true;
            //console.log(" user image::" +this.user.profile_picture);
            console.log("Line no::197::",this.imageData);
            if(this.imageData){
                 this.errors = "";
                //Submit an Image file using FormData
                let data = new FormData();
                console.log("handleSubmit user id::",userId);
                data.append('user_id',userId);
                data.append('image', this.imageData);

                await axios.post("api/auth/user-upload-image",data)
                    .then(
                        ({ response }) => {
                            console.log("response::",response);
                            try {
                                this.loading = false;
                                if (response.data.success == true) {
                                    this.imageUrl = response.data.msg;
                                    this.user.profile_picture = response.data.msg;
                                    this.visible = false;
                                }
                                else {
                                    this.imageUrl = require('../assets/default-profile-avtar.jpeg');
                                    this.user.profile_picture = require('../assets/default-profile-avtar.jpeg');
                                    return false;
                                }
                            }
                            catch (err) {
                                this.loading = false;
                                //alert("Failed");
                                console.log(err);
                                //this.errorMsg = "Invalid Credentials";
                            }
                        }
                    )
                    this.visible = false;
            }//if ends here
            else
            {
                this.errors = "Please select Image for upload";
                this.loading = false;
            }
        }//handleSubmit() function ends here
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
