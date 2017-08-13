<template>
    <div class="search">
        <input class="search-input" type="text" @input="search" placeholder="Search..."></input>
        <SearchItem v-for="(item, idx) in searchResults" :item="item" :key="idx" @addToPlaylist="addToPlaylist"> </SearchItem>
    </div>
</template>

<script>
import _ from 'lodash'
import { EventBus } from '../EventBus'
import SearchItem from './SearchItem'

export default {
    name: 'station',
    components: {
        SearchItem
    },
    data() {
        return {
            searchResults: {}
        }
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

<style>
input:focus {
    outline: none;
    pointer-events: none;
}
</style>
