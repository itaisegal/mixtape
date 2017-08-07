<template>
    <div class="players">
        <div id="player1-div" class="player">
            <!-- <h2>player1</h2>  -->
            <div id="player1"></div>
        </div>
        <div id="player2-div" class="player">
            <!-- <h2>player2</h2>  -->
            <div id="player2"></div>
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
    mounted() {
        console.log('mounted');
        this.shadowPlayerDiv = document.getElementById('player1-div');
        this.shadowPlayerDiv.style.opacity = '1'
        this.shadowPlayerDiv.style.zIndex = 0;

        this.activePlayerDiv = document.getElementById('player2-div');
        this.activePlayerDiv.style.opacity = '1'
        this.activePlayerDiv.style.zIndex = 1;

        this.active = false;

        var that = this;
        EventBus.$on('playSong', videoId => {
            that.play(videoId);
        });

        if (!window.YT) {
            debugger;
            window.onYouTubeIframeAPIReady = this.YTApiReady;
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            debugger;
            this.YTApiReady();
        }
    },

    created() {
        console.log('created');
    },

    beforeDestroy() {
        console.log('before destroy');
        this.player1.destroy();
        this.player2.destroy();
        this.active = false;
        this.clearStatus();
    },
    methods: {
        YTApiReady() {
            console.log('ytapi ready');
            this.player1 = new YT.Player('player1', {
                height: '390',
                width: '640',
                videoId: 'M7lc1UVf-VE',
                volume: 0,
                events: {
                    'onReady': this.player1Ready,
                    'onStateChange': this.stateChanged
                }
            });

            this.player2 = new YT.Player('player2', {
                height: '390',
                width: '640',
                volume: 0,
                videoId: 'M7lc1UVf-VE',
                events: {
                    'onReady': this.player2Ready,
                    'onStateChange': this.stateChanged
                }
            });
        },
        player2Ready(player) {
            this.activePlayer = player.target;

            if (this.shadowPlayer) {
                this.active = true;
                this.checkState();
            }
        },

        player1Ready(player) {
            this.shadowPlayer = player.target;

            if (this.activePlayer) {
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
        stateChanged(state) {
            console.log(state);
            switch (state.data) {
                case
                    YT.PlayerState.PLAYING:
                    this.playing();
                    break;

                case
                    YT.PlayerState.ENDED:
                    this.ended();
                    break;

                case
                    YT.PlayerState.BUFFERING:
                    this.buffering();
                    break;

                case
                    YT.PlayerState.PAUSED:
                    this.paused();
                    break;
            }
        },
        play(videoId) {
            debugger;
            this.shadowPlayer.loadVideoById(videoId);
            this.shadowPlayerDiv.style.opacity = '0';
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

        clearStatus() {
            this.$store.commit('updatePlayerStatus', {});
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

#player1-div>h2 {
    color: red
}
</style>