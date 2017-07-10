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
        $('#nick_name').focus();
    });

    $('.login.page').click(function() {
        $('#nick_name').focus();
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
        socket.emit('send_message_bot', 'Cloud', $('#username-content').attr('name'));
    });

    socket.on('new_message', function(data) {
        console.log(data)
        newReceiveMessage(data.msg, data.items);
    });
    $('.form-inner .messages').click(function(ev) {
        $('.message-input').focus();
    });

    function submit() {
        console.log('new user')
        var display_name = $('#nick_name').val();
        username = display_name;
        var nickname = display_name.replace(/ /g, '_');
        if (nickname == '') {
            nickname = 'Anonymous';
            display_name = nickname;
            $('#username-content').attr('name', nickname);
        };
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
                postopic('Cloud');
            } else {
                $('#nick_erorr').html('Sorry ! Nick name <b><i>"' + display_name + '"</b></i> is used, Please retry !');
            }
        });
        $('#nick_name').val('');
        return false;
    };
});

function postopic(topic) {
    socket.emit('send_message_bot', topic, $('#username-content').attr('name'));
};

function clickOnRes(text) {
    socket.emit('send_message_bot', text, $('#username-content').attr('name'));
    $(document).ready(function() {
        $(".button5").attr('disabled', 'disabled');
    });
}