module.exports = {
    createNewUserData: function(user_list,sessionID) {
        var tmp = {};
        if (typeof user_list[sessionID] == undefined ) {
            user_list[sessionID] = tmp;
        }
        return user_list;
    }
};