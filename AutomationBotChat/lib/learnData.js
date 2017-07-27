//MY SQL
var mysql = require('mysql');
var smartTalk2 = require('./smartTalk2');
var learnUnvalueData = require('./learnUnvalueData');
var extractKey = require('./extracKey');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'smart_talk'
});
module.exports = {
    learnFromUser: function(unknowMgs, message) {
        // conn.query("UPDATE unknow_msg SET valid_mgs = '" + message + "' where message like '" + unknowMgs + "'", function(error, data) {
        //     if (error) {
        //         console.log("ERROR DB: " + error);
        //     }
        // });
        var valid_action, valid_object;
        smartTalk2.guessUserIntent(message, function(action, object) {
            valid_action = action;
            valid_object = object;
        });
        smartTalk2.guessUserIntent(unknowMgs, function(action, object, validate_key) {
            console.log("USER NEED TO " + action + " " + object + " ----- " + validate_key);
            if (validate_key == true) {
                console.log("ACTION " + action);
                console.log("OBJECT " + object);
                console.log("VALID_ACTION " + valid_action);
                console.log("VALID_OBJECT " + valid_object);
                extractKey.extractKey(unknowMgs, action, object, valid_action, valid_object);
            }
        });
    }
}