<template>
    <div class="main">
    
        <player class="player"></player>
    
        <div class="playlist" v-if="$store.state.station">
            <PlaylistItem v-for="(item, idx) in $store.state.station.playlist" :key="idx" :item="item" @playSong="playSong"></PlaylistItem>
        </div>
    
        <input class="search" type="text" @input="search" placeholder="Search..."></input>
        <SearchItem v-for="(item, idx) in searchResults" :item="item" :key="idx" @addToPlaylist="addToPlaylist"> </SearchItem>
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
            searchResults: {}
        }
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
        addToPlaylist(video) {
            console.log('add to playlist');
            this.$socket.emit('addToPlaylist', this.$store.state.station.id, video, this.fingerprint)
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
    width: 100%;
    text-align: center;
}

.player {
    /* border: 5px solid white;
    border-radius: 10px; */
}

.playlist {
    width: 100%;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
}

.search {
    margin: 5px;
    border-radius: 15px;
    outline: none;
    border: none;
    /* font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; */
    font-size: 20px;
    padding: 7px;
}
</style>