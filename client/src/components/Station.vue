<template>
    <div>
        <div v-if="station">
            <h1>{{station.title}}</h1>
            <h1>{{station.id}}</h1>
        </div>
        <div v-if="!station && !stationNotFound">
            <h1>looking for station</h1>
        </div>
        <div v-if="stationNotFound">
            <h1>station not found :(</h1>
        </div>
    </div>
</template>

<script>

export default {
    name: 'station',
    data() {
        return {
            stationNotFound: false
        }
    },
    sockets: {
        setStation(station) {
            if (!station) {
                this.stationNotFound = true;
            }
            this.$store.commit('setStation', station)
        }
    },
    created() {
        if (!this.station) {
            const id = this.$route.params.stationId;
            this.$socket.emit('join', id)
        }
    },
    computed: {
        station() {
            return this.$store.state.station
        }
    }
}
</script>
