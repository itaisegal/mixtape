<template>
    <div class="playlist">
        <PlaylistItem v-for="(item, idx) in playlist" :key="idx" :item="item" @playSong="playSong"></PlaylistItem>
    </div>
</template>

<script>
import _ from 'lodash'
import { EventBus } from '../EventBus'
//components
import PlaylistItem from './PlaylistItem'

export default {
    name: 'station',
    components: {
        PlaylistItem
    },

    created() {
        console.log('playlist created')
    },

    beforeDestroy() {
        console.log('playlist before destroy');
    },

    destroyed() {
        console.log('playlist destroyed');
    },

    computed: {
        playlist() {
            if (this.$store.state.station)
                return this.$store.state.station.playlist;
            return [];
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
    border: 3px solid blue;
    width: 100vw;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
    padding: 5px;
    border-radius: 10px;
}

.search-input {
    margin: 5px;
    border-radius: 15px;
    outline: none;
    border: none;
    /* font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; */
    font-size: 20px;
    padding: 7px;
}
</style>