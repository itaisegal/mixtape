import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        serverTimeOffset: null,
        station: null,
        fingerprint: null,
        playerStatus: null
    },
    mutations: {
        setStation: (state, station) => {
            state.station = station;
        },
        setFingerprint(state, fingerprint) {
            state.fingerprint = fingerprint;
        },
        setServerTimeOffset(state, offset) {
            state.serverTimeOffset = offset;
        },
        updatePlayerStatus(state, status){
            state.playerStatus = status;
        }
    }
});