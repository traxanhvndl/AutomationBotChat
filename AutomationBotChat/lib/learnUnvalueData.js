//MY SQL
var mysql = require('mysql');
var patternNumber = /[1-9]/g;
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'smart_talk'
});

module.exports = {
    learnUnvalueData: function(message) {
        var messageArray = message.toLowerCase().replace("'", "_").toLowerCase().split(" ");
        messageArray.forEach(function(element) {
            if (typeof element.match(patternNumber) == null) {
                conn.query("SELECT mean FROM key_word WHERE key_word like '" + element + "'", function(error, data) {
                    if (error) {
                        console.log("ERROR DB: " + error);
                    } else {
                        if (typeof data[0] == "undefined") {
                            conn.query("INSERT INTO tmp_unvalue (id, key_word, mean, count, is_del) VALUES (NULL, '" + element + "', '" + 'unvalue' + "','0', '0')", function(error, results) {
                                if (error) {
                                    console.log("LOCAL - KEY: " + element);
                                    conn.query("Select * from tmp_unvalue where key_word like '" + element + "'", function(error, results) {
                                        console.log("SMART TALK DATA: " + results);
                                        var count = parseInt(results[0].count) + 1;
                                        conn.query("UPDATE tmp_unvalue SET count = '" + count + "' where key_word like '" + results[0].key_word + "'", function(error) {
                                            if (!error) {
                                                conn.query("Select * from tmp_unvalue where key_word like '" + element + "'", function(error, data) {
                                                    if (!error) {
                                                        var count_unvalue = parseInt(data[0].count);
                                                        if (count_unvalue >= 2 && data[0].is_del == '0') {
                                                            conn.query("INSERT into key_word (id, key_word, mean, count) value (NULL, '" + element + "','" + data[0].mean + "','1')", function(error) {
                                                                if (!error) {
                                                                    conn.query("UPDATE tmp_unvalue SET is_del = '1' where key_word like '" + element + "'");
                                                                    console.log("PROMOTE " + element + " TO KEY WORD AS " + data[0].mean);
                                                                }
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                        });
                                    })
                                }
                            })
                        }
                    }
                });
            }
        }, this);
    }
}