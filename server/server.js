const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var utils = require('./utils');
var session = require('express-session');

var stations = {};

var clientIdStationsMap = {}

var settings = {
    // WAIT: 90000 //90 seconds wait before adding another song
    WAIT: 5000 //5 seconds wait before adding another song
}

var port = process.env.PORT || 3000;

app.use(express.static('public'))

function isIdTaken(id) {
    return stations[id] != null;
}

function getStationId() {
    var id = utils.generateId();
    while (isIdTaken(id)) {
        id = utils.generateId();
    }
    return id;
}

function openStation(creatorsFingerprint) {
    var id = getStationId()
    var station = {
        id,
        creatorsFingerprint,
        title: 'cool station sis',
        users: {
            [creatorsFingerprint]: {
                addedSongAt: 0
            }
        },
        playlist: []
    };

    stations[id] = station;
    return station;
}

function joinStation(id, fingerprint) {
    if (stations[id]) {
        if (!stations[id].users[fingerprint]) {
            stations[id].users[fingerprint] = {
                addedSongAt: 0
            }
        }

        return stations[id]
    } else {
        console.log('station not found')
        return null;
    }
}

function addToPlaylist(stationId, video, fingerprint) {

    if (!stations[stationId])
        return;

    var station = stations[stationId];

    if (!station.users[fingerprint])
        return;

    var user = station.users[fingerprint];
    var now = Date.now();
    if (now - user.addedSongAt > settings.WAIT) {
        user.addedSongAt = now;
        station.playlist.push(video);
        io.to(stationId).emit('setStation', station);
    } else {
        console.log('you need to wait ' + ((settings.WAIT - (now - user.addedSongAt)) / 1000).toString() + ' seconds');
    }
}

io.on('connection', function (socket) {
    console.log('a user connected from');

    // console.log(socket.client.request.headers.cookie)

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('newStation', function (fingerprint) {
        var station = openStation(fingerprint);
        socket.join(station.id);
        socket.emit('stationCreated', station.id);
    });

    socket.on('join', function (id, fingerprint) {
        station = joinStation(id, fingerprint);
        socket.join(id);
        socket.emit('setStation', station);
    });

    socket.on('addToPlaylist', function (stationId, videoId, fingerprint) {
        addToPlaylist(stationId, videoId, fingerprint);
    });

    socket.on('getTime', function (clientTime) {
        var serverTime = Date.now();
        socket.emit('setTime', { serverTime, clientTime });
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});