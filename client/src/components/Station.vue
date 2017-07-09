<template>
    <div>
        <div v-if="station">
            <h1>{{station.title}}</h1>
            <h1>{{station.id}}</h1>
            <youtube :video-id="currentVideo"></youtube>
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
    data() {
        return {
            stationNotFound: false,
            currentVideo: 'jfe8pol6OG4', //this can be a promotional video we upload to youtube
            searchResults: {}
        }
    },
    watch: {
        '$route'(to, from) {
            const id = to.params.stationId;
            this.$socket.emit('join', id)
            this.stationNotFound = false;
            this.$store.commit('setStation', null)
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
    created() {
        if (!this.station) {
            const id = this.$route.params.stationId;
            this.$socket.emit('join', id)
        }
    },
    computed: {
        station() {
            return this.$store.state.station
        }
    },
    methods: {
        //  ?part=snippet&order=viewCount&q=skateboarding+dog&type=video&videoDefinition=high&key=AIzaSyCpIRRrbKFuBidSqk2SJREaQPniXaap1TU').then((r) => {
        search: _.debounce(function (e) {
            var that = this;
            var url = 'https://www.googleapis.com/youtube/v3/search?' +
                'part=snippet' +
                '&type=video' +
                '&key=AIzaSyCpIRRrbKFuBidSqk2SJREaQPniXaap1TU' +
                '&q=' + e.target.value;
            console.log(url)
            fetch(url).then(results => {
                results.json().then(data => {
                    that.searchResults = data.items;
                })
            })
        }, 1500)
    }
}
</script>
