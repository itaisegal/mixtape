<template>
    <div class="playlist">
        <PlaylistItem v-for="(item, idx) in playlist" :key="idx" :idx="idx" :item="item" @playSong="playSong" @click="$emit('playSong', item)"></PlaylistItem>
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
.playlist {
    width: 100%;
}
</style>