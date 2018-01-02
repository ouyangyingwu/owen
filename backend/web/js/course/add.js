/**
 * Created by admin on 2017/12/26.
 */
$(function(){
    var token = $('meta[name=csrf-token]').attr('content');
    var department=[],major,date = new Date();

    (function (){
        $.ajax({
            url:'api/department/list',
            data:{_csrf:token},
            dataType:'json',
            type:'post',
            success:function(data){
                var departmentList = data.data;
                /*if(department){
                    var html = '';
                    html += '<option value="">请选择所属的系</option>';
                    for(var i= 0,len=department.length ; i<len ; i++ ){
                        html += '<option value="'+department[i]['id']+'">'+department[i]['depName']+'</option>';
                    }
                    $(".form-control[name='department_id']").append(html);
                    $(".form-control[name='period']").val(date.getFullYear());
                }*/
                for (var i=0,len=departmentList.length ; i<len ; i++){
                    department.push({id:departmentList[i]['id'] , text:departmentList[i]['depName']});
                }
                $(".form-control[name='department_id']").select2({
                    data: department,
                    placeholder:'请选择所属的系',
                    allowClear:true
                });
                if($(".form-control[name='department_id']").val()){
                    placeData($(".form-control[name='department_id']").val());
                }
            }
        });
    })();
    $(".form-control[name='department_id']").change(function(){
        placeData($(this).val());
    });
    $(".form-control[name='major_id']").change(function(){
        var postData = {}, major_id = $(this).val();
        postData['_csrf'] = token;
        postData['major_id'] = major_id;
        postData['period'] = date.getFullYear();
        if(major_id){
            $.ajax({
                url: 'api/team/list',
                data: postData,
                type: 'post',
                dataType: 'json',
                success:function(data){
                    var nuber = data.total ? parseInt(data.total)+1 : 1;
                    var majorName ;
                    for(var i= 0,len=major.length ; i<len ; i++){
                        if(major[i]['id'] == major_id){
                            majorName = major[i]['majorName']
                        }
                    }
                    var teamName = majorName + CommonTool.NumberToChinese(nuber) +'班';
                    $(".form-control[name='teamName']").val(teamName);
                    $(".form-control[name='period']").val((date.getMonth()+1) < 10 ? date.getFullYear() : date.getFullYear()+1);
                }
            })
        }
    });

    function placeData(department_id){
        var postData = {};
        postData['_csrf'] = token;
        postData['department_id'] = department_id;
        $.ajax({
            url: 'api/team/data',
            data: postData,
            type: 'post',
            dataType: 'json',
            success:function(data){
                var teacher=data.user; major=data.major;
                if(major){
                    var html = '';
                    html += '<option value="">请选择所属的专业</option>';
                    for(var i= 0,len=major.length ; i<len ; i++ ){
                        html += '<option value="'+major[i]['id']+'">'+major[i]['majorName']+'</option>';
                    }
                    $(".form-control[name='major_id']").empty().append(html);
                }else {
                    var html = '';
                    html += '<option value="">该系没有可选专业</option>';
                    $(".form-control[name='major_id']").empty().append(html);
                }
                if(teacher){
                    var html = '';
                    html += '<option value="">请选择辅导员</option>';
                    for(var i= 0,len=teacher.length ; i<len ; i++ ){
                        html += '<option value="'+teacher[i]['user']['id']+'">'+teacher[i]['user']['username']+'</option>';
                    }
                    $(".form-control[name='user_id']").empty().append(html);
                }else {
                    var html = '';
                    html += '<option value="">该系没有可选辅导员</option>';
                    $(".form-control[name='user_id']").empty().append(html);
                }
            }
        })
    }

    //init validate
    var validateTag = false;
    var validateRules = {
        "department_id": {required: true},
        "major_id": {required: true},
        "number_limit": {required: true , max:40 , min:10},
    };
    var validateMessages = {};
    $('#add-team').validate({
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
                url: "/api/team/add",
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