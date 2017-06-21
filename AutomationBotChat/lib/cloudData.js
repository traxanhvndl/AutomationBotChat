module.exports = {
    confirmation: function(msg, user_data) {
        var message = "";
        switch (msg) {
            case "OK_email address":
                message = "Please confirm the data you are using to request a new quota <br>";
                Object.keys(user_data).forEach(function(key){
                    message = message + "<b>" + key.replace("OK_","") + " : </b>" + " " + user_data[key] + "<br>";
                });
                break;
            default:
                break;
        }
        return message;
    }
};