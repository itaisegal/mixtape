<template>
    <div class="main">
        <div class="top">
            <div class="wave"></div>
            <div class="logo"></div>
        </div>
    
        <div class="bottom">
            <div class="buttons">
                <div class="btn" id="createStation" @click="createStation">
                    Create Station
                </div>
    
                <div class="btn" id="joinStation" @click="joinStation">
                    Join Station
                    <input type="text" v-model="stationId" maxlength="4" spellcheck="false"></input>
                </div>
    
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'hello',
    data() {
        return {
            stationId: ''
        }
    },
    sockets: {
        setStation(station) {
            this.$store.commit('setStation', station)
            this.$router.push('/' + station.id)
        },
        stationNotFound() {
            console.log('station not found')
        }
    },
    methods: {
        createStation() {
            this.$socket.emit('newStation', this.$store.state.fingerprint)
        },
        joinStation() {
            if (this.stationId.length === 4)
                this.$router.push('/' + this.stationId);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
    min-width: 300px;
    width: 100%;
    height: 100vh;
    background: #00a2ff;
    background: linear-gradient(to bottom, #00a2ff 0%, #4acaff 100%);
    background-attachment: fixed;
}

.top {
    width: 100%;
    min-height: 400px;
    /* border: 1px solid black; */
}

.wave {
    position: absolute;
    width: 100%;
    height: 228px;
    max-height: 30%;
    min-height:25%;
    margin-top: 15%;
    background-position-y: center;
    background-position-x: center;
    background-repeat: repeat-x;
    background-size: contain;
    background-image: url('../../graphics/wave_big.png')
}

.logo {
    margin-top: 75px;
    width: 100%;
    height: 560px;
    max-height: 50%;
    min-height:40%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
    background-image: url('../../graphics/logo_big.png');
    position: absolute;
}

.bottom {
    /* border: 1px solid black; */
    width: 100%;
    padding-top: 26px;
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

input:focus {
    outline: none;
    pointer-events: none;
}
</style>
