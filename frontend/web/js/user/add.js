/**
 * Created by admin on 2017/11/15.
 */
$(function(){
    var token = $('meta[name=csrf-token]').attr('content');

    var img_url;
    $("#upload").click(function(){
        $('#file').click();
        $('#file').change(function(){
            var formData = new FormData();
            formData.append('file', $('#file')[0].files[0]);
            $.ajax({
                url:'/api/file/url',
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false
            }).done(function(res) {
                //在头部插入样式
               /* $("head").append("<link>");
                var css = $("head").children(":last");
                css.attr({rel: "stylesheet", type: "text/css", href: "/css/upload.css"});*/
                var html = "<img src='/image/"+res+"'>";
                $("#iframe-image-show").show().append(html);
                img_url = res;
            }).fail(function(res) {
                alert(res);
            });
        });
    });
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
        "username": {required: true , rangelength:[1 , 20]},
        "email": {required: true , email:true },
        "phone": {required: true , number:true , rangelength:[11,11]}
    };
    var validateMessages = {
        name: {
            required: "This Field is must be required!"
        }

    };
    $().ready(function() {
        $("#add-user").validate({
            rules: validateRules,
            messages: validateMessages,
            //错误提示的class
            errorClass: "help-block",
            //错误提示的html标签
            errorElement:'span',
        });
    });

    //判断是否通过验证
    $.validator.setDefaults({
        submitHandler: function() {
            var postData = {};
            postData['_csrf'] = token;
            postData['username'] = $('*[name="username"]').val();
            postData['email'] = $('*[name="email"]').val();
            postData['phone'] = $('*[name="phone"]').val();
            postData['sex'] = $('*[name="sex"]').val();
            postData['img_url'] = img_url;
            $.ajax({
                url:"/api/user/add",
                data:postData,
                dataType:'json',
                type:'POST',
                success:function(data){
                    window.location.href = "/user/index";
                },
                error:function(XMLHttpRequest){
                    alert(XMLHttpRequest.responseJSON.message+"");
                }
            });
        }
    });

});