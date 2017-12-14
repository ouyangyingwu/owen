/**
 * Created by admin on 2017/11/15.
 */
$(function(){
    var token = $('meta[name=csrf-token]').attr('content');

    var preset = 'date';
    var options = {
        preset : preset,
        //minDate: new Date(new Date().setYear(new Date().getFullYear() - 5)),
        maxDate: new Date(new Date().setYear(new Date().getFullYear() + 5)),
        theme: "android-ics light",
        mode: "scroller",
        dateFormat: 'yyyy-mm-dd',
        display: "modal"
    };
    $('.scheduleTime').val("").scroller("destroy");
    $('.scheduleTime').scroller(options);

    //init validate
    var validateTag = false;

    $.validator.addMethod("value_validation", function(value){
        var tag = true;
        if($('#type').text() == 'percentage'){
            if(value < 0 || value > 100)
            {
                tag = false;
            }
        }
        var regexp = /^(([1-9]+\.[0-9]*[1-9][0-9]*)|([1-9]*[1-9][0-9]*\.[0-9]+)|([1-9]*[1-9][0-9]*))$/;
        if(!value.match(regexp)){
            tag = false;
        }
        return tag;
    }, "Sorry, This Field  is must be between 1 to 100! ");

    var validateRules = {
        "position": {required: true},
        "sex": {required: true},
        "dirthday": {required: true},
        "username": {required: true , rangelength:[1 , 20]},
        "email": {required: true , email:true },
        "phone": {required: true , number:true , rangelength:[11,11]}
    };
    var validateMessages = {
        name: {
            required: "This Field is must be required!"
        }

    };
    $('#add-user').validate({
        rules:validateRules,
        messages: validateMessages,
        errorClass: "text-red",
        //错误提示的html标签
        errorElement:'span',
        focusCleanup:true,
        submitHandler: function() {
            var postData = {};
            //console.log('mmp');
            postData['_csrf'] = token;
            postData['position'] = $(".form-control[name='position']").val();
            postData['sex'] = $(".form-control[name='sex']").val();
            postData['dirthday'] = $(".form-control[name='dirthday']").val();
            postData['username'] = $(".form-control[name='username']").val();
            postData['email'] = $(".form-control[name='email']").val();
            postData['phone'] = $(".form-control[name='phone']").val();
            $.ajax({
                url: "/api/user/add",
                data: postData,
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    location.reload(true);
                    //window.location.href = "/user/index";
                },
                error: function (XMLHttpRequest) {
                    alert(XMLHttpRequest.responseJSON.message + "");
                }
            })
        }
    });

});