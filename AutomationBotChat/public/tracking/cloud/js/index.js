 $(document).ready(function() {
     var setRecommandValues = function() {
         $('[name="life_time"]').val(7);
         $('[name="instance"]').val(1);
         $('[name="cpu"]').val(1);
         $('[name="ram"]').val(512);
         $('[name="hdd"]').val(80);
         $('[name="life_time"]').prop("disabled", true);
         $('[name="instance"]').prop("disabled", true);
         $('[name="cpu"]').prop("disabled", true);
         $('[name="ram"]').prop("disabled", true);
         $('[name="hdd"]').prop("disabled", true);
     }

     var removeRecommandValues = function() {
         $('[name="life_time"]').prop("disabled", false);
         $('[name="instance"]').prop("disabled", false);
         $('[name="cpu"]').prop("disabled", false);
         $('[name="ram"]').prop("disabled", false);
         $('[name="hdd"]').prop("disabled", false);
     }
     setRecommandValues();
     $('[value="advance"]').click(function() {
         $('#advance-quotas').show();
     });
     $('[value="default"], [value="custom"]').click(function() {
         $('#advance-quotas').hide();
     });

     $("#valueType").change(function(ex) {
         var option = $(this).val();
         if (option == "default") {
             setRecommandValues();
         } else {
             removeRecommandValues();
         }
     });

     $('#contact_form').bootstrapValidator({
             // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
             feedbackIcons: {
                 valid: 'glyphicon glyphicon-ok',
                 invalid: 'glyphicon glyphicon-remove',
                 validating: 'glyphicon glyphicon-refresh'
             },
             fields: {
                 full_name: {
                     message: 'The username is not valid',
                     validators: {
                         notEmpty: {
                             message: 'The username is required and can\'t be empty'
                         },
                         stringLength: {
                             min: 6,
                             max: 30,
                             message: 'The username should be more than 6 and less than 30 characters long'
                         },
                         regexp: {
                             regexp: /^[a-zA-Z0-9_\.]+$/,
                             message: 'The username can only consist of alphabetical, number, dot and underscore'
                         }
                     }
                 },
                 bage_id: {
                     validators: {
                         notEmpty: {
                             message: 'Please supply your Badge ID'
                         },
                         stringLength: {
                             min: 6,
                             max: 6,
                             message: 'Please supply a valid Badge ID'
                         },

                     }
                 },
                 email: {
                     validators: {
                         notEmpty: {
                             message: 'Please supply your email address'
                         },
                         emailAddress: {
                             message: 'Please supply a valid email address'
                         }
                     }
                 },
                 phone: {
                     validators: {
                         phone: {
                             message: 'The input is not a valid phone number'
                         }
                     }
                 },
                 project: {
                     validators: {
                         stringLength: {
                             min: 4,
                             max: 15,
                         },
                         notEmpty: {
                             message: 'Please supply your project'
                         },
                         regexp: {
                             regexp: /^[a-zA-Z0-9_\.]+$/,
                             message: 'The Project name can only consist of alphabetical, number, dot and underscore'
                         }
                     }
                 },
                 pm_email: {
                     validators: {
                         notEmpty: {
                             message: 'Please supply your PM email address'
                         },
                         emailAddress: {
                             message: 'Please supply a valid email address'
                         }
                     }
                 },
                 life_time: {
                     validators: {
                         notEmpty: {
                             message: 'Please supply the period of time you want to deploy'
                         },
                         lessThan: {
                             value: 90,
                             inclusive: true,
                             message: 'Life time should be less than 90'
                         },
                         greaterThan: {
                             value: 1,
                             inclusive: false,
                             message: 'Life time should be greater than or equal to 1'
                         },
                         regexp: {
                             regexp: /^\d+$/,
                             message: 'Life time should be positive numbers'
                         }
                     }
                 },
                 instance: {
                     validators: {
                         notEmpty: {
                             message: 'Please supply the number of instance you want to deploy'
                         },
                         lessThan: {
                             value: 5,
                             inclusive: true,
                             message: 'CPU should be less than 5'
                         },
                         greaterThan: {
                             value: 1,
                             inclusive: false,
                             message: 'CPU should be greater than or equal to 1'
                         },
                         regexp: {
                             regexp: /^\d+$/,
                             message: 'Instance should be positive numbers'
                         }
                     }
                 },
                 cpu: {
                     validators: {
                         notEmpty: {
                             message: 'Please supply the amount of CPU you want to use'
                         },
                         lessThan: {
                             value: 16,
                             inclusive: true,
                             message: 'CPU should be less than 16'
                         },
                         greaterThan: {
                             value: 1,
                             inclusive: false,
                             message: 'CPU should be greater than or equal to 1'
                         },
                         regexp: {
                             regexp: /^\d+$/,
                             message: 'CPU should be positive numbers'
                         }
                     }
                 },
                 ram: {
                     validators: {
                         notEmpty: {
                             message: 'Please supply the amount of RAM you want to use'
                         },
                         greaterThan: {
                             value: 512,
                             inclusive: false,
                             message: 'RAM should be greater than or equal to 512'
                         },
                         regexp: {
                             regexp: /^\d+$/,
                             message: 'RAM should be positive numbers'
                         }
                     }
                 },
                 hdd: {
                     validators: {
                         notEmpty: {
                             message: 'Please supply the amount of disk you want to use'
                         },
                         greaterThan: {
                             value: 80,
                             inclusive: false,
                             message: 'HDD should be greater than or equal to 80'
                         },
                         regexp: {
                             regexp: /^\d+$/,
                             message: 'HDD should be positive numbers'
                         }
                     }
                 },

                 note: {
                     validators: {
                         stringLength: {
                             min: 4,
                             max: 1000,
                             message: 'Please enter at least 4 characters and no more than 1000'
                         },
                     }
                 }
             }
         })
         .on('success.form.bv', function(e) {
             $('#success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
             $('#contact_form').data('bootstrapValidator').resetForm();

             // Prevent form submission
             e.preventDefault();

             // Get the form instance
             var $form = $(e.target);

             // Get the BootstrapValidator instance
             var bv = $form.data('bootstrapValidator');

             // Use Ajax to submit form data
             $.post($form.attr('action'), $form.serialize(), function(result) {
                 console.log(result);
             }, 'json');
         });
 });