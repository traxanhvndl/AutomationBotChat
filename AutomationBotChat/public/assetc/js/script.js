var $ = jQuery.noConflict();
// Progress Bar
var socket = io.connect();
$(document).ready(function($) {
    "use strict";
    var username;
    $('.skill-shortcode').appear(function() {
        $('.progress').each(function() {
            $('.progress-bar').css('width', function() { return ($(this).attr('data-percentage') + '%') });
        });
    }, { accY: -100 });
    $('.chat-init').click(function(ev) {
        var topic = $(this).attr('name');
        $('#username-content').attr('topic', topic);
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
        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();
            submit();
            return false;
        };
        if ($('#nick_name').val() != "") {
            $('#clear').show();
        } else {
            $('#clear').hide();
        };
    });

    $('#cloud-modal .clean-chat').click(function(ev) {
        var display_name = username;
        var nickname = display_name.replace(/ /g, '_');
        $('#mCSB_1_container').children().remove();
        var topic = $('#username-content').attr('topic');
        console.log('clear_' + topic);
        socket.emit('send_message_bot', 'clear_' + topic, $('#username-content').attr('username'));
    });

    socket.on('new_message', function(data) {
        console.log(data)
        newReceiveMessage(data.msg, data.items);
    });
    // $('.form-inner .messages').click(function(ev) {
    //     $('.message-input').focus();
    // });

    function submit() {
        console.log('new user')
        var display_name = $('#nick_name').val();
        username = display_name;
        var nickname = display_name.replace(/ /g, '_');
        if (nickname == '') {
            nickname = 'Anonymous';
            display_name = nickname;
        };
        $('#username-content').attr('username', nickname);
        socket.emit('new_user', nickname, function(data) {
            if (data) {
                $('#nick_wrap').hide();
                $('.chat-user h1').text(display_name);
                $('.chat-user h1').attr({
                    'id': 'chat-current-user-' + nickname,
                    'name': nickname
                });
                $('.message-input').focus();
                $('div#clean-chat').show();
                // newReceiveMessage('Hi <b>' + display_name + '</b>, I am <b>' + $('.chat-server h1').text() + '</b> ! </br>We are going to talk about topic <b>' + 'Cloud' + '</b>');
                var topic = capitalize($('#username-content').attr('topic'));
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
    console.log('send bot msg: ' + topic + ' ' + $('#username-content').attr('username'));
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