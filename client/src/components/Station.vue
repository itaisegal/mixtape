<template>
    <div>
        <div v-if="station">
            <h1>{{station.title}}</h1>
            <h1>{{station.id}}</h1>
    
            <youtube :video-id="currentVideo" @playing="playing" @ended="ended" @paused="paused" @buffering="buffering" @qued="qued" @error="error">
            </youtube>
    
            <input type="text" @input="search"></input>
        </div>
        <div v-if="!station && !stationNotFound">
            <h1>looking for station</h1>
        </div>
        <div v-if="stationNotFound">
            <h1>station not found :(</h1>
        </div>
        <SearchItem v-for="(item, idx) in searchResults" :item="item" :key="idx"> </SearchItem>
    </div>
</template>

<script>
import _ from 'lodash'

import SearchItem from './SearchItem'

export default {
    name: 'station',
    components: {
        SearchItem
    },
    created() {
        if (!this.station) {
            if (this.$store.state.fingerprint) {
                this.joinStation()
            }
        }
    },
    data() {
        return {
            stationNotFound: false,
            currentVideo: 'jfe8pol6OG4', //this can be a promotional video we upload to youtube
            searchResults: {}
        }
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
            } else {
                this.$store.commit('setStation', station)
                this.stationNotFound = false;
            }
        },
        msg(msg) {
            console.log(msg);
        }
    },
    computed: {
        station() {
            return this.$store.state.station
        },
        fingerprint() {
            return this.$store.state.fingerprint
        }
    },
    methods: {
        joinStation() {
            const id = this.$route.params.stationId;
            this.$socket.emit('join', id, this.fingerprint)
            this.stationNotFound = false;
        },
        search: _.debounce(function (e) {
            var that = this;
            var url = 'https://www.googleapis.com/youtube/v3/search?' +
                'part=snippet' +
                '&type=video' +
                '&key=AIzaSyCpIRRrbKFuBidSqk2SJREaQPniXaap1TU' +
                '&q=' + e.target.value;
            fetch(url).then(results => {
                results.json().then(data => {
                    that.searchResults = data.items;
                })
            })
        }, 1500),

        ready() {
            console.log('ready')
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
        }
    }
}
</script>
