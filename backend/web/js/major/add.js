/**
 * Created by admin on 2017/12/26.
 */
$(function(){
    var userList, token = $('meta[name=csrf-token]').attr('content');

    //计算出新专业的编号
    (function (){
        $.ajax({
            url:'api/major/data',
            data:{_csrf:token},
            dataType:'json',
            type:'post',
            success:function(data){
                var numbe;
                userList = data.user;
                if(data['majorNo']){
                    numbe = Number(data['majorNo'].substr(1 , 4))+1;
                    if(String(numbe).length == 1) numbe = '000'+numbe;
                    if(String(numbe).length == 2) numbe = '00'+numbe;
                    if(String(numbe).length == 3) numbe = '0'+numbe;
                }else {
                    numbe = '0001';
                }
                $(".form-control[name='majorNo']").val('M'+numbe);
                if(data['department']){
                    var html = '';
                    html += '<option value="">请选择专业所属的系</option>';
                    for(var i= 0,len=data['department'].length ; i<len ; i++ ){
                        html += '<option value="'+data['department'][i]['id']+'">'+data['department'][i]['depName']+'</option>';
                    }
                    $(".form-control[name='department_id']").append(html);
                }
            }
        });
    })();
    $(".form-control[name='department_id']").change(function(){
        if(userList){
            var html = '';
            html += '<option value="">请选择专业负责人</option>';
            for(var i= 0,len=userList.length ; i<len ; i++ ){
                if(userList[i]['teacher']['department_id'] == $(this).val()){
                    html += '<option value="'+userList[i]['id']+'">'+userList[i]['username']+'</option>';
                }
            }
            $(".form-control[name='user_id']").empty();
            $(".form-control[name='user_id']").append(html);
        }
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
        "majorName": {required: true},
        "department_id": {required: true},
        "user_id": {required: true},
        "majorCred": {required: true}
    };
    var validateMessages = {};
    $('#add-major').validate({
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
                if($(this).is(':visible')){
                    postData[$(this).attr('name')] = $(this).val();
                }
            });
            $.ajax({
                url: "/api/major/add",
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