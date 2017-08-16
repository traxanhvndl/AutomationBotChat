var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'smart_talk'
});
module.exports = {
        guessUserIntent: function(message, cb) {
            var key_action;
            var key_object;
            var key_complement = "";
            var mean;
            var key_negative = "";
            var extraData_flag = false;
            var validate_key = false; // if it's FALSE >>> Unhandle message
            var messageArray = message.toLowerCase().replace("'", "_").split(" ");
            var i = 0;
            var messageLength = messageArray.length;
            var extraData = {};
            var ram, cpu, hdd;
            reduceMessage(messageArray, function(message) {
                messageArray = message.split(" ");
                messageLength = messageArray.length;
                messageArray.forEach(function(element, index) {
                    conn.query("SELECT mean FROM key_word WHERE key_word like '" + element + "'", function(error, data) {
                        if (error) {
                            console.log("ERROR DB: " + error);
                        } else {
                            if (typeof data[0] != "undefined") {
                                mean = data[0].mean;
                                console.log("KEY WORD: --- " + element + " --- MEAN: --- " + mean);
                                if (mean == 'create' || mean == 'query' || mean == 'chat' || mean == 'install' || mean == 'know' || mean == 'need') {
                                    key_action = mean;
                                    validate_key = true;
                                }
                                if (mean == 'ram' || mean == 'hdd' || mean == 'cpu') {
                                    extraData_flag = true;
                                }
                                if (mean == 'default') {
                                    key_complement = " " + mean;
                                }
                                if (mean == 'ticket' || mean == 'quota' || mean == 'admin' || mean == 'fw') {
                                    key_object = mean;
                                    validate_key = true;
                                }
                                if (mean == 'negative') {
                                    key_negative = mean + " ";
                                }
                                if (mean == 'unvalue') validate_key = true;
                            } else console.log("DON'T HAVE KEY --- " + element);
                        }
                        i = i + 1;
                        if (i == messageLength) {
                            if (extraData_flag) {
                                extracData(message, function(data_array) {
                                    var tmp_array = ['key', 'num', 'key', 'num', 'key', 'num', 'key', 'num'];
                                    var index_tmp_array_key = 0;
                                    var index_tmp_array_num = 1;
                                    if (data_array) {
                                        data_array.forEach(function(element, index) {
                                            if (isNaN(element)) {
                                                //console.log("ADD MEAN: " + mean);
                                                tmp_array[index_tmp_array_key] = element;
                                                index_tmp_array_key = index_tmp_array_key + 2;
                                            } else if (!isNaN(element) && element != null) {
                                                //console.log("ADD NUM: " + element);
                                                tmp_array[index_tmp_array_num] = element;
                                                index_tmp_array_num = index_tmp_array_num + 2;
                                            }
                                            if (index == data_array.length - 1) {
                                                //create extraData
                                                extraData[tmp_array[0]] = tmp_array[1];
                                                extraData[tmp_array[2]] = tmp_array[3];
                                                extraData[tmp_array[4]] = tmp_array[5];
                                                cb(key_action, key_object, validate_key, key_negative, extraData_flag, extraData, key_complement);
                                            }
                                        }, this);
                                    }
                                })
                            } else cb(key_action, key_object, validate_key, key_negative, extraData_flag, extraData, key_complement);
                        }
                    });
                }, this);
            })

        }
    }
    //function extrac extraData:
function extracData(message, cb) {
    var data_array = [];
    var tmp_msg = message.toLowerCase().replace('ram', 'bonho').replace('mb', '').replace('gb', '').replace('m', '').replace('bonho', 'ram').replace('  ', ' ');
    //console.log("MESSAGE________________________________" + tmp_msg + "_________________________________");
    var tmp_msg_array = tmp_msg.split(" ");
    tmp_msg_array.forEach(function(element, index) {
        //console.log("INDEX - " + index + " - VALUE - " + element);
    }, this);
    tmp_msg_array.forEach(function(element, index) {
        if (element.indexOf('ram') != -1) element = 'ram';
        if (element.indexOf('hdd') != -1) element = 'hdd';
        if (element.indexOf('cpu') != -1) element = 'cpu';
        if ((!isNaN(element) || element.indexOf('ram') != -1 || element.indexOf('hdd') != -1 || element.indexOf('cpu') != -1) && (element != '')) {
            //console.log("ADD ELEMENT :______________" + element + "____________________!");
            data_array.push(element);
        }
        if (index == tmp_msg_array.length - 1) {
            data_array.forEach(function(element, index) {
                //console.log("INDEX - " + index + " - VALUE - " + element + "______________!");
            }, this);
            cb(data_array);
        }
    }, this);
}

//function reduce message:
function reduceMessage(messageArray, cb) {
    var tmp_message = "";
    messageArray.forEach(function(element, index) {
        queryKeyword(element, function(mean) {
            if (mean != 'unvalue') tmp_message = tmp_message + " " + element;
            if (index == messageArray.length - 1) {
                //console.log("NEW MESSAGE AFTER REDUCING: " + tmp_message);
                cb(tmp_message);
            }
        })
    }, this);
}

//function query key word:
function queryKeyword(keyword, cb) {
    conn.query("SELECT mean FROM key_word WHERE key_word like '" + keyword + "'", function(error, data) {
        if (error) console.log("GET ERROR: " + error);
        else {
            if (data[0]) cb(data[0].mean);
            else cb('undefined');
        }
    });
}