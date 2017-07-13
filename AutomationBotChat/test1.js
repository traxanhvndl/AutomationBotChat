var cloudTopic = require("./lib/cloudTalk");
var cloudSmart = require("./lib/cloudTalkSmart");

function talkWithCloud(step, user_data, cb) {
    var data = cloudTopic.cloudTopic(step, user_data);
    cb(data);
}

function printLog(data, a1, a2) {
    console.log("Log for test 123  --------------   " + data.message);
    console.log(a1);
    console.log(a2);
}

//talkWithCloud( "Cloud","ABC", function(data){
    //printLog(data, "Hello", "I'm working");
//});
cloudTopic.cloudTopic("Cloud", "ABC", function(data) {
    printLog(data, "Hello", "I'm working");
});