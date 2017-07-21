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
            volume: 100,
            player1: null,
            player2: null,
            activePlayer: null,
            activePlayerDiv: null,
            shadowPlayer: null,
            shadowPlayerDiv: null,
            currentVideoIdx: null,
            fadeTimeout: null,
            fadeEndTime: null,
            fadeDuration: 5 //seconds
        }
    },
    created() {
        var that = this;
        EventBus.$on('playSong', videoId => {
            //find index in playist
            this.currentVideoIdx = that.playlist.findIndex((item) => {
                return item.id.videoId === videoId;
            });

            clearTimeout(this.fadeTimeout);
            this.activePlayer = this.player1;
            this.activePlayerDiv = document.getElementById('player1');
            this.shadowPlayer = this.player2;
            this.shadowPlayerDiv = document.getElementById('player2');

            this.activePlayer.loadVideoById(that.playlist[this.currentVideoIdx].id.videoId);
            this.activePlayer.setVolume(100);
            this.activePlayerDiv.style.opacity = '1.0'

            this.shadowPlayer.setVolume(0);
            this.shadowPlayerDiv.style.opacity = '0.0'
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
            if (this.playlist.length > this.currentVideoIdx + 1) {
                var startFadeOut = player.getDuration() - player.getCurrentTime() - this.fadeDuration;
                this.fadeTimeout = setTimeout(this.startFade, startFadeOut * 1000);
            }
        },
        paused() {
            console.log('paused');
            clearInterval(this.fadeTimeout);
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
            this.shadowPlayer.setVolume(0);
            this.shadowPlayer.loadVideoById(this.playlist[this.currentVideoIdx + 1].id.videoId);
            this.currentVideoIdx++;
            this.fadeEndTime = performance.now() + this.fadeDuration * 1000;
            requestAnimationFrame(this.fade);
        },
        fade(now) {
            if (now < this.fadeEndTime) {
                var m = (this.fadeEndTime - now) / (this.fadeDuration * 1000);

                this.activePlayer.setVolume(this.volume * m);
                this.activePlayerDiv.style.opacity = (m).toString();

                this.shadowPlayer.setVolume(this.volume * (1.0 - m));
                this.shadowPlayerDiv.style.opacity = (1 - m).toString();

                requestAnimationFrame(this.fade)
            } else {
                this.activePlayer.setVolume(0);
                this.shadowPlayerDiv.style.opacity = '0';

                this.shadowPlayer.setVolume(100);
                this.shadowPlayerDiv.style.opacity = '1';

                this.switchPlayers();
            }
        },

        switchPlayers() {
            var p = this.activePlayer;
            this.activePlayer = this.shadowPlayer;
            this.shadowPlayer = p;

            p = this.activePlayerDiv;
            this.activePlayerDiv = this.shadowPlayerDiv;
            this.shadowPlayerDiv = p;
        }
    }
}
</script>

<style scoped>

</style>