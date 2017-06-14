var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {},
    admin = { 'admin01': '', 'admin02': '', 'admin03': '' };
// port = process.env.PORT || 5000,
// ip = process.env.HOST || '192.168.35.44';
// ip = process.env.HOST || '11.11.254.69';

var port = process.env.PORT || 3000;
var ip = process.env.HOST || '0.0.0.0';

const RequestPromise = require('request-promise');
var apiai = require('apiai');
var appAI = apiai("e58b167254d549a6bde597727c5a334b");
var AIMessage;
var AIData;

server.listen(port, ip, function() {
    console.log("Server is running on [" + ip + ":" + port + "]")
});
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    // res.sendfile(__dirname + '/txchat.html');
    console.log("Connected !")
});

io.sockets.on('connection', function(socket) {
    socket.on('new_user', function(name, display_name, data) {
        if (name in users) {
            data(false);
        } else {
            data(true);
            socket.nickname = name;
            socket.status = 'online';
            socket.display_name = display_name;
            if (name in admin) {
                socket.group = 'server';
            } else {
                socket.group = 'client';
            };
            users[socket.nickname] = socket;
            console.log('Add User : ' + name + ', ' + display_name);
            console.log('User : ' + users);
            updateNickNames(socket.nickname, socket.display_name, socket.group, socket.status);
        }

    });

    function updateNickNames(name, display_name, group, status) {
        // console.log('update_nick_name :' + name + ', ' + display_name + ', ' + group + ', ' + status);
        var result = {};
        for (item in users) {
            var nickname = users[item]['nickname'];
            var display_name = users[item]['display_name'];
            var group = users[item]['group'];
            var status = users[item]['status'];
            result[item] = {
                'nickname': nickname,
                'display_name': display_name,
                'group': group,
                'status': status
            };
        };
        // console.log(result);
        io.sockets.emit('update_nick_name', result);
    };
    socket.on('open_chatbox', function(data) {
        users[data].emit('openbox', { nick: socket.nickname });
    });

    socket.on('send_message', function(sendto, message, sendfrom, time, opponent, unread) {
        console.log(sendto, message, sendfrom, time, opponent, unread);
        console.log(users[sendto]);
        users[sendto].emit('new_message', { sendto: sendto, msg: message, sendfrom: sendfrom, time: time, opp: opponent, undread: unread });
        // users[socket.nickname].emit('new_message', { sendto: sendto, msg: message, sendfrom: sendfrom, time: time, opp: opponent, undread: unread });
    });

    socket.on('send_message_bot', function(data, sendto) {
        console.log(data);
        contactToAIAPI(data, function() {
            if (AIData.result.action == "smalltalk.greetings.hello") {
                users[socket.nickname].emit('new_message', { msg: AIMessage + " " + socket.nickname, nick: 'BOT', sendto: sendto });
            } else users[socket.nickname].emit('new_message', { msg: AIMessage, nick: 'BOT', sendto: sendto });
        });
    });

    socket.on('disconnect', function(data) {
        if (!socket.nickname) return;
        socket.status = "disconnect";
        console.log(socket.nickname + ' disconenct');
        updateNickNames(socket.nickname, socket.display_name, socket.group, socket.status);
        delete users[socket.nickname];
    });
});

//contact to API AI
function contactToAIAPI(messageAI, cb) {
    var ai_res_message = null;
    var request = appAI.textRequest(messageAI, {
        sessionId: '12345676890'
    });

    request.on('response', function(response) {
        console.log(response);
        AIData = response;
        ai_res_message = response.result.fulfillment.speech;
        console.log(ai_res_message);
        AIMessage = ai_res_message;
        cb(ai_res_message);
        console.log("Message tmp input: " + AIMessage);
    });
    request.on('error', function(error) {
        console.log(error);
    });
    request.end();
}