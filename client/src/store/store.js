import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        station: null,
        fingerprint: null
    },
    mutations: {
        setStation: (state, station) => {
            state.station = station;
        },
        setFingerprint(state, fingerprint) {
            state.fingerprint = fingerprint;
        }
    }
});