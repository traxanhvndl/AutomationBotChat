function processDataCloud(extraData, userData, cb) {
    var ram = extraData.ram;
    var hdd = extraData.hdd;
    var cpu = extraData.cpu;
    var message = "Your request missing infomation, please provide";
    var expectedData = " ";

    //init data

    userData['project name'] = 'Bot test';
    userData['full name'] = 'Bot name';
    userData['badge ID'] = '1307112';
    userData['phone number'] = '01225176167';
    userData['email address'] = 'bot@tma.com.vn';
    userData["manager's email address"] = 'BotPM@tma.com.vn';
    userData['instance'] = '1';
    userData['OK_life time'] = '30';

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