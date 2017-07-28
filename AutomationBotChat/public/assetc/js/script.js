var $ = jQuery.noConflict();
// Progress Bar
var socket = io.connect();
var support = ['chatadmin'];
$(document).ready(function($) {
    "use strict";
    var username;
    $('.skill-shortcode').appear(function() {
        $('.progress').each(function() {
            $('.progress-bar').css('width', function() { return ($(this).attr('data-percentage') + '%') });
        });
    }, { accY: -100 });
    $('.chat-init').click(function(ev) {
        var cur_topic = $('#username-content').attr('topic');
        var topic = $(this).attr('name');
        var useractive = $('#username-content').attr('useractive');
        $('#username-content').attr('topic', topic);
        if (cur_topic != topic && useractive == 'active') {
            clearChat();
        };
        // $('#' + topic + '-modal').find('#nick_name').focus();
        // alert($('#' + topic + '-modal').find('#nick_name').attr('id'))
    });

    $('.modal-content').click(function() {
        $(this).find('#nick_name').focus();
    });
    $('#clear').click(function() {
        $('#nick_name').val('');
    });
    $('#nick_name').on('focus keydown', function(e) {
        var topic = capitalize($('#username-content').attr('topic')).trim();
        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();
            submit(topic);
            return false;
        };
        if ($('#nick_name').val() != "") {
            $('#clear').show();
        } else {
            $('#clear').hide();
        };
    });

    $('#cloud-modal .clean-chat').click(function(ev) {
        clearChat();
    });

    $('#cloud-modal .popup-chat-help').click(function(ev) {
        $(this).find('.fa').each(function() {
            if ($(this).hasClass('fa-chevron-circle-right')) {
                closeChatHelp();
                $(this).attr('class', 'fa fa-chevron-circle-left');
            } else {
                openChatHelp();
                $(this).attr('class', 'fa fa-chevron-circle-right');
            };
        });
    });

    socket.on('new_message', function(data) {
        // console.log(data)
        var msg = data.msg;
        var tip_title = new RegExp(data.tip_title, "gi");
        if (data.title && data.tip_title != "NA") {
            msg = msg.replace(tip_title, '<span class="highlight">' + data.tip_title + '</span>');
        };
        newReceiveMessage(msg, data.items);
        newReceiveTip(capitalize(data.tip_title), data.tip);
    });
    // $('.form-inner .messages').click(function(ev) {
    //     $('.message-input').focus();
    // });

    function closeChatHelp() {
        $('#chat-help').hide();
        $('#chat-content').css({
            'width': '100%',
            'border-radius': '20px'
        });
    }

    function openChatHelp() {
        $('#chat-help').show();
        $('#chat-content').css({
            'width': '75%',
            'border-bottom-right-radius': '0px',
            'border-top-right-radius': '0px'
        });
    }

    function submit(topic) {
        // console.log('new user')
        var display_name = $('#nick_name').val();
        username = display_name;
        var nickname = display_name.replace(/ /g, '_');
        if (nickname == '') {
            nickname = 'Anonymous';
            display_name = nickname;
        };
        socket.emit('new_user', nickname, function(data) {
            if (data && nickname != "admin") {
                $('#nick_wrap').hide();
                $('.chat-user h1').text(display_name);
                $('.chat-user h1').attr({
                    'id': 'chat-current-user-' + nickname,
                    'name': nickname
                });
                $('.message-input').focus();
                $('#clean-chat').show();
                $('#popup-chat-help').show();
                // newReceiveMessage('Hi <b>' + display_name + '</b>, I am <b>' + $('.chat-server h1').text() + '</b> ! </br>We are going to talk about topic <b>' + 'Cloud' + '</b>');
                $('#username-content').attr('username', nickname);
                $('#username-content').attr('useractive', 'active');
                // console.log('ahihi : ' + topic);
                postopic(topic);
            } else {
                $('#nick_erorr').html('Sorry ! Nick name <b><i>"' + display_name + '"</b></i> is used, Please retry !');
            }
        });
        $('#nick_name').val('');
        return false;
    };
});

function postopic(topic) {
    // console.log('send bot msg: ' + topic + ':' + $('#username-content').attr('username'));
    // console.log(topic)
    socket.emit('send_message_bot', topic, $('#username-content').attr('username'));
};

function clickOnRes(text) {
    // insertMessage(text)
    socket.emit('send_message_bot', text, $('#username-content').attr('username'));
    $(document).ready(function() {
        $(".button5").attr('disabled', 'disabled');
    });
    updateScrollbar();
};

function capitalize(str) {
    strVal = '';
    str = str.split(' ');
    for (var chr = 0; chr < str.length; chr++) {
        strVal += str[chr].substring(0, 1).toUpperCase() + str[chr].substring(1, str[chr].length) + ' ';
    }
    return strVal;
}

function clearChat() {
    var username = $('#username-content').attr('username');
    var display_name = username;
    var nickname = display_name.replace(/ /g, '_');
    $('#mCSB_1_container').children().remove();
    var topic = $('#username-content').attr('topic');
    // console.log('clear_' + topic);
    if ($.inArray(topic, support) > 0) {
        socket.emit('send_message_bot', topic, $('#username-content').attr('username'), 'admin');
    } else {
        socket.emit('send_message_bot', 'clear_' + topic, $('#username-content').attr('username'));
    };
}