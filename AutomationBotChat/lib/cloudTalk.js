//talking about cloud topic
module.exports = {
    cloudTopic: function(step, user_data) {
        var buttonName;
        var message;
        var command;
        var previous_step;
        switch (step) {
            case 'Cloud': 
                buttonName = "Request a new Quota andButton Query project quota andButton View my ticket";
                break;
            case 'Request a new Quota':
                buttonName = "Click here to complete a form andButton Chat with me, I'll create a from for you";
                break;
            case "Chat with me, I'll create a from for you":
                buttonName = "NA";
                message = "Please provide your project";
                command = "project name";
                break;
            case "project name":
                buttonName = "NA";
                message = "Please provide your phone number";
                command = "phone number";
                break;
            case "phone number":
                buttonName = "NA";
                message = "Please provide your email address";
                command = "OK_email address";
                break;
            case "OK_email address":
                previous_step = "OK_email address";
                buttonName = "NA";
                message = "Please confirm the data you are using to request a new quota <br>";
                Object.keys(user_data).forEach(function(key){
                    message = message + "<b>" + key.replace("OK_","") + " : </b>" + " " + user_data[key] + "<br>";
                });
                message = message + "Please type <b> OK </b> to confirm!";
                break;
            case "Click here to complete a form":
                buttonName = "NA";
                message = "<a href=\"http://www.google.com.vn\"> HERE </a>";
                break;
            default:
                buttonName = "Unhandle";
                break;
        }
        return {'buttonName' :  buttonName, 'message' : message, 'command' : command };
    }
};
