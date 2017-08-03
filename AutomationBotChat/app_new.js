var config = require('./config')();
var cloudTopic = require("./lib/cloudTalk");
var autoTopic = require("./lib/automationTalk");
var cloudSmart = require("./lib/smartTalk");
var learnData = require("./lib/learnData");
var learnUnvalueData = require("./lib/learnUnvalueData");
var extractKey = require("./lib/extracKey");
var smartTalk2 = require("./lib/smartTalk2");
//var cloudSmart = require("./lib/cloudTalkSmart");
var ipaddr = require("ip");
var session = require('express-session'); //new
var cons = require('consolidate'); //new
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'), //new
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
user_unkonw_mgs = {};
user_unknow_count = {};
userClientName = {};
// port = process.env.PORT || 5000,
// ip = process.env.HOST || '192.168.35.44';
// ip = process.env.HOST || '11.11.254.69';

var port = process.env.PORT || 3000;
var ip = process.env.HOST || '0.0.0.0' || ipaddr.address();

var port = config.port;
var ip = config.ip;

const RequestPromise = require('request-promise');
var stringify = require('json-stringify-safe');
var apiai = require('apiai');
var appAI = apiai("e58b167254d549a6bde597727c5a334b");
var AIMessage;
var AIData;
var tmp_socket;

//new
app.use(cookieParser('shhhh, very secret'));
app.use(session());
app.use(function(req, res, next) {
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

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

//html view
app.engine('html', cons.swig)
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
//html

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    console.log('User connected !')
});

app.get('/admin', function(req, res) {
    if (req.session.user) {
        res.render('admin');
    } else {
        req.session.error = 'Access denied!';
        res.render('login');
    }
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

app.post('/botChatMessage', function(req, res) {

})

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

app.post('/admin', function(req, res) {
    console.log('Connected !');
    console.log("USER NAME: " + req.body.username);
    console.log("PASSWORD: " + req.body.password);
    if (req.body.username == "admin" && req.body.password == "123456") {
        req.session.regenerate(function() {
            // Store the user's primary key 
            // in the session store to be retrieved,
            // or in this case the entire user object 
            req.session.user = "admin";
            req.session.success = 'Authenticated as ' + "admin" +
                ' click to <a href="/logout">logout</a>. ' +
                ' You may now access <a href="/restricted">/restricted</a>.';
            res.redirect('/admin');
        });
    } else {
        req.session.error = 'Access denied!';
        res.render('error_login');
    }
});

//Logout
app.get('/logout', function(req, res) {
    // destroy the user's session to log them out 
    // will be re-created next request
    req.session.destroy(function() {
        res.redirect('/admin');
    });
});

app.get('/cloud/register', function(req, res) {
    console.log('Connected !')
    res.sendfile(__dirname + '/public/tracking/index.html');
});
//GET ticketID by username
app.get('/cloud/ticket/fullName/:full_name', function(req, res) {
    console.log("FULL NAME: " + req.params.full_name);
    conn.query('SELECT id FROM user_data WHERE full_name = "' + req.params.full_name + '"', function(error, data) {
        console.log("RESPONSE: " + data);
        conn.query('SELECT id FROM detail_quota WHERE user_id = "' + data[0].id + '"', function(error, data) {
            console.log("RESPONSE: " + data[0].id);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(data));
            res.end();
        });
    });
});
//GET ticket detail by ID
app.get('/cloud/ticket/ticketID/:ticketID', function(req, res) {
    //console.log("FULL NAME: " + req.params.full_name );
    conn.query('SELECT * FROM detail_quota WHERE id like "' + req.params.ticketID + '"', function(error, data) {
        if (typeof data[0] == "undefined") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify([{ "status": "failed", "message": "invalid ticket ID", "id": "invalid" }]));
            res.end();
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(data));
            res.end();
        }
    });
});

app.post('/cloud/register', function(req, res) {
    var date = new Date();
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
                    conn.query("INSERT INTO detail_quota (id, project_id, life_time, instance, cpu, hdd, ram, user_id, status_id, note, date ) VALUES (NULL, '" + data[0].project_id + "', '" + quota[0] + "', '" + quota[1] + "', '" + quota[2] + "', '" + quota[4] + "', '" + quota[3] + "', '" + data[0].id + "', '1', '" + req.body.note + "', '" + date + "')", function(error, data) {
                        console.log(data);
                        console.log("                ");
                        conn.query("SELECT * FROM detail_quota WHERE user_id = '" + tmp2 + "'", function(error, data) {
                            console.log(data);
                            console.log("                ");
                        });
                        conn.query("SELECT id FROM detail_quota WHERE user_id = '" + tmp2 + "'", function(error, data) {
                            //res.writeHead(200);
                            res.redirect('http://11.11.254.69/tracking/ticket.php?id=' + data[0].id);
                            res.end();
                        });
                    });
                });
            });
        });
    });
});

