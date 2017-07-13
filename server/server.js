var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var utils = require('./utils');
var session = require('express-session');

var stations = {};

var clientIdStationsMap = {}

function isIdTaken(id) {
    return stations[id] != null;
}

function openStation(creatorsFingerprint) {
    var id = utils.generateId();
    while (isIdTaken(id)) {
        id = utils.generateId();
    }

    var station = { id, creatorsFingerprint, title: 'cool station sis', users: { [creatorsFingerprint]: { x: 0 } } };
    stations[id] = station;
    return station;
}

function joinStation(id, fingerprint) {
    console.log(`joining station id ${id} with fingerprint ${fingerprint}`)
    if (stations[id]) {
        console.log('stations[id] exists')
        console.log(stations[id]);
        console.log('stations[id].users')
        console.log(stations[id].users)
        console.log('stations[id].users[fingerprint]')
        console.log(stations[id].users[fingerprint])
        if (!stations[id].users[fingerprint]) {
            console.log('yes')
            stations[id].users[fingerprint] = {}
        }
        console.log(stations[id].users[fingerprint]);

        console.log(stations[id]);
        return stations[id]
    } else {
        return null;
    }
}

// send a message to the station
// setInterval(() => {
//     io.emit('msg', 'hello all');
//     for (var id in stations) {
//         io.to(id).emit('msg', 'hello station:' + id)
//     }
// }, 3500);

io.on('connection', function (socket) {
    console.log('a user connected from');

    // console.log(socket.client.request.headers.cookie)

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('newStation', function (fingerprint) {
        var station = openStation(fingerprint);
        socket.join(station.id);
        socket.emit('setStation', station);
    });

    socket.on('join', function (id, fingerprint) {
        station = joinStation(id, fingerprint);
        socket.join(id);
        socket.emit('setStation', station);
    })
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});