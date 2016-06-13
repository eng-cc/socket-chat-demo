    // add user
    var addNewUser = function() {

    }

    var runSocket = function() {
        // window.socket = io.connect('http://127.0.0.1:8088/')
        window.socket = io.connect('/')

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
