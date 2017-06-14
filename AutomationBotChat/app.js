var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {},
    admin = { 'admin01': '', 'admin02': '', 'admin03': '' };

var port = process.env.PORT || 3000;
var ip = process.env.HOST || '0.0.0.0';

const RequestPromise = require('request-promise');
var apiai = require('apiai');
var appAI = apiai("e58b167254d549a6bde597727c5a334b");
var AIMessage;
var AIData;

server.listen(port, ip, function() {
    console.log("Server is running on [" + ip + ":" + port + "]");
});
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    console.log("Connected !");
});

io.sockets.on('connection', function(socket) {
    socket.on('new_user', function(name, display_name, data) {
        if (name in users) {
            data(false);
        } else {
            data(true);
            socket.nickname = name;
            socket.status = "online";
            socket.display_name = display_name;
            if (name in admin) {
                socket.group = "server";
            } else {
                socket.group = "client";
            };
            // users[socket.nickname] = socket;
            users[socket.nickname] = socket;
            console.log('Add User ID: ' + socket.nickname + ', name: ' + display_name);
            updateNickNames();
        };
    });

    function updateNickNames() {
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
        io.sockets.emit('update_nick_name', result);
    };

    socket.on('send_message', function(data) {
        console.log(data.sendto, data.msg, data.sendfrom, data.time, data.opp, data.unread);
        console.log(data.sendto);
        // users[data.sendto].emit('new_message', { sendto: data.sendto, msg: data.msg, sendfrom: data.sendfrom, time: data.time, opp: data.opp, unread: data.unread });
        // users[data.sendfrom].emit('new_message', { sendto: data.sendto, msg: data.msg, sendfrom: data.sendfrom, time: data.time, opp: data.opp, unread: data.unread });
        socket.broadcast.to(data.sendto).emit('new_message', { sendto: data.sendto, msg: data.msg, sendfrom: data.sendfrom, time: data.time, opp: data.opp, unread: data.unread });
        // users[sendto].emit('new_message', 'ahihi');
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
};