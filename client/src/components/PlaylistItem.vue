<template>
    <div class="main" @click="$emit('playSong', idx)">

        <div class="thumbnail" :style="{ 'background-image' : 'url(' + item.snippet.thumbnails.default.url + ')' }"></div>
        <!-- -1 – unstarted
                                        0 – ended
                                        1 – playing
                                        2 – paused
                                        3 – buffering
                                        5 – video cued -->
        <div class="status-container">
            <div class="status" v-if="$store.state.playerStatus!= null && 
                                        $store.state.playerStatus[item.id.videoId] != null">
                <div class="spinner" v-if="$store.state.playerStatus[item.id.videoId] === 3">
                    <div class="bounce1"></div>
                    <div class="bounce2"></div>
                    <div class="bounce3"></div>
                </div>
                <div class="play" v-else-if="$store.state.playerStatus[item.id.videoId] === 1"></div>
                <div class="play-grey" v-else></div>
                <!-- </div>
                                    <div class="error" v-else></div>  -->
            </div>
            <div class="status" v-else>
                <div class="play-grey"></div>
            </div>
        </div>
        <div class="title">{{item.snippet.title}}</div>
    </div>
</template>

<script>
export default {
    name: 'PlaylistItem',
    props: ['item', 'idx']
}
</script>

<style scoped>
.main {
    margin-top: 1%;
    width: 100%;
    height: 72px;
    background: white;
    border-radius: 3px;
    overflow: hidden;
    cursor: pointer;
}

.thumbnail {
    float: left;
    height: 100%;
    width: 15%;
    background-size: cover;
    background-position: center;
}

.title {
    padding-left: 2%;
    font-family: 'pixelated';
    font-size: 26px;
    text-align: left;
    text-overflow: clip;
    overflow: hidden;
}

.status-container {
    width: 70px;
    height: 100%;
    float: right;
}

.status {
    height: 100%;
    width: 100%;
}

.play {
    width: 100%;
    height: 100%;
    background-image: url('../../graphics/play.png');
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
}

.play-grey {
    width: 100%;
    height: 100%;
    background-image: url('../../graphics/play_grey.png');
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
}

.error {
    width: 100%;
    height: 100%;
    background-image: url('../../graphics/error.png');
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
}

.spinner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.spinner>div {
    margin-right: 7%;
    width: 18%;
    height: 20%;
    background-color: #777;

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
}

.spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
}

@media (max-width: 720px) {
    .main {
        border-radius: 0px;
        height: 60px;
    }

    .title {
        font-size: 22px;
        margin-left: 1%;
    }
}

@-webkit-keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
        -webkit-transform: scale(0)
    }
    40% {
        -webkit-transform: scale(1.0)
    }
}

@keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    40% {
        -webkit-transform: scale(1.0);
        transform: scale(1.0);
    }
}
</style>