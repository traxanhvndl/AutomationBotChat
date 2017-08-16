function processDataCloud(extraData, userData, cb) {
    var ram = extraData.ram;
    var hdd = extraData.hdd;
    var cpu = extraData.cpu;
    var message = "Your request missing infomation, please provide";
    var expectedData = " ";

    //init data

    if (typeof userData['project name'] == 'undefined') userData['project name'] = 'Bot test';
    if (typeof userData['full name'] == 'undefined') userData['full name'] = 'Bot name';
    if (typeof userData['badge ID'] == 'undefined') userData['badge ID'] = '1307112';
    if (typeof userData['phone number'] == 'undefined') userData['phone number'] = '01225176167';
    if (typeof userData['email address'] == 'undefined') userData['email address'] = 'bot@tma.com.vn';
    if (typeof userData["manager's email address"] == 'undefined') userData["manager's email address"] = 'BotPM@tma.com.vn';
    if (typeof userData['instance'] == 'undefined') userData['instance'] = '1';
    if (typeof userData['OK_life time'] == 'undefined') userData['OK_life time'] = '30';

    if (typeof ram != 'undefined' && ram != 'num') userData['RAM'] = ram;
    if (typeof hdd != 'undefined' && hdd != 'num') userData['HDD'] = hdd;
    if (typeof cpu != 'undefined' && cpu != 'num') userData['CPU'] = cpu;
    if (typeof userData['RAM'] == 'undefined') {
        message = message + ' RAM';
        expectedData = expectedData + ' RAM'
    };
    if (typeof userData['HDD'] == 'undefined') {
        message = message + ' HDD';
        expectedData = expectedData + ' HDD'
    };
    if (typeof userData['CPU'] == 'undefined') {
        message = message + ' CPU';
        expectedData = expectedData + ' CPU'
    };

    cb(userData, message, expectedData);

}


exports.handleExtracData_Cloud = processDataCloud;