var socket = io.connect();
$(document).ready(function() {
    // var jsMain = document.createElement("script");
    // jsMain.innerHTML = "$(document).ready(function($){$('body').click(function(e) {console.log('dkm');$(document, parent.window.document).trigger('myCustomTrigger');});});";
    // $(jsMain).html("var myCustomData: { foo: 'bar' }; var event = new CustomEvent('myEvent', { detail: myCustomData });window.parent.document.dispatchEvent(event);");

    // var $iframe = $("#main_frame");
    // $iframe.contents().find("head").append("<script>window.parent.postMessage('iframe_message','*');</script>");
    // $iframe.ready(function() {
    //     // alert($(jsMain).html())
    //     // $iframe.contents().find("head").append("<script>console.log('dkm');$(document).trigger('myCustomTrigger');</script>");
    //     $iframe.contents().find("head").append("<script>parent.$(parent.document).bind('new.notifications', function(e, newAlarms) {  alert(newAlarms); } );</script>");
    // });

    // window.document.addEventListener('myEvent', handleEvent, false);

    // function handleEvent(e) {
    //     console.log(e.detail); // outputs: {foo: 'bar'}
    // };
    // $iframe.contents().bind("myCustomTrigger", function() {
    //     alert('hello');
    // });

    // $(window).on("load", function(event) {
    //     if (event.originalEvent.source === $("#main_frame")[0].contentWindow) {
    //         console.log(JSON.parse(event.originalEvent.data));
    //     }
    //     console.log($("#main_frame")[0].contentWindow);
    //     console.log(event.originalEvent.source)
    // });
    var frame = $('#main_frame').get(0).contentDocument;
    $('input, button', frame).on('keydown', function() {
        autoResize();
    });
});