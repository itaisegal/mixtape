<template>
    <div class="container">
        <div class="main" v-show="!$store.state.station">
            <div class="top">
                <div class="wave"></div>
                <div class="logo"></div>
            </div>

            <div class="bottom">
                <div class="buttons">
                    <div class="btn" id="createStation" @click="createStation">
                        Create Station
                    </div>

                    <div class="btn" id="joinStation" @click="join">
                        Join Station
                        <input type="text" v-model="stationId" maxlength="4" spellcheck="false" id="idInput"></input>
                    </div>
                </div>
            </div>
            <div v-if="findingStation">
                finding station...
            </div>
            <div v-if="stationNotFound">
                station not found :(
            </div>
        </div>

        <station v-show="$store.state.station"></station>
    </div>
</template>

<script>
import Station from './Station';
import Search from './Search';
export default {
    name: 'main-view',
    components: {
        Station,
        Search
    },
    data() {
        return {
            stationId: '',
            stationNotFound: false,
            findingStation: false
        }
    },
    created() {
        console.log('main created');
        if (this.$route.params.stationId && this.$route.params.stationId.length === 4) {
            this.joinStation(this.$route.params.stationId.toUpperCase());
        }
    },

    mounted() {
        var that = this;
        document.getElementById('idInput').onkeypress = function (e) {
            // Enter pressed?
            if (e.which == 10 || e.which == 13) {
                that.join();
            }
        };
    },

    watch: {
        $route(to, from) {
            if (to.params.stationId) {
                this.joinStation(to.params.stationId.toUpperCase());
            } else {
                this.leaveStation();
            }
        }
    },

    computed: {
        station() {
            return this.$store.state.station;
        },
        isMainView() {
            if (this.$route.params.stationId) return false;
            else return true;
        },
        fingerprint() {
            return this.$store.state.fingerprint;
        },
        stationOpacity() {
            if (this.$store.state.station) return 1;
            else return 0.5;
        },
        mainOpacity() {
            if (!this.$store.state.station) return 1;
            else return 0.5;
        }
    },

    sockets: {
        setStation(station) {
            console.log('set station:' + station);
            if (!station) {
                console.log('station not found');
                this.$store.commit('setStation', null);
                this.findingStation = false;
                this.stationNotFound = true;
            } else {
                this.$store.commit('setStation', station);
                this.findingStation = false;
                this.stationNotFound = false;
            }
        },
        stationCreated(stationId) {
            this.$router.push('/' + stationId);
        }
    },

    methods: {
        createStation() {
            this.$socket.emit('newStation', this.$store.state.fingerprint)
        },
        join() {
            if (this.stationId.length === 4) {
                this.$router.push('/' + this.stationId);
            }
        },
        joinStation(stationId) {
            console.log('join station');
            this.$store.commit('setStation', null);
            this.stationNotFound = false;
            this.findingStation = true;
            this.$socket.emit('join', stationId, this.fingerprint);
        },
        leaveStation() {
            console.log('leave station');
            this.$store.commit('setStation', null);
            this.stationNotFound = false;
            this.findingStation = false;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
    height: 100%;
    min-height: 100vh;
    background: #00a2ff;
    background: linear-gradient(to bottom, #00a2ff 0%, #4acaff 100%);
    background-attachment: fixed;
    text-align: center;
}

.main {
    width: 100%;
}

.top {
    width: 100%;
    height: 35vh;
    position: relative;
    padding-top: 20px;
}

.wave {
    position: absolute;
    width: 100%;
    height: 100%;
    background-position-y: center;
    background-position-x: center;
    background-repeat: repeat-x;
    background-image: url('../../graphics/wave_big.png')
}

.logo {
    height: 90%;
    width: 100%;
    min-height: 40%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
    background-image: url('../../graphics/logo_big.png');
    position: absolute;
}

.bottom {
    /* border: 1px solid black;  */
    padding-top: 1%;
    width: 100%;
    position: relative;
}

.buttons {
    margin-left: auto;
    margin-right: auto;
    /* border: 1px solid black; */
}

.btn {
    cursor: pointer;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 330px;
    height: 80px;
    color: #23b5ff;
    background: #fff;
    line-height: 80px;
    font-family: 'pixelated';
    font-size: 40px;
    text-align: center;
    box-shadow: 0 4px #00a1f3;
}

.btn input {
    border-radius: 8px;
    width: 100px;
    height: 50%;
    font-size: 40px;
    overflow: hidden;
    text-align: justify;
    text-justify: inter-ideograph;
    letter-spacing: 3px;
    padding-left: 3%;
    font-family: 'pixelated';
    color: #23b5ff;
    text-transform: uppercase;
}



.station-container {
    width: 100%;
    max-width: 100vw;
    padding-top: 20px;
}
</style>
