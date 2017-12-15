/**
 * Created by admin on 2017/11/15.
 */
$(function(){
    var token = $('meta[name=csrf-token]').attr('content');
    //计算出新用户的编号
    function Numbering(type){
        var expand , last , numbe , timestamp = new Date().getTime();
        switch (type){
            case 1: expand='student';last='S';break;
            case 2: expand='teacher';last='T';break;
        }
        $.ajax({
            url:'api/user/one',
            data:{_csrf:token,
                type:type,
                expand:[expand],
            },
            dataType:'json',
            type:'post',
            success:function(data){
                if(data[expand]){
                    if(type == 1) numbe = Number(data[expand]['stuNo'].substr(5 , 4))+1;
                    if(type == 2) numbe = Number(data[expand]['teachNo'].substr(5 , 4))+1;
                    if(String(numbe).length == 1) numbe = '000'+numbe;
                    if(String(numbe).length == 2) numbe = '00'+numbe;
                    if(String(numbe).length == 3) numbe = '0'+numbe;
                }else { numbe = '0001';}
                //return numbe;
                //callback(numbe)
            }
        });
        return last+CommonTool.formatTime(Math.round(timestamp/1000) , 'Y')+numbe;
    }

    function userClass(position){
        var position = position ? position : $(".form-control[name='type']").val();
        if(position == 1){
            $(".form-control[name='stuNo']").val(Numbering(1));
            $(".form-control[name='stuNo']").parent().parent().show();
            $(".form-control[name='teachNo']").parent().parent().hide();
            $(".form-control[name='marjor_id']").parent().parent().show();
            $(".form-control[name='department_id']").parent().parent().show();
            $(".form-control[name='position']").parent().parent().hide();
            $(".form-control[name='purview']").parent().parent().hide();
        }else if(position == 2){
            $(".form-control[name='teachNo']").val(Numbering(2));
            $(".form-control[name='stuNo']").parent().parent().hide();
            $(".form-control[name='teachNo']").parent().parent().show();
            $(".form-control[name='marjor_id']").parent().parent().hide();
            $(".form-control[name='department_id']").parent().parent().show();
            $(".form-control[name='position']").parent().parent().show();
            $(".form-control[name='purview']").parent().parent().hide();
        }else if(position == 3){
            $(".form-control[name='stuNo']").parent().parent().hide();
            $(".form-control[name='teachNo']").parent().parent().hide();
            $(".form-control[name='marjor_id']").parent().parent().hide();
            $(".form-control[name='department_id']").parent().parent().hide();
            $(".form-control[name='position']").parent().parent().hide();
            $(".form-control[name='purview']").parent().parent().show();
        }
    }
    userClass();
    $(".form-control[name='type']").change(function(){
        userClass();
    });

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