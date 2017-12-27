/**
 * Created by admin on 2017/12/26.
 */
$(function(){
    var token = $('meta[name=csrf-token]').attr('content');

    //计算出新系的编号
    (function (){
        var numbe;
        $.ajax({
            url:'api/department/data',
            data:{_csrf:token},
            dataType:'json',
            type:'post',
            success:function(data){
                if(data['number']){
                    if(data['number']){
                        numbe = Number(data['number'].substr(1 , 4))+1;
                        if(String(numbe).length == 1) numbe = '000'+numbe;
                        if(String(numbe).length == 2) numbe = '00'+numbe;
                        if(String(numbe).length == 3) numbe = '0'+numbe;
                    }else {
                        numbe = '0001';
                    }
                    $(".form-control[name='depNo']").val('D'+numbe);
                }
                if(data['user']){
                    var html = '';
                    html += '<option value="">请选择系主任</option>';
                    for(var i= 0,len=data['user'].length ; i<len ; i++ ){
                        html += '<option value="'+data['user'][i]['id']+'">'+data['user'][i]['username']+'</option>';
                    }
                    $(".form-control[name='user_id']").append(html);
                }
            }
        });
    })();

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
        "user_id": {required: true},
        "depNo": {required: true},
        "depName": {required: true},
        "phone": {required: true , 	rangelength:[8,8]},
        "depAddress": {required: true}
    };
    var validateMessages = {
        range:'电话长度为8位'
    };
    $('#add-department').validate({
        rules:validateRules,
        messages: validateMessages,
        errorClass: "text-red",
        //错误提示的html标签
        errorElement:'span',
        focusCleanup:true,
        submitHandler: function() {
            var postData = {};
            postData['_csrf'] = token;
            $(".form-control").each(function(){
                postData[$(this).attr('name')] = $(this).val();
            });
            $.ajax({
                url: "/api/department/add",
                data: postData,
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    location.reload(true);
                },
                error: function (XMLHttpRequest) {
                    alert(XMLHttpRequest.responseJSON.message + "");
                }
            })
        }
    });

});