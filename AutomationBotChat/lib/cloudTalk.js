//talking about cloud topic
const RequestPromise = require('request-promise');
module.exports = {
    cloudTopic: function(step, user_data) {
        var ipaddr = require("ip");
        var buttonName;
        var message;
        var command;
        var previous_step;
        switch (step) {
            case 'Cloud': 
                message = "Hi! Nice to work with you on Cloud area, I can help you to create a new quota or provide the information of your quota and project. <br> Please select the following function or tell me your query ";
                buttonName = "Request a new Quota andButton Query project quota andButton View my ticket";
                break;
            case 'Request a new Quota':
                message = "There are two ways to request a new quota: ";
                buttonName = "Click here to fullfill a form andButton Chat with me, I'll create a ticket for you";
                break;
            case "Chat with me, I'll create a ticket for you":
                buttonName = "NA";
                message = "Please provide your project";
                command = "project name";
                break;
            case "project name":
                buttonName = "NA";
                message = "Please provide your full name";
                command = "full name";
                break;
            case "full name":
                buttonName = "NA";
                message = "Please provide your badge ID";
                command = "badge ID";
                break;
            case "badge ID":
                buttonName = "NA";
                message = "Please provide your phone number";
                command = "phone number";
                break;
            case "phone number":
                buttonName = "NA";
                message = "Please provide your email address";
                command = "email address";
                break;               
            case "email address":
                buttonName = "NA";
                message = "Please provide the email of your manager";
                command = "manager's email address";
                break;
            case "manager's email address":
                buttonName = "NA";
                message = "How many instances do you need?";
                command = "instance";
                break;
            case "instance":
                buttonName = "NA";
                message = "How many CPU do you need?";
                command = "CPU";
                break;
            case "CPU":
                buttonName = "NA";
                message = "How many RAM do you need? please provide in MB";
                command = "RAM";
                break;
            case "RAM":
                buttonName = "NA";
                message = "Please provide the HDD for your instance in GB";
                command = "HDD";
                break;
            case "HDD":
                buttonName = "NA";
                message = "How many days do you need to keep your quota";
                command = "OK_life time";
                break;
            case "OK_life time":
                buttonName = "NA";
                message = "Please confirm the data you are using to request a new quota <br>";
                Object.keys(user_data).forEach(function(key){
                    message = message + "<b>" + key.replace("OK_","") + " : </b>" + " " + user_data[key] + "<br>";
                });
                message = message + "Please type <b> OK </b> to confirm!";
                break;
            case "OK":
                console.log("Previous Step: " + Object.keys(user_data));
                switch (step) {
                    case "OK":
                        createNewTicket(user_data);
                        previous_step = "";
                        buttonName = "NA";
                        message = "Your ticket has been created!";
                        break;
                
                    default:
                        buttonName = "NA";
                        message = "NA";
                        break;
                }
                break;
            case "Click here to fullfill a form":
                buttonName = "NA";
                message = "<a href=\'http://11.11.254.69:3000/cloud/register' target='_blank'> Click here to create a new request quota </a>";
                break;
            //PART FOR SMART TALK:
            case "USER NEED TO CREATE QUOTA":
                message = "To create a new VM on cloud, firstly, you need a new quota. There are two ways to create a new quota: ";
                buttonName = "Click here to complete a form andButton Chat with me, I'll create a from for you";
                break;
            default:
                buttonName = "Unhandle";
                break;
        }
        return {'buttonName' :  buttonName, 'message' : message, 'command' : command };
    }
};

function createNewTicket(user_data) {
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
                  "bade_id": user_data['badge ID'],
                  "email" : user_data['email address'],
                  "phone": user_data['phone number'],
                  "pm_email": user_data["manager's email address"],
                  "life_time" : user_data['OK_life time'],
                  "instance" : user_data['instance'],
                  "cpu" : user_data['CPU'],
                  "ram" : user_data['RAM'],
                  "hdd" : user_data['HDD'],
                  "note" : "Create by BOT",
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
				//console.log('Create Device - Create device successfully with deviceId:' + deviceId + ' . device_ID:' + device_id); 
				//me._logging.logInfo('Create Device - Create device successfully with deviceId:' + deviceId + ' . device_ID:' + device_id); 
			});
}
