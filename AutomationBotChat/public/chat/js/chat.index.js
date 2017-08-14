var $messages = $('.messages-content'),
    d, m, s,
    h = new Date().getHours(),
    i = 0,
    weekindex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

$(window).load(function() {
    $messages.mCustomScrollbar();
    setTimeout(function() {}, 50);
});

/** Voice */
var langs = [
    ['Afrikaans', ['af-ZA']],
    ['Bahasa Indonesia', ['id-ID']],
    ['Bahasa Melayu', ['ms-MY']],
    ['Català', ['ca-ES']],
    ['Čeština', ['cs-CZ']],
    ['Deutsch', ['de-DE']],
    ['English', ['en-AU', 'Australia'],
        ['en-CA', 'Canada'],
        ['en-IN', 'India'],
        ['en-NZ', 'New Zealand'],
        ['en-ZA', 'South Africa'],
        ['en-GB', 'United Kingdom'],
        ['en-US', 'United States']
    ],
    ['Español', ['es-AR', 'Argentina'],
        ['es-BO', 'Bolivia'],
        ['es-CL', 'Chile'],
        ['es-CO', 'Colombia'],
        ['es-CR', 'Costa Rica'],
        ['es-EC', 'Ecuador'],
        ['es-SV', 'El Salvador'],
        ['es-ES', 'España'],
        ['es-US', 'Estados Unidos'],
        ['es-GT', 'Guatemala'],
        ['es-HN', 'Honduras'],
        ['es-MX', 'México'],
        ['es-NI', 'Nicaragua'],
        ['es-PA', 'Panamá'],
        ['es-PY', 'Paraguay'],
        ['es-PE', 'Perú'],
        ['es-PR', 'Puerto Rico'],
        ['es-DO', 'República Dominicana'],
        ['es-UY', 'Uruguay'],
        ['es-VE', 'Venezuela']
    ],
    ['Euskara', ['eu-ES']],
    ['Français', ['fr-FR']],
    ['Galego', ['gl-ES']],
    ['Hrvatski', ['hr_HR']],
    ['IsiZulu', ['zu-ZA']],
    ['Íslenska', ['is-IS']],
    ['Italiano', ['it-IT', 'Italia'],
        ['it-CH', 'Svizzera']
    ],
    ['Magyar', ['hu-HU']],
    ['Nederlands', ['nl-NL']],
    ['Norsk bokmål', ['nb-NO']],
    ['Polski', ['pl-PL']],
    ['Português', ['pt-BR', 'Brasil'],
        ['pt-PT', 'Portugal']
    ],
    ['Română', ['ro-RO']],
    ['Slovenčina', ['sk-SK']],
    ['Suomi', ['fi-FI']],
    ['Svenska', ['sv-SE']],
    ['Türkçe', ['tr-TR']],
    ['български', ['bg-BG']],
    ['Pусский', ['ru-RU']],
    ['Српски', ['sr-RS']],
    ['한국어', ['ko-KR']],
    ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
        ['cmn-Hans-HK', '普通话 (香港)'],
        ['cmn-Hant-TW', '中文 (台灣)'],
        ['yue-Hant-HK', '粵語 (香港)']
    ],
    ['日本語', ['ja-JP']],
    ['Lingua latīna', ['la']]
];

for (var i = 0; i < langs.length; i++) {
    select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 6;
updateCountry();
select_dialect.selectedIndex = 6;
showInfo('info_start');

function updateCountry() {
    for (var i = select_dialect.options.length - 1; i >= 0; i--) {
        select_dialect.remove(i);
    }
    var list = langs[select_language.selectedIndex];
    for (var i = 1; i < list.length; i++) {
        select_dialect.options.add(new Option(list[i][1], list[i][0]));
    }
    select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    start_button.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
        recognizing = true;
        showInfo('info_speak_now');
        start_img.className = 'fa fa-pause';
    };

    recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
            start_img.className = 'fa fa-microphone';
            showInfo('info_no_speech');
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            start_img.className = 'fa fa-microphone';
            showInfo('info_no_microphone');
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                showInfo('info_blocked');
            } else {
                showInfo('info_denied');
            }
            ignore_onend = true;
        }
    };

    recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        start_img.className = 'fa fa-microphone';
        if (!final_transcript) {
            showInfo('info_start');
            return;
        }
        showInfo('');
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            range.selectNode(document.getElementById('myresult'));
            window.getSelection().addRange(range);
        }
        if (create_email) {
            create_email = false;
            createEmail();
        }
    };

    recognition.onresult = function(event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_transcript = capitalize(final_transcript);
        // final_span.innerHTML = linebreak(final_transcript);
        final_span.value = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
        if (final_transcript || interim_transcript) {
            showButtons('inline-block');
        }
    };
}

final_span.addEventListener('keyup', function(event) {
    var KeyID = event.keyCode;
    if (KeyID == 8 || KeyID == 46) {
        final_transcript = final_span.value;
    }
});

function upgrade() {
    start_button.style.visibility = 'hidden';
    showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;

function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;

function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = select_dialect.value;
    recognition.start();
    ignore_onend = false;
    // final_span.innerHTML = '';
    interim_span.innerHTML = '';
    myresult.innerHTML = '';
    start_img.className = 'fa fa-microphone-slash';
    showInfo('info_allow');
    showButtons('none');
    start_timestamp = event.timeStamp;
}

function showInfo(s) {
    if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
            if (child.style && child != speak_language) {
                child.style.display = child.id == s ? 'inline-block' : 'none';
            }
        }
        info.style.visibility = 'visible';
    } else {
        info.style.visibility = 'hidden';
    }
}

var current_style;

function showButtons(style) {
    if (style == current_style) {
        return;
    }
    current_style = style;
}
/** end voice */





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

function insertMessage(msg, topic) {
    if (!msg || msg == '') {
        msg = $('.message-input').val();
        if ($.trim(msg) == '') {
            return false;
        };
    };
    var sendto = "BOT";
    if (topic == 'ChatAdmin') {
        sendto = 'admin';
        //socket.emit('send_message', { msg: msg.replace(/<.*?>/g, ''), nick: 'admin', sendto: 'user' });
    } //else 
    socket.emit('send_message_bot', msg, sendto);
    $('<div class="message message-personal"><div class="conversation">' + msg + '</div><figure class="avatar avatar-personal" style="float: right;"><img src="images/robot_2.png"></figure></div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    $('.message-input').val(null);
    $('.message-input').html(null);
    final_transcript = '';
    updateScrollbar();
}

$('.message-send').click(function() {
    var topic = $('#username-content').attr('topic');
    // console.log('inp :' + topic)
    insertMessage('', topic);
});

$(window).on('keydown', function(e) {
    if (e.which == 13) {
        $('.message-send').click();
        // insertMessage();
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