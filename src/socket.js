    // add user
    var addNewUser = function() {

    }

    var runSocket = function() {
        window.socket = io.connect('localhost:8088')

    }
    var ioMsg = function() {
        socket.on('news', function(data) {
            console.log(data)
        })
    }

// var emit = socket.emit

    // var socketEvents = function() {
    //     socket.on('newone', function(data) {
    //         console.log(data)
    //     })
    // }

    export default {
        runSocket
    }
