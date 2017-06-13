$(document).ready(function() {
    // $('.login.page').click(function() {
    //     $('#nick_name').focus();
    // });
    // $('#clear').click(function() {
    //     $('#nick_name').val('');
    // });
    // $('#nick_name').on('focus keydown', function() {
    //     if ($('#nick_name').val() != "") {
    //         $('#clear').show();
    //     } else {
    //         $('#clear').hide();
    //     }
    // })
    // $('#set_nick').submit(function() {
    //     var nickname = $('#nick_name').val();
    //     socket.emit('new_user', nickname, function(data) {
    //         if (data) {
    //             $('#nick_wrap').hide();
    //             $('div#chat').attr('data-current-user', nickname);
    //             $('.chat_box').show();
    //             $('span#chat-title').text(nickname);
    //             $('h2.chat-header').attr({
    //                 'id': 'chat-current-user-' + nickname,
    //                 'name': nickname
    //             });
    //         } else {
    //             $('#nick_erorr').html('Oops ! Nick name <b>' + nickname + '</b> is used, Please retry !');
    //         }
    //     });
    //     $('#nick_name').val('');
    //     return false;
    // });
    // socket.on('user_names', function(data) {
    //     var html = '<strong>Social</strong>';
    //     for (i = 0; i < data.length; i++) {
    //         html += '<a href="#" id="chat-user-' + data[i] + '" data-conversation-history="#chat_history_' + data[i] + '"><span class="user-status is-online"></span> <em>' + data[i] + '</em></a>'
    //     }
    //     $('#group-social').html(html);
    // });
    // socket.on('new_message', function(data) {
    //     console.log(data)
    //     console.log('Gui tu ' + data.sendfrom);
    //     console.log('Gui toi ' + data.sendto);
    //     console.log($('ul#chat_history_' + data.sendfrom).length)
    //     if ($('ul#chat_history_' + data.sendfrom).length > 0) {
    //         console.log('existed');
    //     } else {
    //         console.log('not existed');
    //         $('<ul class="chat-history" id="chat_history_' + data.sendfrom + '"></ul>').insertBefore('ul.chat-history');
    //     }
    //     $('ul#chat_history_' + data.sendfrom).append('<li class="opponent unread odd"><span class="user">' + data.sendfrom + '</span><p>' + data.msg + '</p><span class="time">' + data.sendfrom + '</span></li>');
    // });

});