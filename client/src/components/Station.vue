<template>
    <div class="main">
        <div class="top">
            <div class="wave"></div>
            <div class="logo" @click="$router.push('/')"></div>
            <!-- <div class="logo"></div> -->
        </div>
    
        <div v-if="$store.state.station">
            <h1 class="station-id">{{$store.state.station.id}}</h1>
            <h1 class="station-title">{{$store.state.station.title}}</h1>
        </div>
    
        <player class="player"></player>
        <playlist class="playlist"></playlist>
        <search></search>
    </div>
</template>

<script>
import _ from 'lodash';
import { EventBus } from '../EventBus';
//components
import Playlist from './Playlist';
import Player from './Player';
import Search from './Search';

export default {
    name: 'station',
    components: {
        Player,
        Playlist,
        Search
    },

    created() {
        console.log('station created')
    },

    beforeDestroy() {
        console.log('station before destroy');
    },

    destroyed() {
        console.log('station destroyed');
    },

    computed: {
        fingerprint() {
            return this.$store.state.fingerprint;
        }
    },
    methods: {
        playSong(video) {
            EventBus.$emit('playSong', video);
        }
    }
}
</script>

<style scoped>
.main {
    width: 100%;
    text-align: center;
    overflow: hidden;
}

.top {
    width: 100%;
    min-height: 140px;
    position: relative;
}

.wave {
    position: absolute;
    width: 100%;
    height: 100%;
    background-position-y: center;
    background-position-x: center;
    background-repeat: repeat-x;
    background-size: contain;
    background-image: url('../../graphics/wave_small.png')
}

.logo {
    margin: 2vw;
    height: 25vw;
    width: 25vw;
    min-width: 140px;
    min-height: 140px;
    max-width: 300px;
    max-height: 300px;
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    background-image: url('../../graphics/logo_big.png');
}

.station-title {
    font-family: 'pixelated';
    font-size: 50px;
    margin: 0;
}

.station-id {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 100px;
    color: white;
    margin: 0;
    margin-top: -2%;
}


/* .player {
    border: 5px solid white;
    border-radius: 10px;
} */

.playlist {
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
}

.player {
    margin-left: auto;
    margin-right: auto;
}
</style>