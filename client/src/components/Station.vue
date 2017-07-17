<template>
    <div>
        <div v-if="!station && !stationNotFound">
            <h1>looking for station</h1>
        </div>
        <div v-if="stationNotFound">
            <h1>station not found :(</h1>
        </div>
        <div v-if="station">
            <h1>{{station.title}}</h1>
            <h1>{{station.id}}</h1>
    
            <!-- <youtube :video-id="currentVideo" @ready="ready" @change="change" @playing="playing" @ended="ended" @paused="paused" @buffering="buffering" @qued="qued" @error="error">
                                                                            </youtube> -->
    
            <Player :playlist="playlist" :currentlyPlaying="currentlyPlaying"></Player>
    
            <div class="playlist">
                <PlaylistItem v-for="(item, idx) in playlist" :key="idx" :item="item" @playSong="playSong"></PlaylistItem>
            </div>
            <input type="text" @input="search"></input>
            <SearchItem v-for="(item, idx) in searchResults" :item="item" :key="idx" @addToPlaylist="addToPlaylist"> </SearchItem>
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
            currentVideo: 'dQw4w9WgXcQ', //this can be a promotional video we upload to youtube
            searchResults: {}
        }
    },
    created() {
        if (!this.station) {
            if (this.$store.state.fingerprint) {
                this.joinStation()
            }
        }
    },
    watch: {
        '$route'(to, from) {
            debugger;
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
                debugger;
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
            const id = this.$route.params.stationId;
            this.$socket.emit('join', id, this.fingerprint)
            this.stationNotFound = false;
        },
        addToPlaylist(video) {
            debugger;
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
        }, 750),

        ready(player) {
            console.log('ready');
        },
        ended() {
            console.log('ended')
        },
        playing() {
            console.log('playing')
        },
        paused() {
            console.log('paused')
        },
        buffering() {
            console.log('buffering')
        },
        qued() {
            console.log('qued')
        },
        error() {
            console.log('error')
        },
        change() {
            console.log('change')
        }
    }
}
</script>
