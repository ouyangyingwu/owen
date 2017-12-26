/**
 * Created by admin on 2017/12/26.
 */
$(function(){
    var token = $('meta[name=csrf-token]').attr('content');

    //计算出新教室的编号
    (function (){
        var numbe;
        $.ajax({
            url:'api/class-room/data',
            data:{_csrf:token},
            dataType:'json',
            type:'post',
            success:function(data){
                if(data['number']){
                    if(data['number']['crNo']){
                        numbe = Number(data['number']['crNo'].substr(2 , 4))+1;
                        if(String(numbe).length == 1) numbe = '000'+numbe;
                        if(String(numbe).length == 2) numbe = '00'+numbe;
                        if(String(numbe).length == 3) numbe = '0'+numbe;
                    }else {
                        numbe = '0001';
                    }
                    numbe = 'CR'+numbe;
                    $(".form-control[name='crNo']").val(numbe);
                }
                if(data['user']){
                    var html = '';
                    html += '<option value="">请选择教室管理员</option>';
                    for(var i= 0,len=data['user'].length ; i<len ; i++ ){
                        html += '<option value="'+data['user'][i]['id']+'">'+data['user'][i]['username']+'</option>';
                    }
                    $(".form-control[name='user_id']").append(html);
                }
            }
        });
        $(".form-control[name='active']").val()==1 ? $(".form-control[name='reason']").parent().parent().hide() : $(".form-control[name='reason']").parent().parent().show();
    })();
    $(".form-control[name='active']").change(function(){
        $(this).val()==1 ? $(".form-control[name='reason']").parent().parent().hide() : $(".form-control[name='reason']").parent().parent().show();
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
        "crBuildingName": {required: true},
        "crRoomNo": {required: true},
        "crNumberOfSeat": {required: true},
        "max_crNumberOfSeat": {required: true},
        "user_id": {required: true},
        "active": {required: true}
    };
    var validateMessages = {};
    $('#add-classroom').validate({
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
                url: "/api/class-room/add",
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