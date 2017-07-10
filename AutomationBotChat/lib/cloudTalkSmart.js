//Common key word
const COMMON = ["want","wanna","need"];
const CREATE = ["create","add", "new"];
const NEGATIVE = ["not", "don't", "no", "failed", "fail", "unable"];
//Detail
const D_QUOTA = ["quota","instance","ticket", "VM", "vm", "cloud", "virtual machine", "ternant"];
module.exports = {
    cloudTopic: function(message) {
        var resMessage = "";
        var key_ACTION = "";
        var key_OBJECT = "";
        var flag_NEGATIVE = false;
        //console.log("JUMP INTO SMART TALK");

        guestUserIntent(message, function(key_ACTION, key_OBJECT, flag_NEGATIVE) {
            if(key_ACTION != "" || key_OBJECT !="") {
                //console.log("JUMP INTO SMART TALK 1");
                if (!flag_NEGATIVE) {//console.log("JUMP INTO SMART TALK 2"); 
                resMessage = "USER NEED TO " + key_ACTION + " " + key_OBJECT;}
                else { //console.log("JUMP INTO SMART TALK 3"); 
                resMessage =  "USER DON'T NEED TO " + key_ACTION + " " + key_OBJECT;}
            }
            else {//console.log("JUMP INTO SMART TALK 4");
            resMessage = "DON'T KNOW!";}
        })
        return resMessage;
    }
};

function guestUserIntent(message,cb) {
    var key_ACTION, key_OBJECT, flag_NEGATIVE;

    COMMON.forEach(function(key) {
        if (message.indexOf(key) != -1) {
            key_ACTION = "CREATE";
            console.log("CREATE");
            //break;
        }
    }, this);

    CREATE.forEach(function(key) {
        if (message.indexOf(key) != -1) {
            key_ACTION = "CREATE";
            console.log("CREATE");
            //break;
        }
    }, this);

    D_QUOTA.forEach(function(key) {
        if (message.indexOf(key) != -1) {
            key_OBJECT = "QUOTA";
            console.log("QUOTA");
            //break;
        }
    }, this);   

    NEGATIVE.forEach(function(key) {
        if (message.indexOf(key) != -1) {
            flag_NEGATIVE = true;
            console.log("NATIVE");
            //break;
        }
    }, this);
    cb(key_ACTION, key_OBJECT, flag_NEGATIVE);
}
