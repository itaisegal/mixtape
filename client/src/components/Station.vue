<template>
    <div class="main">
        <div class="top">
            <div class="wave"></div>
            <div class="logo"></div>
        </div>
        <div class="bottom">
            <div class="container">
                <div v-if="!station && !stationNotFound">
                    <h1>looking for station</h1>
                </div>
                <div v-if="stationNotFound">
                    <h1>station not found :(</h1>
                </div>
                <div v-if="station">
                    <h1 class="id">{{station.id}}</h1>
                    <h1 class="title">{{station.title}}</h1>
    
                    <Player class="player" :playlist="playlist" ></Player>
    
                    <div class="playlist">
                        <PlaylistItem v-for="(item, idx) in playlist" :key="idx" :item="item" @playSong="playSong"></PlaylistItem>
                    </div>
                    <input type="text" @input="search"></input>
                    <SearchItem v-for="(item, idx) in searchResults" :item="item" :key="idx" @addToPlaylist="addToPlaylist"> </SearchItem>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import { EventBus } from '../EventBus'
//components
import SearchItem from './SearchItem'
import PlaylistItem from './PlaylistItem'
import Player from './Player'

export default {
    name: 'station',
    components: {
        SearchItem,
        PlaylistItem,
        Player
    },
    data() {
        return {
            stationNotFound: false,
            searchResults: {}
        }
    },
    created() {

    },
    watch: {
        '$route'(to, from) {
            this.joinStation();
        },
        fingerprint() {
            this.joinStation();
        }
    },
    sockets: {
        setStation(station) {
            if (!station) {
                this.stationNotFound = true;
                this.$store.state.station = null;
            } else {
                this.$store.commit('setStation', station)
                this.stationNotFound = false;
            }
        },
        setTime(time) {
            var clientTime = Date.now();
            var roundtripTime = clientTime - time.clientTime
            this.$store.commit('setServerTimeOffset', time.serverTime - clientTime + roundtripTime / 2);
        },
        msg(msg) {
            console.log(msg);
        }
    },
    computed: {
        station() {
            return this.$store.state.station
        },
        playlist() {
            return this.$store.state.station.playlist
        },
        fingerprint() {
            return this.$store.state.fingerprint
        },
        currentlyPlaying() {
            return this.$store.state.station.currentlyPlaying
        }
    },
    methods: {
        getTime() {
            var clientTime = Date.now();
            this.$socket.emit('getTime', clientTime);
        },
        joinStation() {
            if (this.fingerprint) {
                const id = this.$route.params.stationId;
                this.$socket.emit('join', id, this.fingerprint)
                this.stationNotFound = false;
            }
        },
        addToPlaylist(video) {
            console.log('add to playlist');
            this.$socket.emit('addToPlaylist', this.station.id, video, this.fingerprint)
        },
        playSong(video) {
            EventBus.$emit('playSong', video);
        },
        search: _.debounce(function (e) {
            var that = this;
            var url = 'https://www.googleapis.com/youtube/v3/search?' +
                'part=snippet' +
                '&videoEmbeddable=true' +
                '&type=video' +
                '&key=AIzaSyCpIRRrbKFuBidSqk2SJREaQPniXaap1TU' +
                '&q=' + e.target.value;

            fetch(url).then(results => {
                results.json().then(data => {
                    that.searchResults = data.items;
                })
            })
        }, 750)
    }
}
</script>

<style scoped>
.main {
    min-width: 640px;
    width: 100%;
    height: 100%;
    background: #00a2ff;
    background: linear-gradient(to bottom, #00a2ff 0%, #4acaff 100%);
    background-attachment: fixed;
}

.top {
    /* border: 1px solid black;  */
    width: 100%;
    height: 35vh;
    position: relative;
    padding-top: 2%;
}

.wave {
    position: absolute;
    width: 100%;
    height: 80%;
    background-position-y: center;
    background-position-x: center;
    background-repeat: repeat-x;
    background-image: url('../../graphics/wave_big.png')
}

.logo {
    height: 90%;
    width: 100%;
    min-height: 40%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
    background-image: url('../../graphics/logo_big.png');
    position: absolute;
}

.bottom {
    /* border: 1px solid black;  */
    padding-top: 1%;
    width: 100%;
    position: relative;
}

.container {
    width: 100%;
    max-width: 720px;
    margin: auto;
    text-align: center;
}

.id {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 100px;
    color: white;
    margin: 0;
    margin-top: -2%;
}

.title {
    font-family: 'pixelated';
    font-size: 50px;
    margin: 0;
}

.player{
    width: 100%;
    border: 5px solid white;
    border-radius: 5px;
    background: black;
}
</style>