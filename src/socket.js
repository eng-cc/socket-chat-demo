    // add user
    var addNewUser = function() {

    }

    var runSocket = function() {
        // window.socket = io.connect('http://115.28.30.14:8080/')
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
