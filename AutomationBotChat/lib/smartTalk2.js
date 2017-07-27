var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_talk'
});
module.exports = {
    guessUserIntent: function(message, cb) {
        var key_action;
        var key_object;
        var mean;
        var validate_key = false; // if it's FALSE >>> Unhandle message
        var messageArray = message.toLowerCase().split(" ");
        var i = 0;
        var messageLength = messageArray.length;
        messageArray.forEach(function(element) {
            conn.query("SELECT mean FROM key_word WHERE key_word like '" + element + "'", function(error, data) {
                if (error) {
                    console.log("ERROR DB: " + error);
                } else {
                    if (typeof data[0] != "undefined") {
                        mean = data[0].mean;
                        console.log("KEY WORD: --- " + element + " --- MEAN: --- " + mean);
                        if (mean == 'create' || mean == 'query') {
                            key_action = mean;
                            validate_key = true;
                        }
                        if (mean == 'ticket' || mean == 'quota') {
                            key_object = mean;
                            validate_key = true;
                        }
                        if (mean == 'unvalue' || mean == 'commom') validate_key = true;
                    } else console.log("DON'T HAVE KEY --- " + element);
                }
                i = i + 1;
                if (i == messageLength) cb(key_action, key_object, validate_key);
            });
        }, this);
    }
}