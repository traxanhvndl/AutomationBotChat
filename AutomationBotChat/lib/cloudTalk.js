//talking about cloud topic
const RequestPromise = require('request-promise');
//module.exports = {
   //cloudTopic: function(step, user_data) {
       function cloudTopic(step, user_data, sessionID, cb1, cb) {
        var ipaddr = require("ip");
        var buttonName;
        var message;
        var command;
        var tip;
        var previous_step;
        switch (step.toLowerCase()) {
            case 'cloud':
                message = "Hi! Nice to work with you on Cloud area.  Please select from the following options what you would like to be discussed: ";
                buttonName = "Request a new Quota andButton Query project quota andButton View my ticket";
                tip_title = "NA";
                tip = "NA";
                break;
            case 'cancel':
                message = "Ok! Do you have any query?";
                buttonName = "NA";
                tip_title = "NA";
                tip = "NA";
                break;
            case 'request a new quota':
                message = "There are two ways to request a new quota: <br> <a href=\'http://11.11.254.69:3000/cloud/register' target='_blank'> Click here to fullfill a form </a>";
                buttonName = "Chat with me, I'll create a ticket for you";
                tip_title = "NA";
                tip = "NA";
                break;
            case "chat with me, i'll create a ticket for you":
                buttonName = "NA";
                message = "Please input your project";
                command = "project name";
                tip_title = "Project Name:";
                tip = "We need this to keep track of the which project are using cloud resource. After cloud is create, this is username you need to access cloud. ";
                break;
            case "project name":
                buttonName = "NA";
                message = "Please input your full name.";
                command = "full name";
                tip_title = "Full Name:";
                tip = "We need this because we know to know who raise this ticket to request a new cloud.";     
                break;
            case "full name":
                buttonName = "NA";
                message = "Please input your badge ID";
                command = "badge ID";
                tip_title = "Badge ID:";
                tip = " We need this because we know to know who raise this ticket to request a new cloud.";                                       
                break;
            case "badge id":
                buttonName = "NA";
                message = "Please input your phone number";
                command = "phone number";
                tip_title = "Phone: ";
                tip = "We need this because we may need a method to contact you in case we need more information.";
                break;
            case "phone number":
                buttonName = "NA";
                message = "Please input your email address";
                command = "email address";
                tip_title = "Email: ";
                tip = "We need this because we may need a method to contact you in case we need more information.";
                break;
            case "email address":
                buttonName = "NA";
                message = "Please input the email of your manager";
                command = "manager's email address";
                tip_title = "PM mail: ";
                tip = "We need this because we will inform your PM about this request.";
                break;
            case "manager's email address":
                buttonName = "NA";
                message = "How many instances would you like to use?";
                command = "instance";
                tip_title = "Instance: ";
                tip = "An instance is virtual machine on cloud environment. We need this information because we want to know how many virtual machine you want to deploy on cloud environment.";
                break;
            case "instance":
                buttonName = "NA";
                message = "How many CPU would you like to use?";
                command = "CPU";
                tip_title = "CPU: ";
                tip = "Central Processing Unit (CPU) is the basic resource of a machine. We need this information because we want to know how many core of CPU in total you want to deploy on cloud environment.";
                break;
            case "cpu":
                buttonName = "NA";
                message = "How many RAM (MB) would you like to use?";
                command = "RAM";
                tip_title = "RAM: ";
                tip = "Random-access Memory (RAM) is the basic resource of a machine. We need this information because we want to know how many memory in total you want to deploy on cloud environment.";
                break;
            case "ram":
                buttonName = "NA";
                message = "Please input the HDD (GB) for your instance";
                command = "HDD";
                tip_title = "HDD: ";
                tip = "HDD is the data storage. This is the basic resource of a machine. We need this information because we want to know how many data storage in total you want to deploy on cloud environment.";
                break;
            case "hdd":
                buttonName = "NA";
                message = "How many days would you like to use to keep your quota";
                command = "OK_life time";
                tip_title = "Life-time: ";
                tip = "This is the period of time for your quota to expired. We need this information because we want to keep track of cloud resource.";
                break;
            case "ok_life time":
                buttonName = "NA";
                message = "Please confirm the data you are using to request a new quota <br>";
                Object.keys(user_data).forEach(function(key) {
                    message = message + "<b>" + key.replace("OK_", "") + " : </b>" + " " + user_data[key] + "<br>";
                });
                message = message + "Please type <b> CONFIRM </b> to confirm!";
                tip_title = "NA";
                tip = "NA";
                break;
            case "confirm":
                switch (step) {
                    case "confirm":
                        createNewTicket(user_data, function(ticket_id) {
                            console.log("Ticket ID : " + ticket_id);
                            message = "Your ticket ID is "+ ticket_id  + ". Please click on <a href='http://11.11.254.69/tracking/ticket.php?id=" + ticket_id + "' target='_blank'>"+ "HERE" + " </a> to view your ticket ";
                            previous_step = "";
                            buttonName = "NA";
                            tip_title = "NA";
                            tip = "NA";
                            console.log("Send message: " + message);
                            console.log("MESSAGE TYPE: " + typeof message);
                            cb ({'buttonName' :  buttonName, 'message' : message, 'command' : command , 'tip' : tip}, sessionID, cb1);
                        });
                        break;
                    default:
                        buttonName = "NA";
                        message = "NA";
                        tip_title = "NA";
                        tip = "NA";
                        break;
                }
                break;
            case "click here to fullfill a form":
                buttonName = "NA";
                message = "<a href=\'http://11.11.254.69:3000/cloud/register' target='_blank'> Click here to create a new request quota </a>";
                tip_title = "NA";
                tip = "NA";
                break;
            case "view my ticket":
                message = "Please input your ticket ID";
                buttonName = "NA";
                command = "query_ticket";
                tip_title = "NA";
                tip = "NA";
                break;
            case "query_ticket":
                if (user_data['query_ticket'].toLowerCase() != "cancel") {
                    validateTicket(user_data['query_ticket'], function(Imessage) {
                            console.log("I-MESSGAE: " + Imessage);
                            previous_step = "";
                            buttonName = "NA";
                            if (Imessage == "invalid") {
                                message = "Your ticket ID is invalid, please provide another ticket ID.";
                                buttonName = "Cancel";
                                command = "query_ticket";
                                tip_title = "NA";                    
                                tip = "NA";
                            }
                            else {
                                message = "Please click <a href='http://11.11.254.69/tracking/ticket.php?id=" + Imessage + "' target='_blank'>"+ "HERE" + " </a> to view your ticket detail ";
                            }
                            cb ({'buttonName' :  buttonName, 'message' : message, 'command' : command, 'tip_title': tip_title, 'tip': tip }, sessionID, cb1);
                    })
                }
                else {
                    message = "Ok! Do you have any query?";
                    buttonName = "NA";
                    tip_title = "NA";
                    tip = "NA";
                }
                break;
                //PART FOR SMART TALK:
            case "user need to create quota":
                message = "In order to create a new VM, please select one of the following options: ";
                buttonName = "Click here to fullfill a form andButton Chat with me, I'll create a ticket for you";
                tip_title = "NA";
                tip = "NA";
                break;
            case "clear_cloud":
                message = "Hi! Nice to work with you on Cloud area.  Please select from the following options what you would like to be discussed: ";
                buttonName = "Request a new Quota andButton Query project quota andButton View my ticket";
                tip_title = "NA";
                tip = "NA";
                break;
            case "user need to query quota":
                message = "Look like you need to check your ticket, please input your ticket ID";
                buttonName = "NA";
                command = "query_ticket";
                tip_title = "NA";
                tip = "NA";
                break;
            default:
                message = "I didn't catch you, could you type another words?";
                buttonName = "NA";
                tip_title = "NA";
                tip = "NA";
                break;
        }
                console.log("MESSAGE TYPE: " + typeof message);
                console.log("Message to return: " + message);
                while (typeof message !== "undefined") {
                    if (typeof cb !== "undefined"){
                        cb({'buttonName' :  buttonName, 'message' : message, 'command' : command,'tip_title': tip_title, 'tip' : tip }, sessionID, cb1);
                    }
                    return {'buttonName' :  buttonName, 'message' : message, 'command' : command,'tip_title': tip_title, 'tip' : tip };
                   break;
               } 
    };
//};
exports.cloudTopic = cloudTopic;

function createNewTicket(user_data, cb) {
    var ticket_id = "";
    console.log("project : " + user_data['project name']);
    var createTicketArgs = {
        uri: 'http://' + "11.11.254.69" + ':3000/cloud/BOTregister',
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
                    uri: 'http://' + "11.11.254.69" + ':3000/cloud/ticket/fullName/' + user_data['full name'],
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

function validateTicket(ticketID, cb) {
    var message = "";
    console.log("QUERY TICKET ID : " + ticketID);
    var getTicketArgs = {
        uri: 'http://' + "11.11.254.69" + ':3000/cloud/ticket/ticketID/' + ticketID,
        method: 'GET',
        qs: {},
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };
    RequestPromise(getTicketArgs).then(function(res) {
        try {
            console.log('Request response:' + res);
            message = JSON.parse(res)[0].id;
            console.log("MESSAGE - TO - RETURN: " + message);
            cb(message);
        } catch (err) {
            console.log('Create Group - Can not parse the content of request. Error: ' + err + '. Request response:' + res + '. Request command:' + JSON.stringify(getTicketArgs));
            cd("There is something wrong, please try again later");
            return false;
        }
    });
    
}