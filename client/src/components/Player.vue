<template>
    <div id="players">
        <div id="player1">
            <youtube :video-id="id1" :player-vars="{controls:0}" @ready="player1Ready" @change="change" @playing="playing" @ended="ended" @paused="paused" @buffering="buffering" @qued="qued" @error="error">
            </youtube>
        </div>
        <div id="player2">
            <youtube :video-id="id2" :player-vars="{controls:0}" @ready="player2Ready">
            </youtube>
        </div>
    </div>
</template>

<script>
import { EventBus } from '../EventBus'

export default {
    props: ['playlist'],
    data() {
        return {
            id1: 'JHyYOS61pO4',
            id2: 'dQw4w9WgXcQ',
            player1: null,
            player2: null,
            activePlayer: null,
            startTime: 0,
            fadeDuration: 10 //seconds
        }
    },
    created() {
        var that = this;
        EventBus.$on('playSong', videoId => {
            //find in playist
            var videoIdx = that.playlist.findIndex((item) => {
                return item.id.videoId === videoId;
            });
            debugger;
            console.log(this.player1)
            this.player1.loadVideoById(that.playlist[videoIdx].id.videoId);
            this.player1.setVolume(100);
            this.activePlayer = this.player1;
            this.startTime = performance.now();
        })
    },
    computed: {

    },
    watch: {

    },
    methods: {
        player1Ready(player) {
            this.player1 = player;
        },
        player2Ready(player) {
            this.player2 = player;
        },
        ended() {
            console.log('ended')
        },
        playing(player) {
            console.log('playing');
            var startFadeIn = player.getDuration() - this.fadeDuration;
            setTimeout(this.fade, startFadeIn * 1000);
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
        },
        startFade() {
            console.log('start fade');
            setTimeout(this.fade, 50)
        },
        fade() {
            // debugger;
            console.log(this.activePlayer.getVolume());
            var v = this.activePlayer.getVolume();
            v *= 0.95;
            if (v > 0.1) {
                this.player1.setVolume(v);
                setTimeout(this.fade, 50)
            } else {
                this.activePlayer.setVolume(0);
            }
        }
    }
}
</script>