app.post('/cloud/BOTregister', function(req, res) {
    var date = new Date();
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
                    conn.query("INSERT INTO detail_quota (id, project_id, life_time, instance, cpu, hdd, ram, user_id, status_id, note, date ) VALUES (NULL, '" + data[0].project_id + "', '" + quota[0] + "', '" + quota[1] + "', '" + quota[2] + "', '" + quota[4] + "', '" + quota[3] + "', '" + data[0].id + "', '1', '" + req.body.note + "','" + date + "')", function(error, data) {
                        console.log(data);
                        console.log("                ");
                        conn.query("SELECT * FROM detail_quota WHERE user_id = '" + tmp2 + "'", function(error, data) {
                            console.log(data);
                            console.log("                ");
                        });
                        conn.query("SELECT id FROM detail_quota WHERE user_id = '" + tmp2 + "'", function(error, data) {
                            res.writeHead(200);
                            //res.redirect('http://11.11.254.69/tracking/ticket.php?id=' + data[0].id);
                            res.end();
                        });
                    });
                });
            });
        });
    });
});

io.sockets.on('connection', function(socket) {
    tmp_socket = io.sockets;
    socket.on('new_user', function(name, data) {
        if (name in users) {
            data(false);
        } else {
            data(true);
            socket.nickname = name;
            users[socket.nickname] = socket;
            userClientName[socket.id] = socket.nickname;
            updateNickNames();
        }

    });

    function updateNickNames() {
        io.sockets.emit('user_names', Object.keys(users));
    }
    socket.on('open_chatbox', function(data) {
        users[data].emit('openbox', { nick: socket.nickname });
    });
    socket.on('send_message', function(data) {
        console.log(data.sendto, data.msg, data.nick);
        if (users[data.sendto]) {
            var currentdate = new Date();
            var time = currentdate.getHours() + ":" + currentdate.getMinutes();
            users[data.nick].emit('new_message', { msg: data.msg, nick: 'BOT', sendto: data.sendto });
        };
    });

    // Process for BOT if getting command from topic
    socket.on('send_message_bot', function(data, sendto) {
        //data = data.toLowerCase().replace("'", "_");
        if (typeof users[socket.nickname] == "undefined") {
            console.log("WE GOT A DEAD SESSION!");
        } else {
            var sessionID = users[socket.nickname].id;
            var tmp_message = "";
            if ("" + user_list[sessionID] == 'undefined') {
                var tmp = {};
                user_list[sessionID] = tmp;
            }
            if (typeof user_unknow_count[sessionID] == 'undefined') {
                user_unknow_count[sessionID] = 0;
            }
            cloudSmart.cloudTopic(data, function(SmartMgs) {
                if (SmartMgs.toLowerCase() == 'user need to chat admin') {
                    var currentdate = new Date();
                    var time = currentdate.getHours() + ":" + currentdate.getMinutes();
                    selectTopic(users[socket.nickname].id, "ChatAdmin", function(sessionID) {});
                    io.sockets.emit('new_message_admin', { msg: socket.nickname + " need to chat with admin ", sendto: socket.nickname, sendfrom: 'BOT', time: time });
                }
            })
            console.log("OBJECT: " + user_list[sessionID]);
            console.log("USER_DATA : " + user_data[sessionID]);
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
                            createMessage(nextMessage, user_list[sessionID], sessionID, data, function(message, items, tip_title, tip) {
                                console.log("TIP TITLE ---------------------: " + tip_title);
                                console.log("TIPPPP---------------------: " + tip);
                                tmp_message = message;
                                if (tmp_message !== "I didn't catch you, could you type another words?") {
                                    users[socket.nickname].emit('new_message', { msg: message, items: items, tip_title: tip_title, tip: tip, nick: 'BOT', sendto: sendto });
                                }
                                console.log("Here log: " + user_data[sessionID]);
                            })
                        }
                    })
                });
            } else {
                selectTopic(users[socket.nickname].id, data, function(sessionID) {
                    getTopic(sessionID, function() {
                        if (session_topic[sessionID] == "Cloud") {
                            createMessage(data, user_list[sessionID], sessionID, data, function(message, items, tip_title, tip) {
                                console.log("TIP TITLE ---------------------: " + tip_title);
                                console.log("TIPPPP---------------------: " + tip);
                                tmp_message = message;
                                console.log("*****************************TMP MESSAGE: " + tmp_message);
                                if (tmp_message != "I didn't catch you, could you type another words?") {
                                    users[socket.nickname].emit('new_message', { msg: message, items: items, tip_title: tip_title, tip: tip, nick: 'BOT', sendto: sendto });
                                }
                                //log
                                console.log("Here log: " + user_data[sessionID]);
                            })
                        }
                        if (session_topic[sessionID] == "ChatAdmin") {
                            var currentdate = new Date();
                            var time = currentdate.getHours() + ":" + currentdate.getMinutes();
                            io.sockets.emit('new_message_admin', { msg: data, sendto: socket.nickname, sendfrom: 'BOT', time: time });
                        }
                        //CODE FOR AUTOMATION TOPIC
                        if (session_topic[sessionID] == "Automation") {
                            cloudSmart.cloudTopic(data, function(SmartMgs) {
                                console.log("AUTOMATION___________" + SmartMgs);
                                if (data == "Automation") SmartMgs = "Automation";
                                if (SmartMgs.indexOf("undefined") != -1) {
                                    user_unkonw_mgs[sessionID] = data;
                                } else if (typeof user_unkonw_mgs[sessionID] != 'undefined' && SmartMgs != 'Automation') {
                                    learnData.learnFromUser(user_unkonw_mgs[sessionID], data);
                                }
                                autoTopic.automationTopic(SmartMgs, sessionID, function(items, message, tip_title, tip) {
                                    users[socket.nickname].emit('new_message', { msg: message, items: items, tip_title: tip_title, tip: tip, nick: 'BOT', sendto: sendto });
                                })
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
                        //console.log("*****************************TMP MESSAGE: " + tmp_message);
                        if (tmp_message == "I didn't catch you, could you type another words?") {
                            users[socket.nickname].emit('new_message', { msg: AIMessage, tip_title: 'NA', tip: 'NA', nick: 'BOT', sendto: sendto });
                        }
                        //else users[socket.nickname].emit('new_message',{msg: AIMessage, nick: 'BOT', sendto: sendto});
                    });
                }
            }
        }
    });

    socket.on('disconnect', function(data) {
        if (!socket.nickname) return;
        io.sockets.emit('remove_user_names', socket.nickname);
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
    if (message == "ChatAdmin") session_topic[sessionID] = "ChatAdmin";
    cb(sessionID);
}

// get the topic of user
function getTopic(sessionID, cb) {
    var topic = session_topic[sessionID];
    cb();
}

// create message
function createMessage(clientMgs, userData, sessionID, data, cb1) {
    var message = "";
    var promButton = "";
    var command;
    var currentdate = new Date();
    var time = currentdate.getHours() + ":" + currentdate.getMinutes();
    cloudTopic.cloudTopic(clientMgs, userData, sessionID, cb1, function(buttonName, sessionID, cb1) {
        command = buttonName.command;
        user_data[sessionID] = command;
        message = buttonName.message;
        tip = buttonName.tip;
        tip_title = buttonName.tip_title;
        console.log("BUTTON TO SEND TO CLIENT: " + buttonName.buttonName);
        promButton = "";
        if (buttonName.message == "I didn't catch you, could you type another words?") {
            cloudSmart.cloudTopic(clientMgs, function(tmp_msg) {
                console.log("********************************** " + tmp_msg);
                handleSmartTalk(tmp_msg, sessionID, function(Smessage, Sitems, Scommand) {
                    console.log("*********SMESSAGE***********" + Smessage);
                    message = Smessage;
                    promButton = Sitems;
                    command = Scommand;
                    user_data[sessionID] = command;
                    if (Smessage == "I didn't catch you, could you type another words?") {
                        user_unkonw_mgs[sessionID] = data;
                        user_unknow_count[sessionID] = user_unknow_count[sessionID] + 1;
                        console.log("UNKNOWN MESSAGE COUNT: _____________" + user_unknow_count[sessionID]);
                        if (user_unknow_count[sessionID] > 2) {
                            selectTopic(sessionID, "ChatAdmin", function(sessionID) {
                                message = "I'm sorry. I'm having trouble understanding you, so I'll forward this session to real supporters, they will help you";
                                tmp_socket.emit('new_message_admin', { msg: "User needs to chat with admin: " + data, sendto: userClientName[sessionID], sendfrom: 'BOT', time: time });
                            });
                        }
                        console.log("UNKNOW MESSAGE: " + user_unkonw_mgs[sessionID]);
                    } else {
                        if (typeof user_unkonw_mgs[sessionID] != "undefined") {
                            user_unknow_count = 0;
                            learnData.learnFromUser(user_unkonw_mgs[sessionID], data);
                        }
                    }
                    cb1(message, promButton, tip_title, tip);
                })
            });
        } else if (buttonName.buttonName != "NA") {
            for (var i = 0; i < handleButton(buttonName).length; i++) {
                console.log("Button Name : " + handleButton(buttonName)[i]);
                promButton = promButton + "<button class = \"button5\" type=\"button\" name = \"res_button\" onclick=\"clickOnRes(this.innerHTML)\">" + handleButton(buttonName)[i] + "</button>";
            }
            cb1(message, promButton, tip_title, tip);
        } else {
            promButton = "NA";
            cb1(message, promButton, tip_title, tip);
        } //promButton = "NA";
        //cb1(message, promButton, tip_title, tip);
    });
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
    if (buttonName.buttonName != "NA") {
        for (var i = 0; i < handleButton(buttonName).length; i++) {
            console.log("Button Name : " + handleButton(buttonName)[i]);
            promButton = promButton + "<button class = \"button5\" type=\"button\" name = \"res_button\" onclick=\"clickOnRes(this.innerHTML)\">" + handleButton(buttonName)[i] + "</button>";
        }
    } else promButton = "NA";
    cb(buttonName.message, promButton, buttonName.command);
}