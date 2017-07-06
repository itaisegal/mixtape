import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentStation: 'none',
        connected: false
    },
    mutations: {
        SOCKET_CONNECT: (state, status) => {
            state.connected = true;
            console.log('connected');
        },
        SOCKET_USER_MESSAGE: (state, message) => {
            state.message = message;
            console.log(message);
        }
    }
});