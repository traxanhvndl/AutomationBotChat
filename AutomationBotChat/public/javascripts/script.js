var socket = io.connect();
$(document).ready(function() {
    var jsMain = document.createElement("script");
    jsMain.innerHTML = "$(document).ready(function(){$('input').onclick(function() {$(document, parent.window.document).trigger('myCustomTrigger');});});";
    var $iframe = $("#main_frame");
    // $iframe.ready(function() {
    //     alert($iframe.contents().html());
    //     $iframe.contents().find("head").append(jsMain);
    // });
    $iframe.bind('myCustomTrigger', function() {
        alert('hello');
    });
});