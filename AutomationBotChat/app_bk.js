var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {};
// port = process.env.PORT || 5000,
// ip = process.env.HOST || '192.168.35.44';
// ip = process.env.HOST || '11.11.254.69';

var port = process.env.PORT || 3000;
var ip = process.env.HOST || '0.0.0.0';

server.listen(port, ip, function() {
    console.log("Server is running on [" + ip + ":" + port + "]")
});
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    // res.sendfile(__dirname + '/txchat.html');
    console.log("Connected !")
});

io.sockets.on('connection', function(socket) {
    socket.on('new_user', function(name, data) {
        if (name in users) {
            data(false);
        } else {
            data(true);
            socket.nickname = name;
            users[socket.nickname] = socket;
            console.log('Add UserName : ' + name);
            updateNickNames();
        }

    });

    function updateNickNames() {
        io.sockets.emit('user_names', Object.keys(users));
    }
    socket.on('open_chatbox', function(data) {
        users[data].emit('openbox', { nick: socket.nickname });
    });
    socket.on('send_message', function(data, sendto) {
        users[sendto].emit('new_message', { msg: data, nick: socket.nickname, sendto: sendto });
        users[socket.nickname].emit('new_message', { msg: data, nick: socket.nickname, sendto: sendto });

        console.log(data);
    });
    socket.on('disconnect', function(data) {
        if (!socket.nickname) return;
        delete users[socket.nickname];
        updateNickNames();
    });
});