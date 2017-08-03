//talking about cloud topic
const RequestPromise = require('request-promise');
//module.exports = {
//cloudTopic: function(step, user_data) {
function automationTopic(step, sessionID, cb) {
    var ipaddr = require("ip");
    var buttonName;
    var message;
    var command;
    var tip;
    var previous_step;
    console.log("************************GOT STEP********************* " + step);
    switch (step.toLowerCase()) {
        case 'automation':
            message = "Hi! Nice to work with you on Automation area.  Please select from the following options what you would like to be discussed: ";
            buttonName = "What is Automation FW? andButton How to install Automation FW? andButton How to run Automation Test case?";
            tip_title = "NA";
            tip = "NA";
            break;
        case 'user need to install fw':
            message = "To install the Automation framework, please click <a href='http://11.11.254.69/autoDoc/Install_Java_Automation_Framework.pptx'>HERE</a> to get the document for installation";
            buttonName = "NA";
            tip_title = "NA";
            tip = "NA";
            break;
        case 'user need to create fw':
            message = "To install the Automation framework, please click <a href='http://11.11.254.69/autoDoc/Install_Java_Automation_Framework.pptx'>HERE</a> to get the document for installation";
            buttonName = "NA";
            tip_title = "NA";
            tip = "NA";
            break;
        case 'user need to know fw':
            message = "Automation framework is a collection of many tools to support tester write automate test scripts for Web, Android Apps or REST API";
            buttonName = "NA";
            tip_title = "NA";
            tip = "NA";
            break;
        case 'user need to negative install fw':
            message = "Please make sure you followed the steps in <a href='http://11.11.254.69/autoDoc/Install_Java_Automation_Framework.pptx'>HERE</a>, if the failure still exists, please contact to admin ";
            buttonName = "NA";
            tip_title = "NA";
            tip = "NA";
            break;
        case "user need to chat admin":
            message = "Yes, I'm forwarding this session to admin, please wait a moment";
            buttonName = "NA";
            tip_title = "Session chat to admin";
            tip = "The current session has been forward to admin!";
            break;
        default:
            message = "I didn't catch you, could you type another words?";
            buttonName = "NA";
            tip_title = "NA";
            tip = "NA";
            break;
    }
    handleButton(buttonName, function(button) {
        cb(button, message, tip_title, tip);
    });
    // console.log("MESSAGE TYPE: " + typeof message);
    // console.log("Message to return: " + message);
    // while (typeof message !== "undefined") {
    //     if (typeof cb !== "undefined") {
    //         cb({ 'buttonName': buttonName, 'message': message, 'command': command, 'tip_title': tip_title, 'tip': tip }, sessionID, cb1);
    //     }
    //     return { 'buttonName': buttonName, 'message': message, 'command': command, 'tip_title': tip_title, 'tip': tip };
    //     break;
    // }
};
//};
exports.automationTopic = automationTopic;

//FUNCTION
function handleButton(data, cb) {
    var button = ""
    var i = 0;
    if (data != 'NA') {
        var buttonArray = data.split(" andButton ");
        buttonArray.forEach(function(element) {
            button = button + "<button class = \"button5\" type=\"button\" name = \"res_button\" onclick=\"clickOnRes(this.innerHTML)\">" + element + "</button>";
            i = i + 1;
            if (i == buttonArray.length) {
                cb(button);
            }
        }, this);
    } else cb("NA");
}