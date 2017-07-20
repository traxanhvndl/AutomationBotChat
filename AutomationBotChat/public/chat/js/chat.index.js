var $messages = $('.messages-content'),
    d, m, s,
    h = new Date().getHours(),
    i = 0,
    weekindex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

$(window).load(function() {
    $messages.mCustomScrollbar();
    setTimeout(function() {}, 50);
});

function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
        scrollInertia: 10,
        timeout: 0
    });

}

function checkWeekDay(index) {
    if (index == weekindex.length) {
        return weekindex[0];
    }
    return weekindex[index];
}

function setDate(opt) {
    d = new Date();
    if (h != d.getHours()) {
        wd = d.getDay();
        D = d.getDate();
        M = d.getMonth() + 1;
        h = d.getHours();
        m = d.getMinutes();
        var time = checkWeekDay(wd) + ' ' + convertTime(D) + '/' + convertTime(M) + ' ' + convertTime(h) + ':' + convertTime(m);
        $('<div class="split-timestamp"><span>' + time + '</span></div>').insertAfter($('#chat-content .message:last'));
    } else {
        h = d.getHours();
        m = d.getMinutes();
        if (opt == 'tip') {
            $('#chat-help .message .timestamp').html(convertTime(h) + ':' + convertTime(m));
        } else {
            $('<div class="timestamp">' + convertTime(h) + ':' + convertTime(m) + '</div>').appendTo($('#chat-content .message:last'));
        };
    }
}

function convertTime(time) {
    if (time < 10) {
        time = "0" + time;
    }
    return time;
}

function insertMessage(msg) {
    if (!msg) {
        msg = $('.message-input').val();
        if ($.trim(msg) == '') {
            return false;
        };
    };
    socket.emit('send_message_bot', msg, "BOT");
    $('<div class="message message-personal"><div class="conversation">' + msg + '</div><figure class="avatar avatar-personal" style="float: right;"><img src="images/robot_2.png"></figure></div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    $('.message-input').val(null);
    updateScrollbar();
}

$('.message-submit').click(function() {
    insertMessage();
});

$(window).on('keydown', function(e) {
    if (e.which == 13) {
        insertMessage();
        return false;
    }
})

function newReceiveMessage(message, items) {
    if (!message || message == 'NA') {
        message = '';
    };
    if (!items || items == 'NA') {
        item = '';
    } else {
        if (message) {
            var item = '<div class="item-container">' + items + '</div>';
        } else {
            var item = '<div class="item-container odd">' + items + '</div>';
        }
    }
    if ($('.message-input').val() != '') {
        return false;
    }
    $('<div class="message loading new"><figure class="avatar"><img src="images/robot_1.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
    updateScrollbar();

    setTimeout(function() {
        $('.message.loading').remove();
        $('<div class="message new"><figure class="avatar"><img src="images/robot_1.png" /></figure><div class="conversation">' + message + '</div>' + item + '</div>').appendTo($('.mCSB_container')).addClass('new');
        setDate();
        updateScrollbar();
        i++;
    }, 10 + (Math.random() * 20) * 50);
    updateScrollbar();

}

function newReceiveTip(tiptitle, items) {
    if (!tiptitle || tiptitle == 'NA') {
        return false;
    } else if (!items || items == 'NA') {
        return false;
    } else {
        $('.chat-help-server').html('');
        var helpcontent = '<div class="message message-personal"><div class="conversation tip-title">' + tiptitle + '</div><div class="item-container tip-content">' + items + '</div><div class="timestamp"></div><figure class="avatar avatar-personal"><img src="images/robot_1.png"></figure></div>';
        $('.chat-help-server').append(helpcontent);
        // $('div.tip-title').html(tiptitle);
        // $('div.tip-content').html(items);
        setDate('tip');
    }
};