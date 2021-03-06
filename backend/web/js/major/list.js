/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    var htmlData,userList,departmentList,teamList;
    var token = $('meta[name=csrf-token]').attr('content');
    var params = {_csrf:token , per_page:10};

    //按条件筛选数据
    $('#searchResult').on('click' , function  () {
        params = {_csrf:token , per_page:10};
        params["page"] = 1;
        if ($('.select-id').val()) {
            params["id"] = $('.select-id').val();
        }
        if ($('.select-user_id').val()) {
            console.log($('.select-user_id').val());
            params["user_id"] = $('.select-user_id').val();
        }
        if ($('.select-majorNo').val()) {
            params["majorNo"] = $('.select-majorNo').val();
        }
        if ($('.select-majorName').val()) {
            params["majorName"] = $('.select-majorName').val();
        }
        if ($('.select-majorCred').val()) {
            params["majorCred"] = $('.select-majorCred').val();
        }
        if ($('.select-department_id').val()) {
            params["department_id"] = $('.select-department_id').val();
        }
        console.log(params);
        MajorList(params);
    });
    //清除所有筛选条件
    $('#resetValue').on('click' , function  () {
        $('.select-id').val('');
        $('.select-user_id').val('');
        $('.select-majorNo').val('');
        $('.select-majorName').val('');
        $('.select-majorCred').val('');
        $('.select-department_id').val('');
        params = {page:1 , per_page:10 , _csrf:token};
        MajorList(params);
    });
    (function(){
        $.ajax({
            url: 'api/major/list-data',
            data: {_csrf:token},
            type: 'post',
            dataTye: 'json',
            success:function(data){
                userList = data.teacher;
                departmentList = data.department;
                teamList = data.team;
                if(userList){
                    var html = '';
                    html += '<option value="">请选择负责人</option>';
                    for(var i= 0,len =userList.length; i<len; i++){
                        html += '<option value="'+userList[i]['id']+'">'+userList[i]['username']+'</option>';
                    }
                    $('.select-user_id').append(html);
                }
                if(departmentList){
                    var html = '';
                    html += '<option value="">请选择系</option>';
                    for(var i= 0,len =departmentList.length; i<len; i++){
                        html += '<option value="'+departmentList[i]['id']+'">'+departmentList[i]['depName']+'</option>';
                    }
                    $('.select-department_id').append(html);
                }
                MajorList(params);
            }
        })
    })();

    //init edit form
    var getEditSource = function(name){
        switch(name){
            case 'user_id':
                var user = [];
                for (var i=0,len=userList.length ; i<len ; i++){
                    if(userList[i]['teacher']['department_id'] == htmlData['department_id']){
                        user.push({value:userList[i]['id'] , text:userList[i]['username']});
                    }
                }
                return user;
            case 'department_id':
                var department = [];
                for (var i=0,len=departmentList.length ; i<len ; i++){
                    department.push({value:departmentList[i]['id'] , text:departmentList[i]['depName']});
                }
                return department;
            default:
                return null;
        }
    };
    //修改、详情
    function initEditForm(data){
        $('#team-table').find('.odd').remove();
        if(teamList){
            var html = '';
            for(var i=0,len = teamList.length; i<len; i++){
                if(teamList[i]['major_id'] == data.id){
                    html += '<tr class="odd" role="row">';
                    html +='<td>'+ teamList[i]["teamName"] +'</td>';
                    html +='<td>'+ intTostr(teamList[i]['user_id'] , 'user_id') +'</td>';
                    html +='<td>'+ teamList[i]['period'] +'</td>';
                    html +='<td>'+ data.majorName +'</td>';
                    html +='<td>'+ teamList[i]['people']+'/'+teamList[i]['number_limit'] +'</td>';
                    html +='<td></td>';
                    html +='</tr>';
                }
            }
            $("#team-table tbody").append(html);
        }
        $.fn.editable.defaults.mode = 'inline';
        $('#major-detail').find("[name='form-edit']").each(function(){
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
                        url:"/api/major/edit",
                        data:postData,
                        dataType:'json',
                        type:'POST',
                        success:function(data){
                            $(copythis).text(intTostr(data[name] , name));
                            htmlData[name] = data[name];
                            if(name == 'active') htmlData['reason'] = null;
                            MajorList(params);
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
            if(name == 'create_time'){displayValue = CommonTool.formatTime(displayValue , 'Y年m月d日')}
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
            for (var i=0 , len=userList.length ; i<len ; i++){
                if(value == userList[i]['id']){
                    return userList[i]['username'];
                }
            }
        }
        if(type == 'department_id'){
            for (var i=0 , len=departmentList.length ; i<len ; i++){
                if(value == departmentList[i]['id']){
                    return departmentList[i]['depName'];
                }
            }
        }
    }
    function addTeam(){
        var teamName,timestamp ,number = [],html='', date = new Date();
        timestamp  = (date.getMonth()+1) < 9 ? date.getFullYear() : date.getFullYear()+1;
        for (var i=0 , len=teamList.length ; i<len ; i++){
            if(teamList[i]['major_id'] == htmlData.id && teamList[i]['period'] == timestamp ){
                number.push(CommonTool.ChineseToNumber(teamList[i]['teamName'].substr(2,1)));
            }
        }
        teamName = htmlData.majorName + CommonTool.NumberToChinese(number.length+1) +'班';
        for (var i=0 , len=userList.length ; i<len ; i++){
            if(userList[i]['teacher']['department_id'] == htmlData.department_id){
                html += '<option value="'+ userList[i]['id'] +'">'+ userList[i]['username'] +'</option>';
            }
        }
        $('#add-team [data-name="major_id"]').val(htmlData.majorName);
        $('#add-team [data-name="teamName"]').val(teamName);
        $('#add-team [data-name="user_id"]').append(html);
        $('#add-team [data-name="period"]').val(timestamp );
    }
    //显示添加
    $("#team").click(function(){
        $('#add-team').removeClass('hide');
        addTeam();
    });
    //取消添加
    $('#cancel-team').click(function(){
        $('#add-team').addClass('hide');
    });
    //添加记录
    $('#insert-team').click(function(){
        $('#add-team').addClass('hide');
        var postData = {};
        postData['_csrf'] = token;
        postData['major_id'] = htmlData['id'];
        $('#add-team .form-control').each(function(){
            postData[$(this).attr('data-name')] = $(this).val();
        });
        postData['major_id'] = htmlData.id;
        $.ajax({
            url: 'api/team/add',
            data: postData,
            type: 'post',
            dataType: 'json',
            success:function(data){
                var html = '';
                data.people = 0;
                html += '<tr class="odd" role="row">';
                html +='<td>'+ data["teamName"] +'</td>';
                html +='<td>'+ intTostr(data['user_id'] , 'user_id') +'</td>';
                html +='<td>'+ data['period'] +'</td>';
                html +='<td>'+ htmlData.majorName +'</td>';
                html +='<td>'+ data['people']+'/'+data['number_limit'] +'</td>';
                html +='<td></td>';
                html +='</tr>';
                $("#team-table tbody").append(html);
                teamList.push(data);
            }
        });
    });
    //删除记录（detail列表内的记录）
    $('#major-table').on('click', '.delete-major' , function(){
        var id = $(this).attr('data-id');
        var postData = {};
        for(var i = 0,len = htmlData.maintain.length ; i<len ; i++){
            if($(this).attr('data-id') == htmlData['maintain'][i]['dataTime']){
                htmlData.maintain.splice(i , 1);
            }
        }
        postData['_csrf'] = token;
        postData['id'] = htmlData['id'];
        postData['edit_name'] = 'maintain';
        postData['edit_value'] = htmlData.maintain;
        $(this).parents('.odd').remove();
        $.ajax({
            url: 'api/major/edit',
            data: postData,
            type: 'post'
        });
        return;
    });

    resetModel = function (model) {
        switch (model){
            case 'edit':
                $("#major-detail").modal("show");
                initEditForm(htmlData);
                break;
        }
    };
    var createButtonList = function(row){
        var buttonList = [];
        buttonList.push("<a name=\"table-button-list\" class='major-edit' type='edit' data-id='"+row+"' ><i class=\"icon-edit\"></i> Edit</a>");
        return buttonList;
    };
    //MajorList
    var  oldCondition = params;
    function MajorList(params){
        $.ajax({
            url:"/api/major/list",
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
                    for (var i=0,len =data.length ; i<len ; i++){
                        var button = createButtonList(data[i]['id']);
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+data[i]["id"]+'</td>';
                        html +='<td>'+data[i]["majorNo"]+'</td>';
                        html +='<td>'+ intTostr(data[i]['user_id'] , 'user_id') +'</td>';
                        html +='<td>'+ data[i]['majorName']+'</td>';
                        html +='<td>'+ data[i]['majorCred'] +'</td>';
                        html +='<td>'+ intTostr(data[i]['department_id'] , 'department_id') +'</td>';
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
                $('#table-major-list tbody').empty();
                $('#table-major-list tbody').append(html);
                $('.major-edit').click(function(){
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

    var page = 1;
    $('#visible-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            params['page'] = page = dataPage;
            MajorList(params);
        }
    });
});