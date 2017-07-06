var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Station = require('./Station');
var utils = require('./utils');

var MongoClient = require('mongodb').MongoClient;

var stations = [];

// Connect to the db
// MongoClient.connect("mongodb://localhost:27017/mixtapeDB", function (err, db) {
//     if (!err) {
//         console.log("We are connected");
//         db.createCollection('test', function (err, collection) { });
//     }
// });

function isIdTaken(id) {
    return stations.find(function(station) {
        return (id === station.getId())
    })
}

function openStation() {
    var stationId = utils.generateId();
    while (isIdTaken(stationId)) {
        console.log('taken');
        stationId = utils.generateId();
    }
    var station = new Station(stationId);
    stations.push(station);
}

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    // socket.on('newStation', function)
});

openStation();

http.listen(3000, function () {
    console.log('listening on *:3000');
});