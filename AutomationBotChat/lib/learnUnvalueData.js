//MY SQL
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_talk'
});

module.exports = {
    learnUnvalueData: function(message) {
        var messageArray = message.toLowerCase().split(" ");
        messageArray.forEach(function(element) {
            conn.query("SELECT mean FROM key_word WHERE key_word like '" + element + "'", function(error, data) {
                if (error) {
                    console.log("ERROR DB: " + error);
                } else {
                    if (typeof data[0] == "undefined") {
                        conn.query("INSERT INTO key_word (id, key_word, mean, count) VALUES (NULL, '" + element + "', '" + 'unvalue' + "','1')", function(error, results) {
                            if (error) {
                                console.log("LOCAL - KEY: " + element);
                                conn.query("Select * from key_word where key_word like '" + element + "'", function(error, results) {
                                    console.log("SMART TALK DATA: " + results);
                                    var count = parseInt(results[0].count) + 1;
                                    conn.query("UPDATE key_word SET count = '" + count + "' where key_word like '" + results[0].key_word + "'");
                                })
                            }
                        })
                    }
                }
            });
        }, this);
    }
}