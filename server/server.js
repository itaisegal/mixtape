var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var utils = require('./utils');

// var MongoClient = require('mongodb').MongoClient;

var stations = {};

function isIdTaken(id) {
    return stations[id] != null;
}

function openStation() {
    var id = utils.generateId();
    while (isIdTaken(id)) {
        id = utils.generateId();
    }

    var station = { id, title: 'cool station sis' }
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

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('newStation', function () {
        console.log('new station')
        var s = openStation();
        socket.emit('setStation', s);
        console.log(stations)
    });

    socket.on('join', function (id) {
        s = joinStation(id);
        socket.emit('setStation', s);
    })
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});