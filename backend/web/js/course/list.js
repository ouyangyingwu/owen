/**
 * Created by admin on 2017/12/30.
 */
$(function(){
    var htmlData,teacherList,studentList,majorList,depList,studentData = {};
    var token = $('meta[name=csrf-token]').attr('content');
    var params = {_csrf:token , per_page:10};

    //按条件筛选数据
    $('#searchResult').on('click' , function  () {
        params = {_csrf:token , per_page:10};
        params["page"] = 1;
        if ($('.select-id').val()) {
            params["id"] = $('.select-id').val();
        }
        if ($('.select-period').val()) {
            params["period"] = $('.select-period').val();
        }
        if ($('.select-courseName').val()) {
            params["courseName"] = $('.select-courseName').val();
        }
        if ($('.select-major_id').val()) {
            params["major_id"] = $('.select-major_id').val();
        }
        if ($('.select-user_id').val()) {
            params["user_id"] = $('.select-user_id').val();
        }
        courseList(params);
    });
    //清除所有筛选条件
    $('#resetValue').on('click' , function  () {
        $('.select-id').val('');
        $('.select-courseName').val('');
        $('.select-period').val('');
        $('.select-major_id').val('');
        $('.select-user_id').val('');
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
                studentList = data.student;
                teacherList = data.teacher;
                majorList = data.major;
                depList = data.department;
                if(teacherList){
                    var html = '';
                    html += '<option value="">请选择负责人</option>';
                    for(var i= 0,len =teacherList.length; i<len; i++){
                        html += '<option value="'+teacherList[i]['id']+'">'+teacherList[i]['username']+'</option>';
                    }
                    $('.select-user_id').append(html);
                }
                if(majorList){
                    var html = '';
                    html += '<option value="">请选择专业</option>';
                    for(var i= 0,len =majorList.length; i<len; i++){
                        html += '<option value="'+majorList[i]['id']+'">'+majorList[i]['majorName']+'</option>';
                    }
                    $('.select-major_id').append(html);
                }
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
            default:
                return null;
        }
    };
    //修改、详情
    function initEditForm(data){
        $('#honor-table').find('.odd').remove();
        if(data.honor){
            var html = '';
            for(var i=0,len = data.honor.length; i<len; i++){
                html += '<tr class="odd" role="row">';
                html +='<td>'+ data['honor'][i]["start_time"] +'</td>';
                html +='<td>'+ data['honor'][i]['type'] +'</td>';
                html +='<td>'+ data['honor'][i]['reason'] +'</td>';
                html +='<td>'+ intTostr(data['honor'][i]['level'] , 'honor.level') +'</td>';
                html +='<td>'+ intTostr(data['honor'][i]['user_id'] , 'user_id') +'</td>';
                html +='<td class="delete-honor" data-id="'+ data['honor'][i]["dataTime"] +'"><i class="icon-trash"></i>删除</td>';
                html +='</tr>';
            }
            $("#honor-table tbody").append(html);
        }
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
            if(dataType == 'select'){
                displayValue = intTostr(displayValue , name);
            }
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
            for (var i=0,len=teacherList.length ; i<len ; i++){
                if(value == teacherList[i]['id']){
                    return teacherList[i]['username'];
                }
            }
        }
        if(type == 'major_id'){
            for (var i=0,len=majorList.length ; i<len ; i++){
                if(value == majorList[i]['id']){
                    return majorList[i]['majorName'];
                }
            }
        }
        if(type == 'department_id'){
            for (var i=0,len=depList.length ; i<len ; i++){
                if(value == depList[i]['id']){
                    return depList[i]['depName'];
                }
            }
        }
        if(type == 'sex') {
            if (value == 1)return '男';
            if (value == 2)return '女';
            if (value == 0)return '第三类性别';
        }
    }
    //显示本班学生
    function student(Refresh){
        Refresh = Refresh?Refresh:false;
        $.ajax({
            url: 'api/user/list-student',
            data: studentData,
            type: 'post',
            typeData: 'json',
            success:function(data){
                var total = data.total;
                var data = data.data;
                var date = new Date() , html = '';
                if(data){
                    total = data.length < total ? Math.ceil(total/2) : 1;

                    //数据列表
                    for (var i=0;i<data.length;i++){
                        var year = date.getFullYear() - CommonTool.formatTime(data[i]["user"]["birth"] , 'Y');
                        var moth = date.getMonth()+1 - CommonTool.formatTime(data[i]["user"]["birth"] , 'm');
                        var age = moth >= 0 ? year : year-1;

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+ data[i]["user"]["username"] +'</td>';
                        html +='<td>'+ data[i]["stuNo"] +'</td>';
                        html +='<td>'+ intTostr(data[i]["user"]["sex"] , 'sex') +'</td>';
                        html +='<td>'+ age +'</td>';
                        html +='<td>'+ data[i]['credit'] +'</td>';
                        html +='<td>'+ data[i]['user']['phone'] +'</td>';
                        html +='<td></td>';
                        //html +='<td>'+ button +'</td>';
                        html +='</tr>';
                    }
                    //分页代码
                    var per_page = 5;
                    //当页码总数少于要显示的页码数时，显示页码总数
                    if(total < 5){ per_page = total;}
                    $('#student-pages').twbsPagination({
                        //总页数
                        totalPages: total,
                        //显示页码数
                        visiblePages: per_page,
                        //是否刷新页码
                        page: Refresh,
                        version: '1.1'
                    });
                } else {
                    html = '<tr rowspan="4" class="odd"><td style="text-align: center" colspan="10">No matching records found</td></tr>';
                    $('#student-pages').empty();
                }
                //if(title = 0) $('#student-pages').empty();
                $('#student-table tbody .odd').empty();
                $('#student-table tbody').append(html);
            }
        })
    }
    //显示添加
    $("#honor").click(function(){
        $('#add-honor').removeClass('hide');
        $('#add-honor [data-name="user_id"]').val(intTostr(htmlData.user_id , 'user_id'));
    });
    //取消添加
    $('#cancel-honor').click(function(){
        $('#add-honor').addClass('hide');
    });
    //添加记录
    $('#insert-honor').click(function(){
        $('#add-honor').addClass('hide');
        var postData = {},value = {},edit_value = htmlData.honor? htmlData.honor:[];
        postData['_csrf'] = token;
        postData['id'] = htmlData['id'];
        $('#add-honor .form-control').each(function(){
            value[$(this).attr('data-name')] = $(this).val();
        });
        value['dataTime'] = Math.round((new Date().getTime())/1000);
        value['user_id'] = htmlData.user_id;
        edit_value.push(value);
        postData['edit_name'] = 'honor';
        postData['edit_value'] = edit_value;
        //console.log(postData);return;
        $.ajax({
            url: 'api/course/edit',
            data: postData,
            type: 'post',
            dataType: 'json',
            success:function(data){
                var html = '';
                html += '<tr class="odd" role="row">';
                html +='<td>'+ value["start_time"] +'</td>';
                html +='<td>'+ value['type'] +'</td>';
                html +='<td>'+ value['reason'] +'</td>';
                html +='<td>'+ value['level'] +'</td>';
                html +='<td>'+ intTostr(value['user_id'] , 'user_id') +'</td>';
                html +='<td class="delete-honor" data-id="'+ value["dataTime"] +'"><i class="icon-trash"></i>删除</td>';
                html +='</tr>';
                $("#honor-table tbody").append(html);
                htmlData.honor = edit_value;
            }
        });
    });
    //删除记录（detail列表内的记录）
    $('#honor-table').on('click', '.delete-honor' , function(){
        var id = $(this).attr('data-id');
        var postData = {};
        for(var i = 0,len = htmlData.honor.length ; i<len ; i++){
            if($(this).attr('data-id') == htmlData['honor'][i]['dataTime']){
                htmlData.honor.splice(i , 1);
            }
        }
        postData['_csrf'] = token;
        postData['id'] = htmlData['id'];
        postData['edit_name'] = 'honor';
        postData['edit_value'] = htmlData.honor;
        $(this).parents('.odd').remove();
        $.ajax({
            url: 'api/course/edit',
            data: postData,
            type: 'post'
        });
        return;
    });

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

    resetModel = function (model) {
        switch (model){
            case 'edit':
                $("#course-detail").modal("show");
                /*studentData['_csrf'] = token;
                studentData['per_page'] = 2;
                studentData['course_id'] = htmlData.id;
                studentData['page'] = 1;
                student(true);*/
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
                var total = data.total;
                var data = data.data;
                var html = '';
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
                    if(condition['id'] !== oldCondition['id'] || condition['crNo '] !== oldCondition['crNo '] || condition['crNumberOfSeat'] !== oldCondition['crNumberOfSeat']
                        || condition['crBuildingName '] !== oldCondition['crBuildingName '] || condition['crRoomNo'] !== oldCondition['crRoomNo']){
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
                    html = '<tr rowspan="4"><td style="text-align: center" colspan="10">No matching records found</td></tr>';
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
    var studentPage = 1;
    $('#student-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != studentPage){
            studentData['page'] = studentPage = dataPage;
            student();
        }
    });
});