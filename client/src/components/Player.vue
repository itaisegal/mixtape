<template>
    <div class="players" id="players">
        <div id="player1-div" class="player">
            <youtube @ready="player1ready" @buffering="buffering" @playing="playing" @paused="paused" @ended="ended" @error="error"></youtube>
        </div>
        <div id="player2-div" class="player">
            <youtube @ready="player2ready" @buffering="buffering" @playing="playing" @paused="paused" @ended="ended" @error="error"></youtube>
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
    data() {
        return {
            player1: null,
            player2: null,
            activePlayer: null,
            activePlayerDiv: null,
            shadowPlayer: null,
            shadowPlayerDiv: null,
            fadeStart: 20, //seconds before video finish to start the fade
            volumeFadeSpeed: 0.2, //inc in volume and opacity 
            opacityFadeSpeed: 0.002,
            playerState: playerState.play,
            volume: 100,
            activeVolume: 0,
            shadowVolume: 0,
            active: true,
            currentVideoIdx: null,
            startingNext: false
        }
    },
    mounted() {
        console.log('player mounted');
        this.shadowPlayerDiv = document.getElementById('player1-div');
        this.shadowPlayerDiv.style.opacity = '1'
        this.shadowPlayerDiv.style.zIndex = 0;

        this.activePlayerDiv = document.getElementById('player2-div');
        this.activePlayerDiv.style.opacity = '1'
        this.activePlayerDiv.style.zIndex = 1;

        var that = this;
        EventBus.$on('playSong', idx => {
            that.play(idx);
        });

        EventBus.$on('stop', () => {
            that.stop();
        });
    },

    created() {
        console.log('player created');
    },

    beforeDestroy() {
        console.log('player before destroy');
        this.clearStatus();
    },

    destroyed() {
        console.log('player destroyed');
    },

    methods: {
        player2ready(player) {
            this.activePlayer = player;
            this.player2 = player;

            var iframe = player.getIframe();
            iframe.style.width = '100vw';
            iframe.style.maxWidth = '640px'
            var w = window.getComputedStyle(iframe).width;
            w = parseInt(w);
            if (w > 640) w = 640;

            var h = (w * 0.55).toString() + 'px';
            iframe.style.height = h;
            document.getElementById('players').style.height = h;

            if (this.shadowPlayer) {
                this.checkState();
            }
        },

        player1ready(player) {
            this.shadowPlayer = player;
            this.player1 = player;

            var iframe = player.getIframe();
            iframe.style.width = '100vw';
            iframe.style.maxWidth = '640px'
            var w = window.getComputedStyle(iframe).width;
            w = parseInt(w);
            if (w > 640) w = 640;

            var h = (w * 0.55).toString() + 'px';
            iframe.style.height = h;
            document.getElementById('players').style.height = h;

            if (this.activePlayer) {
                this.checkState();
            }
        },
        checkState() {
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
                if (this.shadowVolume < 2) {
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

            // console.log('check next song');
            // console.log('startingNext: ' + this.startingNext + '  ap state: ' + this.activePlayer.getPlayerState());
            // console.log('time left: ' + (this.activePlayer.getDuration() - this.activePlayer.getCurrentTime()).toString());

            if (!this.startingNext) {
                if (this.activePlayer.getPlayerState() == 1) {
                    if (this.activePlayer.getDuration() - this.activePlayer.getCurrentTime() < this.fadeStart) {
                        this.playNext();
                        this.startingNext = true;
                    }
                }
            }

            requestAnimationFrame(this.checkState);
        },
        play(videoIdx) {
            debugger;
            this.currentVideoIdx = videoIdx;
            var v = this.$store.state.station.playlist[videoIdx];
            this.shadowPlayer.loadVideoById(v.id.videoId);
            this.shadowPlayerDiv.style.opacity = '0';
            this.updateStatus();
        },
        stop() {
            this.player1.pauseVideo();
            this.player2.pauseVideo();
        },
        playNext() {
            debugger;
            var playlist = this.$store.state.station.playlist;
            if (playlist[this.currentVideoIdx + 1]) {
                this.play(this.currentVideoIdx + 1);
            } else {
                this.startingNext = false;
            }
        },
        ended() {
            console.log('ended');
            this.updateStatus();
        },
        playing(player) {
            console.log('playing');
            if (player != this.activePlayer)
                this.switchPlayers();
            this.updateStatus();
            this.startingNext = false;

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
        error(player) {
            console.log('error');
            // this.$store.commit('cantPlay', 'id');
            this.playNext();
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
}

.players {
    max-height: 390px;
    max-width: 640px;
    width: 100vw;
    position: relative;
}
</style>