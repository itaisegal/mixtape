'use strict'

function Station(id) {
    this.id = id;
}

Station.prototype.getId = function () {
    return this.id;
}

module.exports = Station;