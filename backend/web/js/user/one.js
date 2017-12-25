/**
 * Created by admin on 2017/9/27.
 */
$(function() {
    var htmlData , token = $('meta[name=csrf-token]').attr('content');

    //图片处理
    $("#upload-img").click(function(){
        $('#file').trigger('click');
    });
    $('#file').change(function(){
        if($(this).val()){
            var formData = new FormData();
            formData.append('file', $('#file')[0].files[0]);
            //上传图片
            $.ajax({
                url:'/api/file/url',
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false
            }).done(function(res) {
                if(res && res.split('/')[1].match(/^CS[0-9]{18}.[a-z]{3,4}$/)){
                    var postData = {};
                    postData["_csrf"] = token;
                    postData["edit_name"] = 'img_url';
                    postData["edit_value"] = res;
                    postData["id"] = htmlData.id;
                    //修改数据
                    $.ajax({
                        url:"/api/user/edit",
                        data:postData,
                        dataType:'json',
                        type:'POST',
                        success:function(data){
                            if(htmlData.img_url){
                                var postData = {};
                                postData["_csrf"] = token;
                                postData["name"] = htmlData.img_url;
                                postData["url"] = 'image';
                                //删除旧的图片
                                $.ajax({
                                    url:"/api/file/delete",
                                    data:postData,
                                    type:'POST'
                                });
                            }
                            userOne()
                        }
                    });
                    return;
                }
                alert(res);
            }).fail(function(res) {
                alert(res);
            });
        }
    });

    $("#delete-img").click(function(){
        //判断图片是否存在
        if(htmlData.img_url){
            $('#iframe-image img').attr('src' , '/image/head-default.png');
            var postData = {};
            postData["_csrf"] = token;
            postData["edit_name"] = 'img_url';
            postData["edit_value"] = null;
            postData["id"] = htmlData.id;
            $.ajax({
                url:"/api/user/edit",
                data:postData,
                dataType:'json',
                type:'POST',
                success:function(data){
                    var postData = {};
                    postData["_csrf"] = token;
                    postData["name"] = htmlData.img_url;
                    postData["url"] = 'image';
                    //删除源图片
                    $.ajax({
                        url:"/api/file/delete",
                        data:postData,
                        type:'POST'
                    });
                    userOne()
                }
            });
        }
    });

    $('.nav-tabs li:last').click(function(){
        $('#information').addClass('hide');
        $('#ResetPassword').removeClass('hide');
    });
    $('.nav-tabs li:first').click(function(){
        $('#ResetPassword').addClass('hide');
        $('#information').removeClass('hide');
    });

    //选择时间
    var preset = 'date';
    var options = {
        preset : preset,
        minDate: new Date(new Date().setYear(new Date().getFullYear() - 5)),
        maxDate: new Date(new Date().setYear(new Date().getFullYear() + 5)),
        theme: "android-ics light",
        mode: "scroller",
        dateFormat: 'yyyy-mm-dd',
        display: "modal"
    };
    $('.scheduleTime').val("").scroller("destroy");
    $('.scheduleTime').scroller(options);
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
                     userOne();
                     //location.reload(true);
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
                    //alert('密码修改成功');
                    $("#dialog-confirm").modal("show").find('p').text("密码修改成功!!");
                },
                error:function(XMLHttpRequest){
                    alert(XMLHttpRequest.responseJSON.message+"!");
                   /* console.log(XMLHttpRequest.responseJSON.message);
                    $("#dialog-confirm").modal("show").find('p').text(XMLHttpRequest.responseJSON.message+"!");*/
                }
            });
        }
    })

    function userOne(){
        $.ajax({
            url:'api/user/one',
            data:{_csrf:token,expand:['admin']},
            type:'post',
            dataType:'json',
            success:function(data){
                htmlData = data;
                data.img_url ? $('#iframe-image img').attr('src' , '/image/'+data.img_url) : '';
                $('#iframe-image .profile-name').text(data.username);
                $('.form-control[name="username"]').val(data.username);
                $('.form-control[name="phone"]').val(data.phone);
                $('.form-control[name="email"]').val(data.email);
                $('.form-control[name="birth"]').val(CommonTool.formatTime(data.birth , 'Y-m-d'));
            }
        })
    }
    userOne();
});