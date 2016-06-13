var express = require('express')
var app = new express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var path = require('path')

app.use(express.static(path.join(__dirname, '')))

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html')
})
var onlineUsers = {};
var allUser = 0;

io.on('connection', function(socket) {
    console.log('in+++++++++')
    allUser += 1
    io.emit('changeuser', { allUser: allUser })
    socket.on('disconnect', function() {
        allUser -= 1
        io.emit('changeuser', { allUser: allUser })
        console.log('user is disconnected')
    });
    socket.on('username', function(data) {
        //检查在线列表，如果不在里面就加入
        if (!onlineUsers.hasOwnProperty(data.id)) {
            onlineUsers[data.id] = data.username;
        }
        console.log(data)
        socket.name = data.username
        io.emit('newuser', data)
        console.log('newuser+++++++++')
    })
    socket.on('new_msg', function(data) {
        console.log(data)
        io.emit('newmsg', data)
        console.log('newMsg+++++++++')
    })
    socket.on('admin_quiet', function(data) {
        console.log(data)
        io.emit('admin_quiet', data)
        console.log('admin_quiet+++++++++')
    })
    socket.on('admin_speak', function(data) {
        console.log(data)
        io.emit('admin_speak', data)
        console.log('admin_speak+++++++++')
    })
})


server.listen(8080)
