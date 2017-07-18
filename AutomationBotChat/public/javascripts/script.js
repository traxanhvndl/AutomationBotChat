var socket = io.connect();
$(document).ready(function() {
    var frame = $('#main_frame').get(0).contentDocument;
    $('input, button', frame).on('keydown', function() {
        autoResize();
    });
});