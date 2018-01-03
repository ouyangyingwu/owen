/**
 * Created by admin on 2017/12/26.
 */
$(function(){
    var token = $('meta[name=csrf-token]').attr('content');
    var department=[] , classRoomList=[] , major,date = new Date();

    (function (){
        $.ajax({
            url:'api/department/list',
            data:{_csrf:token},
            dataType:'json',
            type:'post',
            success:function(data){
                var departmentList = data.data;
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
    $(".form-control[name='number']").change(function(){
        if(classRoomList){
            var classRoom = [];
            for (var i=0,len=classRoomList.length ; i<len ; i++){
                if(parseInt(classRoomList[i]['crNumberOfSeat']) >= $(".form-control[name='number']").val()){
                    classRoom.push({id:classRoomList[i]['id'] , text:classRoomList[i]['crBuildingName']+classRoomList[i]['crRoomNo']});
                }
            }
            $(".form-control[name='classroom_id']").select2({
                data: classRoom,
                placeholder:'请选择上课地点',
                allowClear:true
            });
        }
    });

    function placeData(department_id){
        var postData = {};
        postData['_csrf'] = token;
        postData['department_id'] = department_id;
        $.ajax({
            url: 'api/course/data',
            data: postData,
            type: 'post',
            dataType: 'json',
            success:function(data){
                var teacher=data.user; major=data.major ; classRoomList=data.classRoom;
                var couNo , date=new Date(), numbe = data.number ? (data.number.substr(1 , 4)==date.getFullYear()?parseInt(data.number.substr(5 , 4))+1:'1') : '1';
                if(String(numbe).length == 1) numbe = '000'+numbe;
                if(String(numbe).length == 2) numbe = '00'+numbe;
                if(String(numbe).length == 3) numbe = '0'+numbe;
                $(".form-control[name='couNo']").val('C'+ date.getFullYear() + numbe);
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

    //init validate
    var validateTag = false;
    var validateRules = {
        "department_id": {required: true},
        "major_id": {required: true},
        "user_id": {required: true},
        "courseName": {required: true},
        "credit": {required: true , max:10 , min:1},
        "number": {required: true , max:240 , min:10},
        "start_time": {required: true},
        "end_time": {required: true},
        "classroom_id": {required: true}
    };
    var validateMessages = {};
    $('#add-course').validate({
        rules:validateRules,
        messages: validateMessages,
        errorClass: "text-red",
        //错误提示的html标签
        errorElement:'span',
        focusCleanup:true,
        submitHandler: function() {
            var postData = {} , class_time={};
            postData['_csrf'] = token;
            $(".form-control").each(function(){
                postData[$(this).attr('name')] = $(this).val();
            });
            $('.class_time div').each(function(){
                var time = {},i=0;
                $(this).find('input').each(function(){
                    if($(this).is(':checked')){
                        time[i] = $(this).val();
                        i++
                    }
                });
                class_time[$(this).attr('class')] = time;
            });
            postData['class_time'] = class_time;
            //console.log(postData);return;
            $.ajax({
                url: "/api/course/add",
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