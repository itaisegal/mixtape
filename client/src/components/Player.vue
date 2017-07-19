<template>
    <div id="players">
        <div id="player1">
            <youtube :video-id="id1" :player-vars="{controls:0}" @ready="player1Ready" @change="change" @playing="playing" @ended="ended" @paused="paused" @buffering="buffering" @qued="qued" @error="error">
            </youtube>
        </div>
        <div id="player2">
            <youtube :video-id="id2" :player-vars="{controls:0}" @ready="player2Ready" @change="change" @playing="playing" @ended="ended" @paused="paused" @buffering="buffering" @qued="qued" @error="error">
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
            shadowPlayer: null,
            currentVideoIdx: null,
            fadeDuration: 10 //seconds
        }
    },
    created() {
        var that = this;
        EventBus.$on('playSong', videoId => {
            //find in playist
            this.currentVideoIdx = that.playlist.findIndex((item) => {
                return item.id.videoId === videoId;
            });
            this.player1.loadVideoById(that.playlist[this.currentVideoIdx].id.videoId);
            this.player1.setVolume(100);
            this.activePlayer = this.player1;
            this.shadowPlayer = this.player2;
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
            var startFadeOut = player.getDuration() - this.fadeDuration;
            setTimeout(this.startFade, startFadeOut * 1000);
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
            if (this.playlist.length > this.currentVideoIdx + 1) {
                setTimeout(this.fade, 50);
                this.shadowPlayer.setVolume(0);
                this.shadowPlayer.loadVideoById(this.playlist[this.currentVideoIdx + 1].id.videoId);
            }
        },
        fade() {
            var v = this.activePlayer.getVolume();
            v *= 0.95;
            if (v > 2) {
                console.log(100 - v);
                this.activePlayer.setVolume(v);
                this.shadowPlayer.setVolume(100 - v);
                setTimeout(this.fade, 50)
            } else {
                this.activePlayer.setVolume(0);
                this.shadowPlayer.setVolume(100);
                this.switchPlayers();
                this.currentVideoIdx++;
            }
        },

        switchPlayers() {
            var p = this.activePlayer;
            this.activePlayer = this.shadowPlayer;
            this.shadowPlayer = p;
        }
    }
}
</script>

