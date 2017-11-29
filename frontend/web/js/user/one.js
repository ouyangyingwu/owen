/**
 * Created by admin on 2017/9/27.
 */
$(function() {
    var token = $('meta[name=csrf-token]').attr('content');

    $('.nav-tabs li:last').click(function(){
        $('#information').addClass('hide');
        $('#ResetPassword').removeClass('hide');
    });
    $('.nav-tabs li:first').click(function(){
        $('#ResetPassword').addClass('hide');
        $('#information').removeClass('hide');
    });

    //钟表
    setInterval(function () {
        var date = new Date();
        var time = date.getFullYear()+'-'+supplement(date.getMonth())+'-'+ supplement(date.getDay()) +' '+supplement(date.getHours())+':'+supplement(date.getMinutes())+':'+supplement(date.getSeconds());
        $('.now-time').text(time);
    },1000);
    function  supplement (x){
        //补0
        if(x<10) x = '0'+x;
        return x;
    }

    //定义新的规则
    $.validator.addMethod("reset_password", function(value){
        var tag = true;
        var regexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[\s\S]{8,30}$/;
        if(!value.match(regexp)){
            tag = false;
        }
        return tag;
    }, "密码由数字字母和字符组成，长度为8至30位! ");

    var validateRules = {
        "username": {required: true , rangelength:[1 , 20]},
        "email": {required: true , email:true },
        "phone": {number:true , rangelength:[11,11]}
    };
    var validateMessages = {};

    var passwordRules = {
        "old_password": {required: true},
        "new_password": {required: true , reset_password:true },
        "confirm_password": {required: true , equalTo:"#password"}
    };
    var passwordMessages = {};

    //判断是否通过验证
    $('#edit-user').validate({
        rules:validateRules,
        messages: validateMessages,
        errorClass: "help-block",
        //错误提示的html标签
        errorElement:'span',
        focusCleanup:true,
         submitHandler: function() {
             var postData = {};
             //console.log('mmp');
             postData['_csrf'] = token;
             postData['username'] = $(".form-control[name='username']").val();
             postData['email'] = $(".form-control[name='email']").val();
             postData['phone'] = $(".form-control[name='phone']").val();
             $.ajax({
                 url: "/api/user/update",
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
    $('#reset-password').validate({
        rules:passwordRules,
        Messages:passwordMessages,
        errorClass: "help-block",
        //错误提示的html标签
        errorElement:'span',
        //如果该属性设置为True, 那么控件获得焦点时，移除出错的class定义，隐藏错误信息，避免和 focusInvalid.一起用。
        focusCleanup:true,
        submitHandler: function() {
            var postData = {};
            postData['_csrf'] = token;
            postData['old_password'] = $(".form-control[name='old_password']").val();
            postData['new_password'] = $(".form-control[name='new_password']").val();
            $.ajax({
                url:"/api/user/reset-password",
                data:postData,
                dataType:'json',
                type:'POST',
                success:function(data){
                    alert('密码修改成功');
                    location.reload(true);
                    //window.location.href = "/user/index";
                },
                error:function(XMLHttpRequest){
                    alert(XMLHttpRequest.responseJSON.message+"");
                }
            });
        }
    })

});