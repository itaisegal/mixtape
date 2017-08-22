<template>
    <div id="searchBar" class="main" :class="{mainOpen : isOpen}">
        <transition name="fade" v-on:after-enter="focusSearch">
            <div class="bg" @click="close" v-if="isOpen"></div>
        </transition>
        <input id="search" class="search" type="text" @input="search" placeholder="Search..." :class="{searchOpen : isOpen}"></input>
        <div class="list" :class="{listOpen : isOpen}">
            <SearchItem v-for="(item, idx) in searchResults" :item="item" :key="idx" @addToPlaylist="addToPlaylist"> </SearchItem>
        </div>
        <div class="btn" @click="open" :class="{btnOpen : isOpen}">
        </div>
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
            searchResults: {},
            isOpen: false
        }
    },
    created() {
        var that = this;
        console.log(document.getElementsByTagName("BODY")[0]);
        document.getElementsByTagName("BODY")[0].click(function (e) {
            if (e.target.id !== 'searchBar') {
                that.close();
            }
        });
    },
    computed: {
        fingerprint() {
            return this.$store.state.fingerprint;
        }
    },
    methods: {
        open() {
            if (this.isOpen)
                return;

            this.isOpen = true;
            console.log('open');
        },
        close() {
            if (!this.isOpen)
                return;

            this.isOpen = false;
            console.log('closed');
        },
        focusSearch() {
            var search = document.getElementById('search');
            search.focus();
            search.select();
        },
        resizeSearchWidth() {  //resize search div width so it wont cover the logo
            document.getElementById('main');
            main.style.width = '130px';
        },
        addToPlaylist(video) {
            console.log('add to playlist');
            this.close();
            this.$socket.emit('addToPlaylist', this.$store.state.station.id, video, this.fingerprint)
        },
        search: _.debounce(function (e) {
            if (!e.target.value) {
                this.searchResults = {};
                return;
            }
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
    z-index: 100;
    position: fixed;
    top: 0;
    right: 0;
    width: 130px;
    min-width: 130px;
    min-height: 130px;
}

.mainOpen {
    width: 100%;
}

.btn {
    width: 10vw;
    height: 10vw;
    min-width: 70px;
    min-height: 70px;
    max-width: 90px;
    max-height: 90px;
    background-image: url('../../graphics/add.png');
    background-size: contain;
    background-repeat: no-repeat;
    transition: all 200ms;
    top: 2vw;
    right: 2vw;
    position: absolute;
}

.btnOpen {
    opacity: 0;
}

.search {
    position: absolute;
    width: 0px;
    left: 0;
    right: 0;
    top: 5vh;
    margin-left: auto;
    margin-right: auto;
    background-color: #202020;
    color: #ffffff;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    padding: 10px 20px;
    border-radius: 32px;
    font: normal 20px/normal Tahoma, Geneva, sans-serif;
    color: #20b3ff;
    text-overflow: clip;
    /* transition: all 200ms; */
    border: none;
    display: none;
}

.searchOpen {
    width: 80vw;
    max-width: 620px;
    display: block;
}

.list {
    margin-top: 15px;
    position: absolute;
    width: 80vw;
    max-width: 640px;
    top: 10vh;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    display: none;
}

.listOpen {
    display: inline;
}

input {
    width: 100%;
    margin-left: 20px;
}

input:focus {
    outline: none;
    pointer-events: none;
}

.bg {
    width: 100vw;
    height: 100vh;
    background-color: rgba(50, 50, 50, 0.7);
}

.fa {
    font-size: 45px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s
}

.fade-enter,
.fade-leave-to {
    opacity: 0
}
</style>
