var cloudTopic = require("./lib/cloudTalk");
var cloudData = require("./lib/cloudData");
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {},
    nodemailer = require("nodemailer");
session_topic = {};
var user_list = {};
user_data = {};
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
// app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    console.log('Login user');
});

app.get('/admin', function(req, res) {
    console.log('Login admin')
    res.sendFile(__dirname + '/public/admin.html');
});

app.get('/mailform', function(req, res) {
    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: 'taas.dc2a.tma@outlook.com',
            pass: 'taas12345678x@X'
        }
    });

    // setup e-mail data, even with unicode symbols
    var mailOptions = {
        from: '"TA-TaaS Team" <taas.dc2a.tma@outlook.com>', // sender address (who sends)
        to: 'dnnvu@tma.com.vn', // list of receivers (who receives)
        subject: 'Test mail', // Subject line
        text: 'Hello', // plaintext body
        html: '<b>I\'m just testing with send email form web</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }

        console.log('Message sent: ' + info.response);
        transporter.close();
    });
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

    // Process for BOT if getting command from topic
    socket.on('send_message_bot', function(data, sendto) {
        var sessionID = users[socket.nickname].id;
        if ("" + user_list[sessionID] == 'undefined') {
            var tmp = {};
            user_list[sessionID] = tmp;
        }
        console.log("OBJECT: " + user_list[sessionID]);
        if (typeof user_data[sessionID] !== 'undefined' && user_data[sessionID] !== null) {
            var nextMessage = user_data[sessionID];
            user_list[sessionID][user_data[sessionID]] = data;
            console.log("Here is the data for " + user_data[sessionID] + ':' + user_list[sessionID][user_data[sessionID]]);
            console.log("Here is object Keys: " + Object.keys(user_list[sessionID]));
            user_data[sessionID] = null;
            //New Code
            selectTopic(users[socket.nickname].id, nextMessage, function(sessionID) {
                getTopic(sessionID, function() {
                    if (session_topic[sessionID] == "Cloud") {
                        createMessage(cloudTopic.cloudTopic(nextMessage, user_list[sessionID]), sessionID, function(message) {
                            users[socket.nickname].emit('new_message', { msg: message, nick: 'BOT', sendto: sendto });
                            //log
                            console.log("Here log: " + user_data[sessionID]);
                        })
                    }
                })
            });
        } else {
            selectTopic(users[socket.nickname].id, data, function(sessionID) {
                getTopic(sessionID, function() {
                    if (session_topic[sessionID] == "Cloud") {
                        createMessage(cloudTopic.cloudTopic(data, user_list[sessionID]), sessionID, function(message) {
                            users[socket.nickname].emit('new_message', { msg: message, nick: 'BOT', sendto: sendto });
                            //log
                            console.log("Here log: " + user_data[sessionID]);
                        })
                    }
                })
            });
            console.log("REC MESSAGE FROM: " + socket.nickname);
            if (data.indexOf("what is my topic?") != -1) {
                console.log("Current topic of " + socket.nickname + " is: " + session_topic[users[socket.nickname].id]);
                users[socket.nickname].emit('new_message', { msg: session_topic[users[socket.nickname].id], nick: 'BOT', sendto: sendto });
            } else {
                contactToAIAPI(data, function() {
                    if (AIData.result.action == "smalltalk.greetings.hello") {
                        users[socket.nickname].emit('new_message', { msg: AIMessage + " " + socket.nickname + "! What do you want to talk? " + "<button class = \"button5\" type=\"button\" name = \"res_button\" onclick=\"clickOnRes(this.innerHTML);this.disabled=true;\">Automation</button>" + " " + "<button class = \"button5\" type=\"button\" name = \"res_button_1\" onclick=\"clickOnRes(this.innerHTML)\">Cloud</button>", nick: 'BOT', sendto: sendto });
                    }
                    //else users[socket.nickname].emit('new_message',{msg: AIMessage, nick: 'BOT', sendto: sendto});
                });
            }
        }

    });

    socket.on('disconnect', function(data) {
        if (!socket.nickname) return;
        delete users[socket.nickname];
        updateNickNames();
    });
});

//contact to API AI
function contactToAIAPI(messageAI, cb) {
    var ai_res_message = null;
    var request = appAI.textRequest(messageAI, {
        sessionId: '12345676111'
    });

    request.on('response', function(response) {
        //console.log(response);
        AIData = response;
        ai_res_message = response.result.fulfillment.speech;
        //ai_res_message = response.syscall;
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

// assign the topic for user
function selectTopic(sessionID, message, cb) {
    if (message == "Automation") session_topic[sessionID] = "Automation";
    if (message == "Cloud") session_topic[sessionID] = "Cloud";
    cb(sessionID);
}

// get the topic of user
function getTopic(sessionID, cb) {
    var topic = session_topic[sessionID];
    cb();
}

// create message
function createMessage(buttonName, sessionID, cb) {
    var command = buttonName.command;
    user_data[sessionID] = command;
    var promButton = "";
    if (buttonName.buttonName != "NA") {
        for (var i = 0; i < handleButton(buttonName).length; i++) {
            console.log("Button Name : " + handleButton(buttonName)[i]);
            promButton = promButton + "<button class = \"button5\" type=\"button\" name = \"res_button\" onclick=\"clickOnRes(this.innerHTML)\">" + handleButton(buttonName)[i] + "</button>";
        }
    } else promButton = buttonName.message;

    cb(promButton);
}

// handle button
function handleButton(buttonName) {
    if (buttonName.buttonName != "NA") return buttonName.buttonName.split(" andButton ");
    else return "NA";
}