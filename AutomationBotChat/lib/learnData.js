//MY SQL
var  mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_talk'
});
module.exports = {
    learnFromUser: function(unknowMgs, message) {
        conn.query("UPDATE unknow_msg SET valid_mgs = '" + message + "' where message like '" + unknowMgs + "'", function(error,data) {
            if (error) {
                console.log("ERROR DB: " + error);
            }
        });
    }
}