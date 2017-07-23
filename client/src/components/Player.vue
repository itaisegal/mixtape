<template>
    <div class="players">
        <div id="player1" class="player">
            <h2>player 1</h2>
            <youtube :video-id="id1" :player-vars="{controls:0}" @ready="player1Ready" @change="change" @playing="playing" @ended="ended" @paused="paused" @buffering="buffering" @qued="qued" @error="error">
            </youtube>
        </div>
        <div id="player2" class="player">
            <h2>player 2</h2>
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
            nextSongTimeout: null,
            fadeEndTime: null,
            fadeDuration: 5, //seconds
            avgBufferingTime: 15 //seconds
        }
    },
    mounted() {
        this.activePlayerDiv = document.getElementById('player1');
        this.activePlayerDiv.style.opacity = '1.0'
        this.activePlayerDiv.style.zIndex = 0;

        this.shadowPlayerDiv = document.getElementById('player2');
        this.shadowPlayerDiv.style.opacity = '0.0'
        this.shadowPlayerDiv.style.zIndex = 1;
    },
    created() {
        var that = this;
        EventBus.$on('playSong', videoId => {

            clearTimeout(this.nextSongTimeout);

            //find index in playist
            this.currentVideoIdx = that.playlist.findIndex((item) => {
                return item.id.videoId === videoId;
            });

            this.shadowPlayer.loadVideoById(that.playlist[this.currentVideoIdx].id.videoId);
        })
    },
    computed: {

    },
    watch: {

    },
    methods: {
        player1Ready(player) {
            this.player1 = player;
            this.activePlayer = this.player1;
            this.activePlayer.setVolume(1);
        },
        player2Ready(player) {
            this.player2 = player;
            this.shadowPlayer = this.player2;
            this.shadowPlayer.setVolume(0);

        },
        playNext() {
            //check again because song might have been removed from the list
            if (this.playlist.length > this.currentVideoIdx + 1) {
                var videoId = this.playlist[this.currentVideoIdx + 1].id.videoId;
                EventBus.$emit('playSong', videoId);
            }
        },
        ended() {
            console.log('ended')
        },
        playing(player) {
            console.log('playing');
            if (player === this.shadowPlayer) {
                this.startFade();
            }
            if (this.playlist.length > this.currentVideoIdx + 1) {
                var startNextSongAt = player.getDuration() - player.getCurrentTime() - this.fadeDuration - this.avgBufferingTime;
                console.log('next song starts in: ', startNextSongAt);
                this.nextSongTimeout = setTimeout(this.playNext, startNextSongAt * 1000);
            }
        },
        paused() {
            console.log('paused');
            clearInterval(this.fadeTimeout);
        },
        buffering() {
            console.log('buffering');
            clearInterval(this.fadeTimeout);
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
            this.fadeEndTime = performance.now() + this.fadeDuration * 1000;
            requestAnimationFrame(this.fade);
        },
        fade(now) {
            if (now < this.fadeEndTime) {
                var m = 1 - ((this.fadeEndTime - now) / (this.fadeDuration * 1000)); //value from 0 to 1 over fade duration
                this.activePlayer.setVolume(this.volume * (1.0 - m));
                this.shadowPlayer.setVolume(this.volume * m);
                this.shadowPlayerDiv.style.opacity = (m).toString();
                requestAnimationFrame(this.fade)
            } else {
                this.activePlayer.setVolume(0);
                this.shadowPlayer.setVolume(100);
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

            this.activePlayerDiv.style.zIndex = 0;
            this.activePlayerDiv.style.opacity = '1';

            this.shadowPlayerDiv.style.zIndex = 1;
            this.shadowPlayerDiv.style.opacity = '0';
        }
    }
}
</script>

<style scoped>
.player {
    position: absolute;
    display: block;
    width: 640px;
    height: 480px;
}

.players {
    position: relative;
    margin-left: auto;
    margin-right: auto;
}

#player1>h2 {
    color: red
}
</style>