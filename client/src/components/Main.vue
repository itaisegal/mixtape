<template>
    <div class="hello">
        <button id="createStation" @click="createStation">Create Station</button>
        <button id="joinStation" @click="joinStation">Join Station</button>
        <input type="text" v-model="stationId"></input>
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
h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
