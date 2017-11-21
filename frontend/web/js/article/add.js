/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    //var postData = [];
    var token = $('meta[name=csrf-token]').attr('content');
    var params = {_csrf:token};

    //init validate
    //var validateTag = false;

    var validateRules = {
        "title": {required: true , rangelength:[1 , 20]},
        "type": {required: true},
        "summary": {rangelength:[0 , 50]},
        "content": {minlength:10},
        "is_released": {required: true}
    };
    var validateMessages = {
    };

    /**
     *errand项目上封装后的用法
     */
    /*$("#dialog-add-gift").validate({
        //用于取值的属性
        validatetype: "data-field",
        //需要验证的规则
        rules: validateRules,
        //没有通过规则时的错误提示
        messages: validateMessages,
        //触发方式,如果是 true 那么当未通过验证的元素获得焦点时，移除错误提示,默认为false
        /!**其他触发方式：
         * onsubmit 提交时验证
         * onfocusout	失去焦点时验证（不包括复选框/单选按钮）。
         * onkeyup	在 keyup 时验证。
         * onclick	在点击复选框和单选按钮时验证。
         * focusInvalid	提交表单后，未通过验证的表单（第一个或提交之前获得焦点的未通过验证的表单）会获得焦点。
         *!/
        focusCleanup:true,
        //错误提示的class
        errorClass: "help-block",
        //错误提示的html标签
        errorElement: "span"
    });*/

    /**
     *原始版本的用法
     */
    $().ready(function() {
        $("#add-article").validate({
            rules: validateRules,
            messages: validateMessages,
            //错误提示的class
            errorClass: "help-block",
            //错误提示的html标签
            errorElement:'span',
        });
    });

    $("#content-format").change(function(){
        if($(this).val() == 1){
            $(".content").removeClass('hide');
            $(".content-url").addClass('hide');
        } else {
            $(".content").addClass('hide');
            $(".content-url").removeClass('hide');
        }
    });

    $("#upload").click(function(){
        $('#file').trigger('click');
    });
    $("#file").change(function(){
        timedCount(3000);
    });

    $.validator.setDefaults({
        submitHandler: function() {
            var postData = {};
            postData['_csrf'] = token;
            postData['title'] = $('*[name="title"]').val();
            postData['type'] = $('*[name="type"]').val();
            postData['describe'] = $('*[name="summary"]').val();
            postData['is_released'] = $('*[name="is_released"]').val();

            if($("#content-format").val() == 1){
                postData['article_url'] = $('*[name="content"]').val();
                postData['strORurl'] = 'str';
                addarticle(postData);
            } else {
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
                    postData['article_url'] = res;
                    postData['strORurl'] = 'url';
                    addarticle(postData);
                }).fail(function(res) {
                    alert(res);
                });
            }
        }
    });

    function addarticle(postData){
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
    function timedCount(time)
    {
        var processer = $("#processerbar");
        //重置
        processer.css('width',0);
        processer.find('span').text(0);
        //进程
        processer.animate({width:300+"px"},time);
        processer.find('span').eq(0).numberRock({
            speed:time/100,
            count:100,
            type:"width"
        })
    }
});


