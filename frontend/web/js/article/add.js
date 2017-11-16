/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    //var postData = [];
    var token = $('meta[name=csrf-token]').attr('content');
    var params = {_csrf:token};

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
        "title": {required: true , rangelength:[1 , 20]},
        "type": {required: true},
        "summary": {rangelength:[0 , 50]},
        "content": {required: true , minlength:10},
        "is_released": {required: true}
    };
    var validateMessages = {
        name: {
            required: "This Field is must be required!"
        }

    };
    $("#dialog-add-gift").validate({
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

    $("#addArticle").on('click' , function(){
        //判断是否通过验证
        if($("#form-add-article").validate("check")){
            var postData = {};
            postData['_csrf'] = token;
            postData['content'] = $('#content').val();
            $.ajax({
                url: "/api/file/add",
                data: postData,
                type: 'POST',
                /*dataType: "json",*/ //当返回值为数组时才能使用json
                dataType: "text",
                success:function(data){
                    postData['content_url'] = data;
                    postData['title'] = $('#title').val();
                    postData['type'] = $('#type').val();
                    postData['describe'] = $('#summary').val();
                    postData['is_released'] = $('#is_released').val();
                    //console.log(postData);return;
                    $.ajax({
                        url:"/api/article/add",
                        data:postData,
                        dataType:'json',
                        type:'POST',
                        success:function(data){
                            window.location.href = "/article/index";
                        },
                        error:function(XMLHttpRequest){
                            alert(XMLHttpRequest.responseJSON.message+"");
                        }
                    });
                }
            });
        }
    });

});