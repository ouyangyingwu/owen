/**
 * Created by admin on 2017/11/15.
 */
$(function(){
    var token = $('meta[name=csrf-token]').attr('content');

    function userClass(position){
        var position = position ? position : $(".form-control[name='type']").val();
        Numbering(position);
        if(position == 1){
            $(".form-control[name='stuNo']").parent().parent().show();
            $(".form-control[name='teachNo']").parent().parent().hide();
            $(".form-control[name='major_id']").parent().parent().show();
            $(".form-control[name='department_id']").parent().parent().show();
            $(".form-control[name='team_id']").parent().parent().show();
            $(".form-control[name='position']").parent().parent().hide();
            $(".form-control[name='purview']").parent().parent().hide();
        }else if(position == 2){
            $(".form-control[name='stuNo']").parent().parent().hide();
            $(".form-control[name='teachNo']").parent().parent().show();
            $(".form-control[name='major_id']").parent().parent().hide();
            $(".form-control[name='department_id']").parent().parent().show();
            $(".form-control[name='team_id']").parent().parent().hide();
            $(".form-control[name='position']").parent().parent().show();
            $(".form-control[name='purview']").parent().parent().hide();
        }else if(position == 3){
            $(".form-control[name='stuNo']").parent().parent().hide();
            $(".form-control[name='teachNo']").parent().parent().hide();
            $(".form-control[name='major_id']").parent().parent().hide();
            $(".form-control[name='department_id']").parent().parent().hide();
            $(".form-control[name='team_id']").parent().parent().hide();
            $(".form-control[name='position']").parent().parent().hide();
            $(".form-control[name='purview']").parent().parent().show();
        }
    }
    userClass();
    $(".form-control[name='type']").change(function(){
        userClass();
    });

    //计算出新用户的编号
    function Numbering(type){
        var expand , last , numbe , timestamp = new Date().getTime();
        if( type == 1 )  expand='student',last='S';
        if( type == 2 )  expand='teacher',last='T';

        $.ajax({
            url:'api/user/number',
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
                }else {
                    numbe = '0001';
                }
                numbe = last+CommonTool.formatTime(Math.round(timestamp/1000) , 'Y')+numbe;
                if( type == 1 )  $(".form-control[name='stuNo']").val(numbe);
                if( type == 2 )  $(".form-control[name='teachNo']").val(numbe);
            }
        });
    }
    //department list
    (function (){
        var postData = {_csrf:token};
        $.ajax({
            url: 'api/department/list',
            data: postData,
            type: 'post',
            dataType:'json',
            success:function(data){
                var html = '';
                $(".form-control[name='major_id']").empty();
                html+= '<option value="0">请选择</option>';
                if(data.total > 0){
                    for(var i=0 ; i < data.total ; i++){
                        html+= '<option value="'+data["data"][i]['id']+'">'+data["data"][i]['depName']+'</option>';
                    }
                }else{html+= '<option value="0">没有可以选择的系</option>';}
                $(".form-control[name='department_id']").append(html);
            }
        });
    })();
    //major list
    function major(department_id){
        var postData = {_csrf:token,department_id:department_id};
        $.ajax({
            url: 'api/major/list',
            data: postData,
            type: 'post',
            dataType:'json',
            success:function(data){
                var html = '';
                $(".form-control[name='major_id']").empty();
                html+= '<option value="0">请选择</option>';
                if(data.total > 0){
                    for(var i=0 ; i < data.total ; i++){
                        html+= '<option value="'+data["data"][i]['id']+'">'+data["data"][i]['majorName']+'</option>';
                    }
                }else {html+= '<option value="0">没有可以选择的专业</option>';}
                $(".form-control[name='major_id']").append(html);return;
            }
        });
    }
    //team list
    function team(major_id){
        var postData = {_csrf:token,major_id:major_id};
        $.ajax({
            url: 'api/team/list',
            data: postData,
            type: 'post',
            dataType:'json',
            success:function(data){
                var html = '';
                $(".form-control[name='team_id']").empty();
                html+= '<option value="0">请选择</option>';
                if(data.total > 0){
                    for(var i=0 ; i < data.total ; i++){
                        html+= '<option value="'+data["data"][i]['id']+'">'+data["data"][i]['teamName']+'</option>';
                    }
                }else {html+= '<option value="0">没有可以选择的班级</option>';}
                $(".form-control[name='team_id']").append(html);return;
            }
        });
    }
    $(".form-control[name='department_id']").change(function(){
        major($(".form-control[name='department_id']").val());
    });
    $(".form-control[name='major_id']").change(function(){
        team($(".form-control[name='major_id']").val());
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
        "birth": {required: true},
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
            $(".form-control").each(function(){
                if($(this).is(':visible')){
                    postData[$(this).attr('name')] = $(this).val();
                }
            });
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