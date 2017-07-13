//talking about cloud topic
const RequestPromise = require('request-promise');
//module.exports = {
   //cloudTopic: function(step, user_data) {
       function cloudTopic(step, user_data, sessionID, cb1, cb) {
        var ipaddr = require("ip");
        var buttonName;
        var message;
        var command;
        var previous_step;
        switch (step.toLowerCase()) {
            case 'cloud':
                message = "Hi! Nice to work with you on Cloud area.  Please select from the following options what you would like to be discussed: ";
                buttonName = "Request a new Quota andButton Query project quota andButton View my ticket";
                break;
            case "clear_cloud":
                message = "Hi! Nice to work with you on Cloud area.  Please select from the following options what you would like to be discussed: ";
                buttonName = "Request a new Quota andButton Query project quota andButton View my ticket";
                break;
            case 'request a new quota':
                message = "There are two ways to request a new quota: ";
                buttonName = "Click here to fullfill a form andButton Chat with me, I'll create a ticket for you";
                break;
            case "chat with me, i'll create a ticket for you":
                buttonName = "NA";
                message = "Please input your project";
                command = "project name";
                break;
            case "project name":
                buttonName = "NA";
                message = "Please input your full name";
                command = "full name";
                break;
            case "full name":
                buttonName = "NA";
                message = "Please input your badge ID";
                command = "badge ID";
                break;
            case "badge id":
                buttonName = "NA";
                message = "Please input your phone number";
                command = "phone number";
                break;
            case "phone number":
                buttonName = "NA";
                message = "Please input your email address";
                command = "email address";
                break;
            case "email address":
                buttonName = "NA";
                message = "Please input the email of your manager";
                command = "manager's email address";
                break;
            case "manager's email address":
                buttonName = "NA";
                message = "How many instances would you like to use?";
                command = "instance";
                break;
            case "instance":
                buttonName = "NA";
                message = "How many CPU would you like to use?";
                command = "CPU";
                break;
            case "cpu":
                buttonName = "NA";
                message = "How many RAM (MB) would you like to use?";
                command = "RAM";
                break;
            case "ram":
                buttonName = "NA";
                message = "Please input the HDD (GB) for your instance";
                command = "HDD";
                break;
            case "hdd":
                buttonName = "NA";
                message = "How many days would you like to use to keep your quota";
                command = "OK_life time";
                break;
            case "ok_life time":
                buttonName = "NA";
                message = "Please confirm the data you are using to request a new quota <br>";
                Object.keys(user_data).forEach(function(key) {
                    message = message + "<b>" + key.replace("OK_", "") + " : </b>" + " " + user_data[key] + "<br>";
                });
                message = message + "Please type <b> CONFIRM </b> to confirm!";
                break;
            case "confirm":
                console.log("Previous Step: " + Object.keys(user_data));
                switch (step) {
                    case "confirm":
                        createNewTicket(user_data, function(ticket_id) {
                            console.log("Ticket ID : " + ticket_id);
                            message = "Your ticket ID is "+ ticket_id  + ". Please click on <a href='http://11.11.254.69/tracking/ticket.php?id=" + ticket_id + "' target='_blank'>"+ "HERE" + " </a> to view your ticket ";
                            previous_step = "";
                            buttonName = "NA";
                            console.log("Send message: " + message);
                            console.log("MESSAGE TYPE: " + typeof message);
                            cb ({'buttonName' :  buttonName, 'message' : message, 'command' : command }, sessionID, cb1);
                        });
                        break;
                    default:
                        buttonName = "NA";
                        message = "NA";
                        break;
                }
                break;
            case "click here to fullfill a form":
                buttonName = "NA";
                message = "<a href=\'http://11.11.254.69:3000/cloud/register' target='_blank'> Click here to create a new request quota </a>";
                break;
                //PART FOR SMART TALK:
            case "user need to create quota":
                message = "In order to create a new VM, please select one of the following options: ";
                buttonName = "Click here to fullfill a form andButton Chat with me, I'll create a ticket for you";
                break;
            case "clear_cloud":
                message = "Hi! Nice to work with you on Cloud area.  Please select from the following options what you would like to be discussed: ";
                buttonName = "Request a new Quota andButton Query project quota andButton View my ticket";
                break;
            default:
                message = "I didn't catch you, could you type another words?";
                buttonName = "NA";
                break;
        }
                console.log("MESSAGE TYPE: " + typeof message);
                console.log("Message to return: " + message);
                while (typeof message !== "undefined") {
                    if (typeof cb !== "undefined"){
                        cb({'buttonName' :  buttonName, 'message' : message, 'command' : command }, sessionID, cb1);
                    }
                    return {'buttonName' :  buttonName, 'message' : message, 'command' : command };
                   break;
               } 
    };
//};
exports.cloudTopic = cloudTopic;

function createNewTicket(user_data, cb) {
    var ticket_id = "";
    console.log("project : " + user_data['project name']);
    var createTicketArgs = {
        uri: 'http://' + "11.11.254.69" + ':3000/cloud/register',
        method: 'POST',
        qs: {
            key: "ABC"
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "project": user_data['project name'],
            "full_name": user_data['full name'],
            "bage_id": user_data['badge ID'],
            "email": user_data['email address'],
            "phone": user_data['phone number'],
            "pm_email": user_data["manager's email address"],
            "life_time": user_data['OK_life time'],
            "instance": user_data['instance'],
            "cpu": user_data['CPU'],
            "ram": user_data['RAM'],
            "hdd": user_data['HDD'],
            "note": "Create by BOT",
            "group_image": {}
        })
    };

			RequestPromise(createTicketArgs).then(function(res){				
				try {
					console.log('Request response:' + res);
				} catch (err) {
					console.log('Create Group - Can not parse the content of request. Error: '+ err + '. Request response:' + res + '. Request command:' + JSON.stringify(createTicketArgs)); 
					return false;
				}
			    var getTicketArgs = {
                    uri: 'http://' + "11.11.254.69" + ':3000/cloud/ticketId/' + user_data['full name'],
                    method: 'GET',
                    qs: { },
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                };
                RequestPromise(getTicketArgs).then(function(res){				
                    try {
                        ticket_id = JSON.parse(res)[0].id;
                        cb(ticket_id);
                        console.log('ticket ID :' +ticket_id);
                    } catch (err) {
                        console.log('Create Group - Can not parse the content of request. Error: '+ err + '. Request response:' + res + '. Request command:' + JSON.stringify(getTicketArgs)); 
                        return false;
                    }
                });
                console.log('ticket ID :' +ticket_id);
			});
}

//Query ticket by userName

var queryTicketByUsername = function(user_data, cb) {
    console.log("project : " + user_data['full name']);
    var ticket_id = "";
    var getTicketArgs = {
        uri: 'http://' + "11.11.254.69" + ':3000/cloud/ticketId/' + user_data['full name'],
        method: 'GET',
        qs: {},
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };

    RequestPromise(getTicketArgs).then(function(res) {
        try {
            console.log('Request response:' + res[0].id);
            ticket_id = res[0].id;
        } catch (err) {
            console.log('Create Group - Can not parse the content of request. Error: ' + err + '. Request response:' + res + '. Request command:' + JSON.stringify(getTicketArgs));
            return false;
        }
    });
    cb(ticket_id);
}