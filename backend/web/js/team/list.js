/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    var htmlData,teacherList,studentList,majorList,depList;
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
        if ($('.select-teamName').val()) {
            params["teamName"] = $('.select-teamName').val();
        }
        if ($('.select-major_id').val()) {
            params["major_id"] = $('.select-major_id').val();
        }
        if ($('.select-user_id').val()) {
            params["user_id"] = $('.select-user_id').val();
        }
        teamList(params);
    });
    //清除所有筛选条件
    $('#resetValue').on('click' , function  () {
        $('.select-id').val('');
        $('.select-teamName').val('');
        $('.select-period').val('');
        $('.select-major_id').val('');
        $('.select-user_id').val('');
        params = {page:1 , per_page:10 , _csrf:token};
        teamList(params);
    });
    (function(){
        $.ajax({
            url: 'api/team/list-data',
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
        $('#team-detail').find("[name='form-edit']").each(function(){
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
                        url:"/api/team/edit",
                        data:postData,
                        dataType:'json',
                        type:'POST',
                        success:function(data){
                            $(copythis).text(intTostr(data[name] , name));
                            htmlData[name] = data[name];
                            if(name == 'active') htmlData['reason'] = null;
                            teamList(params);
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
        if(type == 'honor.level'){
            if(value == 1) return '专业级';
            if(value == 2) return '系级';
            if(value == 3) return '院级';
            if(value == 4) return '校级';
            if(value == 5) return '多校级';
        }
    }
    //显示本班学生
    function student(team){
        var postData = {};
        postData["_csrf"] = token;
        $.({
            url: 'api/user/list-student',
            data: postData,
            type: 'post',
            typeData: 'json',
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
                    for (var i=0;i<data.length;i++){
                        var button = createButtonList(data[i]['id']);
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+data[i]["id"]+'</td>';
                        html +='<td>'+data[i]["teamName"]+'</td>';
                        html +='<td>'+ data[i]['period'] +'</td>';
                        html +='<td>'+ data[i]['major']['majorName'] +'</td>';
                        html +='<td>'+ data[i]['department']['depName'] +'</td>';
                        html +='<td>'+ data[i]['people'] +'/'+ data[i]['number_limit'] +'</td>';
                        html +='<td>'+ data[i]['user']['username'] +'</td>';
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
                    html = '<tr rowspan="4"><td style="text-align: center" colspan="7">No matching records found</td></tr>';
                    $('#visible-pages').empty();
                }
                if(title = 0) $('#visible-pages').empty();
                $('#table-team-list tbody').empty();
                $('#table-team-list tbody').append(html);
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
            url: 'api/team/edit',
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
            url: 'api/team/edit',
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
                $("#team-detail").modal("show");
                initEditForm(htmlData);
                break;
        }
    };
    var createButtonList = function(row){
        var buttonList = [];
        buttonList.push("<a name=\"table-button-list\" class='team-edit' type='edit' data-id='"+row+"' ><i class=\"icon-edit\"></i> Edit</a>");
        return buttonList;
    };
    //teamList
    var  oldCondition = params;
    function teamList(params){
        $('.content').removeClass('hide');  //圈圈显示
        $.ajax({
            url:"/api/team/list",
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
                    for (var i=0;i<data.length;i++){
                        var button = createButtonList(data[i]['id']);
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+data[i]["id"]+'</td>';
                        html +='<td>'+data[i]["teamName"]+'</td>';
                        html +='<td>'+ data[i]['period'] +'</td>';
                        html +='<td>'+ data[i]['major']['majorName'] +'</td>';
                        html +='<td>'+ data[i]['department']['depName'] +'</td>';
                        html +='<td>'+ data[i]['people'] +'/'+ data[i]['number_limit'] +'</td>';
                        html +='<td>'+ data[i]['user']['username'] +'</td>';
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
                    html = '<tr rowspan="4"><td style="text-align: center" colspan="7">No matching records found</td></tr>';
                    $('#visible-pages').empty();
                }
                if(title = 0) $('#visible-pages').empty();
                $('#table-team-list tbody').empty();
                $('#table-team-list tbody').append(html);
                $('.team-edit').click(function(){
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
    teamList(params);

    var page = 1;
    $('#visible-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            params['page'] = page = dataPage;
            teamList(params);
        }
    });
});