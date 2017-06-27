$(function() {

    $(".contact-contain input,.contact-contain textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("#contactForm input#username").val();
            var email = $("#contactForm input#usermail").val();
            var subject = "[TA-Support] " + $("#contactForm input#subject").val();
            var message = $("#contactForm textarea#mailmessage").val().replace(/\r?\n/g, '<br />');
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            $("#contactForm .indication").text("E-mail is Sending... Please wait !");
            $.get("/sendmail", { name: name, from: email, subject: subject, text: message }, function(data) {
                // console.log(data)
                if (data == "sent") {
                    $("#contactForm .indication").empty().html("Email has been sent from <span class='required'><b><i>" + email + "</i></b></span>");
                    $('#contactForm')[0].reset();
                }
            });
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});