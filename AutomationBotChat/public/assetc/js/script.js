var $ = jQuery.noConflict();
// Progress Bar
var socket = io.connect();
$(document).ready(function($) {
    "use strict";
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
        }
        if ($('#nick_name').val() != "") {
            $('#clear').show();
        } else {
            $('#clear').hide();
        }
    });

    function submit() {
        console.log('new user')
        var display_name = $('#nick_name').val();
        var nickname = display_name.replace(/ /g, '_');
        socket.emit('new_user', nickname, display_name, function(data) {
            if (data) {
                $('#nick_wrap').hide();
                // $('div#chat').attr('data-current-user', nickname);
                // $('.chat_box').show();
                $('.chat-user h1').text(display_name);
                $('.chat-user h1').attr({
                    'id': 'chat-current-user-' + nickname,
                    'name': nickname
                });
            } else {
                $('#nick_erorr').html('Sorry ! Nick name <b><i>"' + display_name + '"</b></i> is used, Please retry !');
            }
        });
        $('#nick_name').val('');
        newReceiveMessage('Hi ' + display_name + ', I\'m ' + $('.chat-server h1').text() + ', What can I do for you ?');
        return false;
    };
});