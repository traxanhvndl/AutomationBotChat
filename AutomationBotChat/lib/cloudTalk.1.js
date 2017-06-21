//talking about cloud topic
module.exports = {
    cloudTopic: function(step) {
        var buttonName;
        var message;
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
                break;
            default:
                buttonName = "Eo Biet";
                break;
        }
        return {'buttonName' :  buttonName, 'message' : message };
    }
};