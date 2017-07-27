//MY SQL
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_talk'
});

module.exports = {
    extractKey: function(message, key_action, key_object, valid_action, valid_object) {
        var messageArray = message.toLowerCase().split(" ");
        var keyword2Learn = [];
        var scope2Learn = [];
        var mean2Learn = [];
        var count = 0;
        var index = 0;
        messageArray.forEach(function(element) {
            conn.query("SELECT mean FROM key_word WHERE key_word like '" + element + "'", function(error, data) {
                if (error) {
                    console.log("ERROR DB: " + error);
                } else {
                    if (typeof data[0] == "undefined") {
                        if (typeof key_action == 'undefined' && typeof key_object == 'undefined') {
                            console.log("WE GOT A NEW KEY: ---- " + element + " LOOK LIKE IT IS AN ACTION");
                            keyword2Learn.push(element);
                            scope2Learn.push('ACTION');
                            mean2Learn.push(valid_action);
                            count = count + 1;
                            //editDB(element, 'ACTION', valid_action);
                            key_action = 'TMP';
                        } else if (typeof key_action == 'undefined') {
                            console.log("WE GOT A NEW KEY: ---- " + element + " LOOK LIKE IT IS AN ACTION");
                            keyword2Learn.push(element);
                            scope2Learn.push('ACTION');
                            mean2Learn.push(valid_action);
                            count = count + 2;
                            //editDB(element, 'ACTION', valid_action);
                        } else if (typeof key_object == 'undefined') {
                            console.log("WE GOT A NEW KEY: ---- " + element + " LOOK LIKE IT IS AN OBJECT");
                            keyword2Learn.push(element);
                            scope2Learn.push('OBJECT');
                            mean2Learn.push(valid_object);
                            count = count + 2;
                            //editDB(element, 'OBJECT', valid_object);
                        }
                    }
                }


                console.log("==============COUNT==============: " + count);
                index = index + 1;
                if (index === messageArray.length) {
                    if (count == 1) {
                        console.log("ADD 1 TO DB");
                        editDB(keyword2Learn[0], 'OBJECT', valid_object);
                    } else if (count > 3) {
                        console.log("MANY KEYWORDS - NOTHING TO LEARN");
                    } else if (count == 2 || count == 3) {
                        console.log("ADD 2 TO DB");
                        for (var i = 0; i < keyword2Learn.length; i++) {
                            editDB(keyword2Learn[i], scope2Learn[i], mean2Learn[i]);
                        }
                    }
                }


            });

        }, this);
    }
}

function editDB(keyword, scope, mean) {
    conn.query("INSERT INTO tmp_key (id, keyword,scope, mean, count, is_del) VALUES (NULL, '" + keyword + "', '" + scope + "', '" + mean + "','1','0')", function(error, results) {
        if (error) {
            conn.query("Select * from tmp_key where keyword like '" + keyword + "'", function(error, results) {
                console.log("SMART TALK DATA: " + results);
                var count = parseInt(results[0].count) + 1;
                conn.query("UPDATE tmp_key SET count = '" + count + "' where keyword like '" + results[0].keyword + "'", function(error, data) {
                    if (error) console.log(error);
                    else {
                        promoteKeyword(keyword);
                    }
                });
            })
        }
    });
}

function promoteKeyword(keyword) {
    conn.query("Select * from tmp_key where keyword like '" + keyword + "'", function(error, results) {
        var count = parseInt(results[0].count);
        if (parseInt(results[0].count) >= 3 && results[0].is_del != '1') {
            conn.query("INSERT INTO key_word (id, key_word, mean, count) VALUES (NULL, '" + keyword + "', '" + results[0].mean + "','1')", function(error, data) {
                conn.query("UPDATE tmp_key SET is_del = '1' where keyword like '" + keyword + "'");
            })
        }
    })
}