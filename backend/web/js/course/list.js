/**
 * Created by admin on 2017/12/30.
 */
$(function(){
    var htmlData,teacherList,classRoomList;
    var token = $('meta[name=csrf-token]').attr('content');
    var params = {_csrf:token , per_page:10};

    //按条件筛选数据
    $('#searchResult').on('click' , function  () {
        params = {_csrf:token , per_page:10};
        params["page"] = 1;
        if ($('.select-id').val()) {
            params["id"] = $('.select-id').val();
        }
        if ($('.select-couNo').val()) {
            params["couNo"] = $('.select-couNo').val();
        }
        if ($('.select-courseName').val()) {
            params["courseName"] = $('.select-courseName').val();
        }
        if ($('.select-major_id').val()) {
            params["major_id"] = $('.select-major_id').val();
        }
        if ($('.select-type').val()) {
            params["type"] = $('.select-type').val();
        }
        courseList(params);
    });
    //清除所有筛选条件
    $('#resetValue').on('click' , function  () {
        $('.select-id').val('');
        $('.select-courseName').val('');
        $('.select-couNo').val('');
        $('.select-major_id').val('');
        $('.select-type').val('');
        params = {page:1 , per_page:10 , _csrf:token};
        courseList(params);
    });
    (function(){
        $.ajax({
            url: 'api/course/list-data',
            data: {_csrf:token},
            type: 'post',
            dataTye: 'json',
            success:function(data){
                teacherList = data.teacher , classRoomList = data.classRoom;
                var majorList = [];
                majorList.push({id:'' , text:'请选择所属的专业'});
                if(data.major){
                    for(var i= 0,len =data.major.length; i<len; i++){
                       majorList.push({id:data['major'][i]['id'] , text:data['major'][i]['majorName']});
                    }
                }
                $(".select-major_id").select2({
                    data: majorList,
                    placeholder:'请选择所属的专业',
                    allowClear:true
                });
            }
        })
    })();

    //init edit form
    var getEditSource = function(name){
        switch(name){
            case 'user_id':
                var user = [];
                for (var i=0,len=teacherList.length ; i<len ; i++){
                    if(teacherList[i]['teacher']['department_id'] == htmlData.department_id){
                        user.push({value:teacherList[i]['id'] , text:teacherList[i]['username']});
                    }
                }
                return user;
            case 'type':
                return [
                    {value:0 , text:'选修'},
                    {value:1 , text:'必修'},
                ];
            case 'classroom_id':
                var classroom = [];
                for (var i=0,len=classRoomList.length ; i<len ; i++){
                    if(parseInt(classRoomList[i]['crNumberOfSeat']) >= parseInt(htmlData.number)){
                        classroom.push({value:classRoomList[i]['id'] , text:classRoomList[i]['crBuildingName']+classRoomList[i]['crRoomNo']});
                    }
                }
                return classroom;
            default:
                return null;
        }
    };
    //修改、详情
    function initEditForm(data){
        $.fn.editable.defaults.mode = 'inline';
        $('#course-detail').find("[name='form-edit']").each(function(){
            var name = $(this).attr("data-name");
            var dataType = $(this).attr("data-type");
            var copythis = this;
            var editSource = getEditSource(name);
            var displayValue = data[name];
            var notEdit = false;                                //默认为可编辑
            if($(this).hasClass('notEdit')){notEdit = true;}    //class为notEdit的数据不可编辑
            var options = {
                type: dataType,
                name: name,
                value: displayValue,
                disabled:notEdit,           //是否可编辑，默认为false(可编辑)
                inputclass: "form-control",
                url: function(param){
                    var oldValue = $(copythis).text();
                    var postData = {};
                    postData["_csrf"] = token;
                    postData["edit_name"] = name;
                    postData["edit_value"] = param["value"];
                    postData["id"] = data.id;
                    $.ajax({
                        url:"/api/course/edit",
                        data:postData,
                        dataType:'json',
                        type:'POST',
                        success:function(data){
                            $(copythis).text(intTostr(data[name] , name));
                            htmlData[name] = data[name];
                            if(name == 'active') htmlData['reason'] = null;
                            courseList(params);
                        },
                        error:function(XMLHttpRequest){
                            alert(XMLHttpRequest.responseJSON.message+"");
                            $(copythis).text(oldValue);
                        }
                    });
                },
                validate: function(value){
                    var needValidate = $(copythis).attr("data-need-validate");
                    if(needValidate){
                        var msg = $.validator_tool.checkValue(value, validateRules[name], validateMessages[name]);
                        if(msg){
                            return msg;
                        }
                    }
                }
            };
            //启用下拉框中的下拉选项
            if(editSource){options["source"] = editSource;}
            displayValue = intTostr(displayValue , name);
            if(!displayValue){displayValue="Empty";}
            $(this).text(displayValue).editable('destroy');
            $(this).editable(options);
        });
    }
    function intTostr(value , type){
        if(type == 'type') {
            if (value == 0)return '选修';
            if (value == 1)return '必修';
        }
        if(type == 'user_id'){
            return htmlData.user.username;
        }
        if(type == 'major_id'){
            return htmlData.major.majorName;
        }
        if(type == 'department_id'){
            return htmlData.department.depName;
        }
        if(type == 'classroom_id'){
            return htmlData.classRoom.crBuildingName+htmlData.classRoom.crRoomNo;
        }
        if(type == 'end_time' || type == 'start_time') {return CommonTool.formatTime(value , 'Y年m月d日');}
        return value;
    }

    resetModel = function (model) {
        switch (model){
            case 'edit':
                $("#course-detail").modal("show");
                initEditForm(htmlData);
                break;
        }
    };
    var createButtonList = function(row){
        var buttonList = [];
        buttonList.push("<a name=\"table-button-list\" class='course-edit' type='edit' data-id='"+row+"' ><i class=\"icon-edit\"></i> Edit</a>");
        return buttonList;
    };
    //courseList
    var  oldCondition = params;
    function courseList(params){
        $.ajax({
            url:"/api/course/list",
            data:params,
            dataType:'json',
            type:'POST',
            success:function(data){
                var total = data.total , data = data.data , html = '';
                if(data){
                    if(data.length < total){
                        total = Math.ceil(total/10);
                    }else {
                        total = 1;
                    }

                    //数据列表
                    for (var i=0,len=data.length ; i<len ; i++){
                        var button = createButtonList(data[i]['id']);
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+data[i]["id"]+'</td>';
                        html +='<td>'+data[i]["couNo"]+'</td>';
                        html +='<td>'+data[i]["courseName"]+'</td>';
                        html +='<td>'+data[i]["major"]["majorName"]+'</td>';
                        html +='<td>'+ data[i]['credit'] +'</td>';
                        html +='<td>'+ CommonTool.formatTime(data[i]['start_time'] , 'Y年m月d日') +'</td>';
                        html +='<td>'+  CommonTool.formatTime(data[i]['end_time'] , 'Y年m月d日') +'</td>';
                        html +='<td>'+ data[i]['people'] +'/'+ data[i]['number'] +'</td>';
                        html +='<td>'+ data[i]['user']['username'] +'</td>';
                        html +='<td>'+ intTostr(data[i]['type'] , 'type') +'</td>';
                        html +='<td>'+ button +'</td>';
                        html +='</tr>';
                    }
                    //分页代码
                    var condition = params;
                    var per_page = 5;
                    var number_pages = false;
                    //当页码总数少于要显示的页码数时，显示页码总数
                    if(total < 5){ per_page = total;}
                    //判断筛选条件是否发生了变化
                    if(condition['id'] !== oldCondition['id'] || condition['couNo '] !== oldCondition['couNo '] || condition['courseName'] !== oldCondition['courseName']
                        || condition['type '] !== oldCondition['type '] || condition['major_id'] !== oldCondition['major_id']){
                        number_pages = true;
                        oldCondition = condition;
                    }
                    $('#visible-pages').twbsPagination({
                        //总页数
                        totalPages: total,
                        //显示页码数
                        visiblePages: per_page,
                        //是否刷新页码
                        page: number_pages,
                        version: '1.1'
                    });
                } else {
                    html = '<tr rowspan="4"><td style="text-align: center" colspan="11">No matching records found</td></tr>';
                    $('#visible-pages').empty();
                }
                if(title = 0) $('#visible-pages').empty();
                $('#table-course-list tbody').empty();
                $('#table-course-list tbody').append(html);
                $('.course-edit').click(function(){
                    var dataid = $(this).attr('data-id');
                    for (var i=0 ; i<data.length ; i++){
                        if(dataid == data[i]['id']){
                            htmlData = data[i];             //获取到当前id的所有数据
                        }
                    }
                    var Model = $(this).attr('type');
                    resetModel(Model);
                });
            },
            error:function(XMLHttpRequest){
                alert(XMLHttpRequest.responseJSON.message+"");
            }
        });
    }
    courseList(params);

    var page = 1;
    $('#visible-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            params['page'] = page = dataPage;
            courseList(params);
        }
    });
});