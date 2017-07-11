var config = require('./config')();
var cloudTopic = require("./lib/cloudTalk");
var cloudSmart = require("./lib/cloudTalkSmart");
var ipaddr = require("ip");
var express = require('express'),
    bodyParser = require('body-parser'),
    mysql = require('mysql'),
    fs = require('fs'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {},
    nodemailer = require("nodemailer"),
    session_topic = {},
    user_list = {},
    user_data = {};
// port = process.env.PORT || 5000,
// ip = process.env.HOST || '192.168.35.44';
// ip = process.env.HOST || '11.11.254.69';

var port = process.env.PORT || 3000;
var ip = process.env.HOST || '0.0.0.0' || ipaddr.address();

var port = config.port;
var ip = config.ip;

const RequestPromise = require('request-promise');
var apiai = require('apiai');
var appAI = apiai("e58b167254d549a6bde597727c5a334b");
var AIMessage;
var AIData;

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

server.listen(port, ip, function() {
    console.log("Server is running on [" + ip + ":" + port + "]")
});
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    console.log('User connected !')
});

app.get('/admin', function(req, res) {
    console.log('Connected !')
    res.sendfile(__dirname + '/public/admin.html');
});

app.get('/sendmail', function(req, res) {
    var mailOptions = {
        from: '"TA-TaaS Team" <taas.dc2a.tma@outlook.com>',
        to: 'dnnvu@tma.com.vn',
        subject: req.query.subject,
        text: req.query.text,
        html: "<style>th{text-align: left;}</style><table border=0><tr><th>User Name : </th><td>" + req.query.name + "</td></tr><tr><th>Email : </th><td>" + req.query.from + "</td></tr><tr><th>Content : </th><td>" + req.query.text + "</td></tr></table>"
    }
    transporter.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log(response)
            console.log("Message sent: " + response.response);
            var status = 200;
            res.send('sent');
            res.end();
        }
    });
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdata'
});

// fs.readFile(__dirname + '/public/tracking/index.html', function(err, data) {
//     if (err) {
//         throw err;
//     }
//     app.get('/cloud/register/dm', function(req, res) {
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.write(data);
//         res.end();
//     });
// });

app.get('/cloud/register', function(req, res) {
    console.log('Connected !')
    res.sendfile(__dirname + '/public/tracking/index.html');
});

app.get('/cloud/ticketId/:full_name', function(req, res) {
    console.log("FULL NAME: " + req.params.full_name );
    conn.query('SELECT id FROM user_data WHERE full_name = "' + req.params.full_name + '"', function(error, data) {
        console.log("RESPONSE: " + data);
        conn.query('SELECT id FROM detail_quota WHERE user_id = "' + data[0].id + '"', function(error, data) {
            console.log("RESPONSE: " + data[0].id);
            res(data);
            res.end;
        });
    });
});

app.post('/cloud/register', function(req, res) {
    conn.query("INSERT INTO project (id, project_name, is_del) VALUES (NULL, '" + req.body.project + "', '0')", function() {
        conn.query('SELECT id FROM project WHERE project_name = "' + req.body.project + '"', function(error, data) {
            conn.query("INSERT INTO user_data (id, full_name, badge_id, mail, phone, project_id, pm_mail, is_del) VALUES (NULL, '" + req.body.full_name + "', '" + req.body.bage_id + "', '" + req.body.email + "', '" + req.body.phone + "', '" + data[0].id + "', '" + req.body.pm_email + " ', '0')", function(error, data) {
                conn.query("SELECT id, project_id FROM user_data WHERE badge_id = '" + req.body.bage_id + "'", function(error, data) {
                    console.log(data);
                    console.log("                ");
                    var tmp1 = data[0].project_id;
                    var tmp2 = data[0].id;
                    var quota = [7, 1, 1, 512, 80];
                    if (req.body.quota != 'default') {
                        quota[0] = req.body.life_time;
                        quota[1] = req.body.instance;
                        quota[2] = req.body.cpu;
                        quota[3] = req.body.ram;
                        quota[4] = req.body.hdd;
                    }
                    conn.query("INSERT INTO detail_quota (id, project_id, life_time, instance, cpu, hdd, ram, user_id, status_id, note) VALUES (NULL, '" + data[0].project_id + "', '" + quota[0] + "', '" + quota[1] + "', '" + quota[2] + "', '" + quota[4] + "', '" + quota[3] + "', '" + data[0].id + "', '1', '" + req.body.note + "')", function(error, data) {
                        console.log(data);
                        console.log("                ");
                        //conn.query("SELECT * FROM detail_quota WHERE  project_id = '" + tmp1 + "' AND user_id = '" + tmp2 + "'", function(error, data){
                        //console.log(data);
                        //console.log("                ");
                        //});
                        conn.query("SELECT * FROM detail_quota WHERE user_id = '" + tmp2 + "'", function(error, data) {
                            console.log(data);
                            console.log("                ");
                        });
                        conn.query("SELECT id FROM detail_quota WHERE user_id = '" + tmp2 + "'", function(error, data) {
                            res.redirect('http://11.11.254.69/tracking/ticket.php?id=' + data[0].id);
                        });
                    });
                });
            });
        });
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
                        createMessage(cloudTopic.cloudTopic(nextMessage, user_list[sessionID]), sessionID, data, function(message, items) {
                            users[socket.nickname].emit('new_message', { msg: message, items: items, nick: 'BOT', sendto: sendto });
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
                        createMessage(cloudTopic.cloudTopic(data, user_list[sessionID]), sessionID, data, function(message, items) {
                            users[socket.nickname].emit('new_message', { msg: message, items: items, nick: 'BOT', sendto: sendto });
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
function createMessage(buttonName, sessionID, data, cb) {
    var command = buttonName.command;
    var message = buttonName.message;
    user_data[sessionID] = command;
    var promButton = "";
    if (buttonName.buttonName == "Unhandle"){
        console.log("LOG FROM SMART TALK: " + cloudSmart.cloudTopic(data))
        handleSmartTalk(cloudSmart.cloudTopic(data), sessionID, function(Smessage, Sitems, Scommand){
            message = Smessage;
            promButton = Sitems;
            command = Scommand;
        })
    }
    else if (buttonName.buttonName != "NA") {
        for (var i = 0; i < handleButton(buttonName).length; i++) {
            console.log("Button Name : " + handleButton(buttonName)[i]);
            promButton = promButton + "<button class = \"button5\" type=\"button\" name = \"res_button\" onclick=\"clickOnRes(this.innerHTML)\">" + handleButton(buttonName)[i] + "</button>";
        }
    } else promButton = "NA";

    cb(message, promButton);
}

// handle button
function handleButton(buttonName) {
    if (buttonName.buttonName != "NA") return buttonName.buttonName.split(" andButton ");
    else return "NA";
}

//Handle SMART TALK
function handleSmartTalk(Smessage, sessionID, cb) {
    var promButton = "";
    var buttonName = cloudTopic.cloudTopic(Smessage, user_list[sessionID]);
    //console.log("HERERERERERREREE: " + buttonName.buttonName);
    if (buttonName.buttonName != "NA") {
        for (var i = 0; i < handleButton(buttonName).length; i++) {
            console.log("Button Name : " + handleButton(buttonName)[i]);
            promButton = promButton + "<button class = \"button5\" type=\"button\" name = \"res_button\" onclick=\"clickOnRes(this.innerHTML)\">" + handleButton(buttonName)[i] + "</button>";
        }
    } else promButton = "NA";
    cb(buttonName.message, promButton, buttonName.command);
}