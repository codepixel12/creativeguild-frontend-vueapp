import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

//create our state
const state = {
    user: null
}

//create store
const store = new Vuex.Store({
    plugins: [createPersistedState()],
    //Parameters
    state,
    getters: {
        user: (state) => {
            return state.user;
        }
    }, //Forgetting the current state value
    actions: {
        user(context, user) {
            context.commit('user', user);
        }
    }, //Changing the value of the state
    mutations: {
        user(state, user) {
            state.user = user;
        }
    } //When we call actions it's call mutations to change the state and we can get it from getters
});

//export the store
export default store;

