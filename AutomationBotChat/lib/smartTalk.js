//Common key word
const UNVALUE = ["i", "i'm", "a", "an", "the", "is", "are", "my", "me", ",", "?", ".", "please", "on"];
const COMMON = ["want", "wanna", "need"];
const CREATE = ["create", "add", "new", "request", "make", "build"];
const NEGATIVE = ["not", "don't", "no", "failed", "fail", "unable", "can't"];
const QUERY = ["view", "query", "check", "show", "link", "how is", "how are"];
//Detail
const D_QUOTA = ["quota", "instance", "ticket", "vm", "cloud", "virtual machine", "ternant"];
//AI Code:
var Unknow_query = [];
var smartTalk2 = require('./smartTalk2');
var learnUnvalueData = require('./learnUnvalueData');

//MYSQL
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'smart_talk'
});
module.exports = {
    cloudTopic: function(message, cb) {
        var resMessage = "";
        var key_ACTION = "";
        var key_OBJECT = "";
        var flag_NEGATIVE = false;
        smartTalk2.guessUserIntent(message, function(key_action, key_object, validate_key, key_negative, extraData_flag, extraData) {
                // if (extraData_flag) {
                //     console.log("GOT EXTRA DATA RAM --------- " + extraData.ram);
                //     console.log("GOT EXTRA DATA HDD --------- " + extraData.hdd);
                //     console.log("GOT EXTRA DATA CPU --------- " + extraData.cpu);
                // }
                resMessage = "USER NEED TO " + key_negative + key_action + " " + key_object;
                if (typeof key_action != 'undefined' && typeof key_object != 'undefined') learnUnvalueData.learnUnvalueData(message);
                cb(resMessage, extraData_flag, extraData);
            })
            //console.log("JUMP INTO SMART TALK");

        // guestUserIntent(message, function(key_ACTION, key_OBJECT, flag_NEGATIVE) {
        //     if (typeof key_ACTION != "undefined" && typeof key_OBJECT != "undefined") {
        //         //console.log("JUMP INTO SMART TALK 1");
        //         if (!flag_NEGATIVE) { //console.log("JUMP INTO SMART TALK 2"); 
        //             resMessage = "USER NEED TO " + key_ACTION + " " + key_OBJECT;
        //         } else { //console.log("JUMP INTO SMART TALK 3"); 
        //             resMessage = "USER DON'T NEED TO " + key_ACTION + " " + key_OBJECT;
        //         }
        //     } else { //console.log("JUMP INTO SMART TALK 4");
        //         resMessage = "DON'T KNOW!";
        //         console.log("I DON'T KNOW");
        //         conn.query("INSERT INTO unknow_msg (id, message, intent, key_action, key_obj) VALUES (NULL, '" + message + "', '" + "USER NEED TO " + key_ACTION + " " + key_OBJECT + "','" + key_ACTION + "','" + key_OBJECT + "')", function(error, data) {
        //             if (error) {
        //                 console.log("ERROR DB: " + error);
        //             }
        //         });
        //     }
        //     var key_array = message.split(" ");
        //     key_array.forEach(function(key) {
        //         //addKey2DB(key, "Unknown");
        //     })
        // });
        //cb(resMessage);
    }
};

function guestUserIntent(message, cb) {
    var key_ACTION, key_OBJECT, flag_NEGATIVE;
    message = ' ' + message.toLowerCase() + ' ';
    //GET MAIN ACTION
    COMMON.forEach(function(key) {
        if (message.indexOf(' ' + key + ' ') != -1) {
            key_ACTION = "CREATE";
            addKey2DB(key, "commom");
            console.log("CREATE");
            //break;
        }
    }, this);

    CREATE.forEach(function(key) {
        if (message.indexOf(' ' + key + ' ') != -1) {
            key_ACTION = "CREATE";
            addKey2DB(key, "create");
            console.log("CREATE");
            //break;
        }
    }, this);

    QUERY.forEach(function(key) {
        if (message.indexOf(' ' + key + ' ') != -1) {
            key_ACTION = "QUERY";
            addKey2DB(key, "query");
            console.log("QUERY");
            //break;
        }
    }, this);

    //GET MAIN OBJECT
    D_QUOTA.forEach(function(key) {
        if (message.indexOf(' ' + key + ' ') != -1) {
            key_OBJECT = "QUOTA";
            addKey2DB(key, "quota");
            console.log("QUOTA");
            //break;
        }
    }, this);

    NEGATIVE.forEach(function(key) {
        if (message.indexOf(' ' + key + ' ') != -1) {
            flag_NEGATIVE = true;
            addKey2DB(key, "native");
            console.log("NATIVE");
            //break;
        }
    }, this);

    UNVALUE.forEach(function(key) {
        if (message.indexOf(' ' + key + ' ') != -1) {
            //addKey2DB(key, "unvalue");
            console.log("UNVALUE");
            //break;
        }
    }, this)
    cb(key_ACTION, key_OBJECT, flag_NEGATIVE);
}

function addKey2DB(key, mean) {
    var local_key = key;
    conn.query("INSERT INTO key_word (id, key_word, mean, count) VALUES (NULL, '" + key + "', '" + mean + "','1')", function(error, results) {
        if (error) {
            console.log("LOCAL - KEY: " + local_key);
            conn.query("Select * from key_word where key_word like '" + local_key + "'", function(error, results) {
                console.log("SMART TALK DATA: " + results);
                var count = parseInt(results[0].count) + 1;
                conn.query("UPDATE key_word SET count = '" + count + "' where key_word like '" + results[0].key_word + "'");
            })
        }
    });
}