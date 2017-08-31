$(function(){
    $('form').on('submit', function(event) {
        event.preventDefault();
        MyForm.submit();
    });
});

var MyForm = {
    validate: function() {
        var errors = [],
            fields = this.getData(),
            emailMask = /^.+@(ya\.ru|yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex\.com)$/i,
            phoneMask = /^\+7\(\d{3}\)\d{3}\-\d\d\-\d\d$/,
            phoneDigitsSum = fields.phone.match(/\d/g).reduce(function(a, b) {
                return parseInt(a) + parseInt(b);
            }, 0);
        if (fields.fio.trim().split(/\s+/).length !== 3) {
            errors.push('fio');
        }
        if (!emailMask.test(fields.email)) {
            errors.push('email');
        }
        if (!(phoneMask.test(fields.phone) && phoneDigitsSum <= 30)) {
            errors.push('phone');
        }
        return {
            isValid: errors.length === 0,
            errorFields: errors,
        };
    },
    getData: function() {
        return {
            fio: $('[name=fio]').val(),
            email: $('[name=email]').val(),
            phone: $('[name=phone]').val(),
        };
    },
    setData: function(fields) {
        $('[name=fio]').val(fields.fio);
        $('[name=email]').val(fields.email);
        $('[name=phone]').val(fields.phone);
    },
    submit: function() {
        var validationResult = MyForm.validate();
        if (validationResult.isValid) {
            $('#submitButton').prop('disabled', true);
            $.ajax({
                dataType: "json",
                url: $('#myForm').attr('action'),
                success: function(result) {
                    if (result.status === 'success') {
                        $("#resultContainer").attr('class', 'success');
                        $("#resultContainer").html('Success');
                    } else if (result.status === 'error') {
                        $("#resultContainer").attr('class', 'error');
                        $("#resultContainer").html(result.reason);
                    } else if (result.status === 'progress') {
                        $("#resultContainer").attr('class', 'progress');
                        var thisAjaxObject = this;
                        setTimeout(function() {
                            $.ajax(thisAjaxObject);
                        }, result.timeout);
                    }
                }
            });
        } else {
            validationResult.errorFields.forEach(function(fieldName) {
                $('[name=' + fieldName + ']').addClass('error');
            });
        }
    },
}
