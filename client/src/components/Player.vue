<template>
    <div class="players">
        <div id="player1" class="player">
            <!-- <h2>player1</h2> -->
            <youtube :player-vars="{controls:0}" @ready="player1Ready" @playing="playing" @ended="ended" @paused="paused" @buffering="buffering" @qued="qued" @error="error">
            </youtube>
        </div>
        <div id="player2" class="player">
            <!-- <h2>player2</h2> -->
            <youtube :player-vars="{controls:0}" @ready="player2Ready" @playing="playing" @ended="ended" @paused="paused" @buffering="buffering" @qued="qued" @error="error">
            </youtube>
        </div>
    </div>
</template>

<script>
import { EventBus } from '../EventBus'

var playerState = {
    play: 1,
    pause: 2
}

export default {
    props: ['playlist'],
    data() {
        return {
            player1: null,
            player2: null,
            activePlayer: null,
            activePlayerDiv: null,
            shadowPlayer: null,
            shadowPlayerDiv: null,
            fadeStart: 5, //seconds before video finish to start the fade
            volumeFadeSpeed: 0.2, //inc in volume and opacity 
            opacityFadeSpeed: 0.002,
            playerState: playerState.play,
            volume: 100,
            activeVolume: 0,
            shadowVolume: 0,
            active: true
        }
    },
    beforeDestroy() {
        this.active = false;
    },
    mounted() {
        this.activePlayerDiv = document.getElementById('player2');
        this.activePlayerDiv.style.opacity = '1'
        this.activePlayerDiv.style.zIndex = 1;

        this.shadowPlayerDiv = document.getElementById('player1');
        this.shadowPlayerDiv.style.opacity = '1'
        this.shadowPlayerDiv.style.zIndex = 0;

        this.active = false;

        var that = this;
        EventBus.$on('playSong', videoId => {
            that.play(videoId);
        });
    },
    created() {

    },
    methods: {
        player2Ready(player) {
            this.player2 = player;
            this.activePlayer = this.player2;
            this.activePlayer.setVolume(0);

            if (this.player1) {
                this.active = true;
                this.checkState();
            }
        },
        player1Ready(player) {
            this.player1 = player;
            this.shadowPlayer = this.player1;
            this.shadowPlayer.setVolume(0);

            if (this.player2) {
                this.active = true;
                this.checkState();
            }
        },
        checkState() {
            if (this.playerState === playerState.play && this.active) {
                //inc active player volume
                if (this.activeVolume < this.volume) {
                    this.activeVolume += this.volumeFadeSpeed;
                    this.activePlayer.setVolume(Math.round(this.activeVolume));
                } else if (this.activeVolume > this.volume) {
                    this.activeVolume = this.volume;
                    this.activePlayer.setVolume(this.activeVolume);
                }

                //dec shadowPlayer volume
                if (this.shadowVolume > 0) {
                    this.shadowVolume -= this.volumeFadeSpeed;
                    if (this.shadowVolume < 0.3) {
                        this.shadowPlayer.pauseVideo();
                        this.shadowVolume = 0;
                    }
                    this.shadowPlayer.setVolume(Math.round(this.shadowVolume));
                }

                //inc both players opacity all the time
                var o = +getComputedStyle(this.shadowPlayerDiv).opacity;
                if (o < 1) {
                    this.shadowPlayerDiv.style.opacity = (o + this.opacityFadeSpeed).toString();
                }

                o = +getComputedStyle(this.activePlayerDiv).opacity;
                if (o < 1) {
                    this.activePlayerDiv.style.opacity = (o + this.opacityFadeSpeed).toString();
                }

                // console.log('shadow: ' + this.shadowPlayer.getVolume() + '   active: ' + this.activePlayer.getVolume());
                requestAnimationFrame(this.checkState);
            }
        },
        play(videoId) {
            debugger;
            this.shadowPlayer.loadVideoById(videoId);
            //this.shadowPlayerDiv.style.opacity = '0';
            this.updateStatus();
        },
        playing() {
            console.log('playing');
            this.switchPlayers();
            this.updateStatus();
        },
        getIndex(videoId) {
            return this.playlist.findIndex((item) => {
                return item.id.videoId === videoId;
            });
        },
        playNext() {
            //TODO:
            //check again because song might have been removed from the list
            if (this.playlist.length > this.currentVideoIdx + 1) {
                var videoId = this.playlist[this.currentVideoIdx + 1].id.videoId;
                EventBus.$emit('playSong', videoId);
            }
        },
        ended() {
            console.log('ended');
            this.updateStatus();
        },
        playing(player) {
            console.log('playing');
            this.switchPlayers();
            this.updateStatus();

        },
        paused() {
            console.log('paused');
            this.updateStatus();
        },
        buffering() {
            console.log('buffering');
            this.updateStatus();
        },
        qued() {
            console.log('qued')
        },
        error() {
            console.log('error');
            this.updateStatus();
        },

        updateStatus() {
            var status = {};
            if (this.player1.getVideoData())
                status[this.player1.getVideoData().video_id] = this.player1.getPlayerState();

            if (this.player2.getVideoData())
                status[this.player2.getVideoData().video_id] = this.player2.getPlayerState();

            this.$store.commit('updatePlayerStatus', status);
            // console.log('status: ' + status);
        },

        switchPlayers() {
            var p = this.activePlayer;
            this.activePlayer = this.shadowPlayer;
            this.shadowPlayer = p;

            p = this.activePlayerDiv;
            this.activePlayerDiv = this.shadowPlayerDiv;
            this.shadowPlayerDiv = p;

            var v = this.activeVolume;
            this.activeVolume = this.shadowVolume;
            this.shadowVolume = v;

            this.activePlayerDiv.style.zIndex = 1;
            this.shadowPlayerDiv.style.zIndex = 0;
        }
    }
}
</script>

<style scoped>
.player {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
}

.players {
    height: 390px;
    width: 640px;
    position: relative;
    margin-left: auto;
    margin-right: auto;
}

#player1>h2 {
    color: red
}
</style>