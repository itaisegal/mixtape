import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        serverTimeOffset: null,
        station: null,
        fingerprint: null,
        playerStatus: null,
        cantPlay: {} //ids of videos that got an error when trying to play
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
        updatePlayerStatus(state, status) {
            state.playerStatus = status;
        },
        cantPlay(state, id) {
            state.cantPlay[id] = true;
        }
    }
});