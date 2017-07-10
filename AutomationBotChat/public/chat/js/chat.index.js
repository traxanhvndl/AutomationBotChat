var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

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

function setDate() {
    d = new Date()
    if (m != d.getMinutes()) {
        m = d.getMinutes();
        $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    }
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
    }, 500 + (Math.random() * 10) * 500);

}