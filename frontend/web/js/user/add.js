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
        "email": {required: true},
        "phone": {rangelength:[0 , 50]},
        "sex": {required: true , minlength:10},
    };
    var validateMessages = {
        name: {
            required: "This Field is must be required!"
        }

    };
    $("#form-add-user").validate({
        //用于取值的属性
        validatetype: "data-field",
        //需要验证的规则
        rules: validateRules,
        //没有通过规则时的错误提示
        messages: validateMessages,
        //触发方式,如果是 true 那么当未通过验证的元素获得焦点时，移除错误提示,默认为false
        /**其他触发方式：
         * onsubmit 提交时验证
         * onfocusout	失去焦点时验证（不包括复选框/单选按钮）。
         * onkeyup	在 keyup 时验证。
         * onclick	在点击复选框和单选按钮时验证。
         * focusInvalid	提交表单后，未通过验证的表单（第一个或提交之前获得焦点的未通过验证的表单）会获得焦点。
         */
        focusCleanup:true,
        //错误提示的class
        errorClass: "help-block",
        //错误提示的html标签
        errorElement: "span"
    });

    $("#addUser").click(function(){
        //判断是否通过验证
        if($("#form-add-user").validate("check")){
            var postData = {};
            postData['_csrf'] = token;
            postData['username'] = $('#username').val();
            postData['email'] = $('#email').val();
            postData['phone'] = $('#phone').val();
            postData['sex'] = $('#sex').val();
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
        console.log('mmp');
    });

});