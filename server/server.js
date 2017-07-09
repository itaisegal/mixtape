var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var utils = require('./utils');

var stations = {};

var clientsIpAndStationMap = {}

function isIdTaken(id) {
    return stations[id] != null;
}

function openStation(creator) {
    var id = utils.generateId();
    while (isIdTaken(id)) {
        id = utils.generateId();
    }

    var station = { id, creator, title: 'cool station sis' }
    stations[id] = station;
    return station;
}

function joinStation(id) {
    if (stations[id]) {
        return stations[id]
    } else {
        return null;
    }
}

// send a message to the station
// setInterval(() => {
//     for (var id in stations) {
//         io.to(id).emit('msg', 'hello station:' + id)
//         io.emit('msg', 'hello all');
//     }
// }, 3500);

io.on('connection', function (socket) {
    console.log('a user connected from');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('newStation', function () {
        console.log('new station')
        var s = openStation(socket.id);
        socket.join(s.id);
        socket.emit('setStation', s);
        console.log(stations)
    });

    socket.on('join', function (id) {
        s = joinStation(id);
        socket.join(id);
        socket.emit('setStation', s);
    })
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});