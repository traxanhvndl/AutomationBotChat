 $(document).ready(function() {
       var setRecommandValues = function() {
       $('[name="life_time"]').prop("disabled", true);
       $('[name="instance"]').prop("disabled", true);
       $('[name="cpu"]').prop("disabled", true);
       $('[name="ram"]').prop("disabled", true);
       $('[name="hdd"]').prop("disabled", true);
       $('[name="life_time"]').val(7);
       $('[name="instance"]').val(1);
       $('[name="cpu"]').val(1);
       $('[name="ram"]').val(512);
       $('[name="hdd"]').val(80);
     }

       var removeRecommandValues = function() {   
       $('[name="life_time"]').prop("disabled", false);
       $('[name="instance"]').prop("disabled", false);
       $('[name="cpu"]').prop("disabled", false);
       $('[name="ram"]').prop("disabled", false);
       $('[name="hdd"]').prop("disabled", false);
     }

    $('[value="default"]').click(setRecommandValues, function(e){
       var bootstrapValidator = $('#contact_form').data('bootstrapValidator');
       bootstrapValidator.enableFieldValidators('life_time', false);
       bootstrapValidator.enableFieldValidators('cpu', false);
       bootstrapValidator.enableFieldValidators('ram', false);
       bootstrapValidator.enableFieldValidators('hdd', false);
       bootstrapValidator.enableFieldValidators('instance', false);
       $('[name="life_time"]').prop("disabled", true);
       $('[name="instance"]').prop("disabled", true);
       $('[name="cpu"]').prop("disabled", true);
       $('[name="ram"]').prop("disabled", true);
       $('[name="hdd"]').prop("disabled", true);
       $('[name="life_time"]').val(7);
       $('[name="instance"]').val(1);
       $('[name="cpu"]').val(1);
       $('[name="ram"]').val(512);
       $('[name="hdd"]').val(80);
    })
    $('[value="custom"], [value="advance"]').click(removeRecommandValues, function(e){
       var bootstrapValidator = $('#contact_form').data('bootstrapValidator');
       bootstrapValidator.enableFieldValidators('life_time', true);
       bootstrapValidator.enableFieldValidators('cpu', true);
       bootstrapValidator.enableFieldValidators('ram', true);
       bootstrapValidator.enableFieldValidators('hdd', true);
       bootstrapValidator.enableFieldValidators('instance', true);
       $('[name="life_time"]').prop("disabled", false);
       $('[name="instance"]').prop("disabled", false);
       $('[name="cpu"]').prop("disabled", false);
       $('[name="ram"]').prop("disabled", false);
       $('[name="hdd"]').prop("disabled", false);
    }
       )
    setRecommandValues();
    $('[value="advance"]').click(function(){
      $('#advance-quotas').show();
    });
    $('[value="default"], [value="custom"]').click(function(){
      $('#advance-quotas').hide();
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
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please supply your name'
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
                    regexp: {
                            message: 'The badge ID can only contain the digits',
                            regexp: /^[0-9]+$/
                    }
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
                    stringLength: {
                        min: 4,
                        message: 'Please supply a vaild phone number'
                    },
                    notEmpty: {
                        message: 'Please supply your phone number'
                    },
                    regexp: {
                            message: 'The phone number can only contain the digits',
                            regexp: /^[0-9]+$/
                    }
                }
            },
            project: {
                validators: {
                     stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please supply your project'
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
                    greaterThan: {
                        value: 1,
                        message: 'The value must be greater than or equal to 1'
                    }
                }
            },
            instance: {
                validators: {
                    notEmpty: {
                        message: 'Please supply the number of instance you want to deploy'
                    },
                    greaterThan: {
                        value: 1,
                        message: 'The value must be greater than or equal to 1'
                    }
                }
            },
            cpu: {
                validators: {
                    notEmpty: {
                        message: 'Please supply the amount of CPU you want to deploy'
                    },
                    greaterThan: {
                        value: 1,
                        message: 'The value must be greater than or equal to 1'
                    }
                }
            },
            ram: {
                validators: {
                    notEmpty: {
                        message: 'Please supply the amount of RAM you want to use'
                    },
                    greaterThan: {
                        value: 1,
                        message: 'The value must be greater than or equal to 1'
                    }
                }
            },
           hdd: {
                validators: {
                    notEmpty: {
                        message: 'Please supply the amount of disk you want to use'
                    },
                greaterThan: {
                        value: 1,
                        message: 'The value must be greater than or equal to 1'
                    }
                }
            },

            note: {
                validators: {
                      stringLength: {
                        max: 1000,
                        message:'Please enter no more than 1000 characters'
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

