/**
 * Created by admin on 2017/9/27.
 */

$(function(){
    //if(!$.cookie['user']){window.location.href = "/site/login";}
    var htmlData;
    var token = $('meta[name=csrf-token]').attr('content');
    var params = {_csrf:token , per_page:10};

    var department , major , team;
    (function(){
        var postDate = {};
        postDate['_csrf'] = token;
        $.ajax({
            url: 'api/user/list-data',
            data: postDate,
            type: 'post',
            dataType: 'json',
            success:function(data){
                department = data.department;
                major = data.major;
                team = data.team;
            }
        })
    })();

    //按条件筛选数据
    $('#searchResult').on('click' , function  () {
        params = {_csrf:token , per_page:10};
        params["page"] = 1;
        if ($('.select-id').val()) {
            params["id"] = $('.select-id').val();
        }
        if ($('.select-username').val()) {
            params["username"] = $('.select-username').val();
        }
        if ($('.select-phone').val()) {
            params["phone"] = $('.select-phone').val();
        }
        if ($('.select-email').val()) {
            params["email"] = $('.select-email').val();
        }
        if ($('.select-type').val()) {
            params["type"] = $('.select-type').val();
        }
        userList(params);
    });
    //清除所有筛选条件
    $('#resetValue').on('click' , function  () {
        $('.select-id').val('');
        $('.select-type').val('');
        $('.select-user_id').val('');
        params = {page:1 , per_page:10 , _csrf:token};
        userList(params);
    });

    //二级列表
    function towForm(data , type , RewardOrPunish){
        var html = '', value = data[type][RewardOrPunish];
        if(data[type][RewardOrPunish] && RewardOrPunish == 'reward'){
            for (var i=0 ; i<data[type][RewardOrPunish].length ; i++){
                html += '<tr class="odd" role="row">';
                html +='<td>'+ (value[i]["reward_time"]?value[i]["reward_time"]:'') +'</td>';
                html +='<td>'+ (value[i]['reward_name']?value[i]['reward_name']:'') +'</td>';
                html +='<td>'+ (value[i]['reward_type']?intTostr(value[i]['reward_type'] , 'reward_type'):'') +'</td>';
                html +='<td>'+ (value[i]['reward_ranking']?intTostr(value[i]['reward_ranking'] , 'reward_ranking'):'') +'</td>';
                html +='<td>'+ (value[i]['reward_level']?intTostr(value[i]['reward_level'] , 'reward_level'):'') +'</td>';
                html +='<td class="delete-reward" data-id="'+value[i]['dataTime']+'"><i class="icon-trash"></i>删除</td>';
                html +='</tr>';
            }
            $("#reward-table tbody").append(html);return;
        }
        if(data[type][RewardOrPunish] && RewardOrPunish == 'punish'){
            for (var i=0 ; i<data[type][RewardOrPunish].length ; i++){
                html += '<tr class="odd" role="row">';
                html +='<td>'+ (value[i]["punish_time"]?value[i]["punish_time"]:'') +'</td>';
                html +='<td>'+ (value[i]['punish_reason']?value[i]['punish_reason']:'') +'</td>';
                html +='<td>'+ (value[i]['punish_content']?intTostr(value[i]['punish_content'] , 'punish_content'):'') +'</td>';
                html +='<td class="delete-punish" data-id="'+value[i]['dataTime']+'"><i class="icon-trash"></i>删除</td>';
                html +='</tr>';
            }
            $("#punish-table tbody").append(html)
        }
    }
    //init edit form
    var getEditSource = function(name){
        switch(name){
            case 'active':
                return [
                    {value: 1, text: '激活冻结'},
                    {value: 0, text: 'Freeze'}
                ];break;
            case 'sex':
                return [
                    {value: 0, text: '第三性别'},
                    {value: 1, text: '男'},
                    {value: 2, text: '女'},
                ];break;
            case 'student.department_id':
            case 'teacher.department_id':
                var departmentList = [];
                for(var i = 0,len = department.length; i<len; i++){
                    departmentList.push({value: department[i]['id'], text: department[i]['depName']});
                }
                return departmentList;break;
            case 'student.major_id':
                var majorList = [];
                for(var i = 0,len = myMajor.length; i<len; i++){
                    majorList.push({value: myMajor[i]['id'], text: myMajor[i]['majorName']});
                }
                return majorList;break;
            case 'student.team_id':
                var teamList = [];
                for(var i = 0,len = myTeam.length; i<len; i++){
                    teamList.push({value: myTeam[i]['id'], text: myTeam[i]['teamName']});
                }
                return teamList;break;
            case 'student.status':
                return [
                    {value: 0, text: '开除'},
                    {value: 1, text: '在读'},
                    {value: 2, text: '毕业'},
                    {value: 3, text: '休学'},
                    {value: 4, text: '退学'},
                    {value: 5, text: '考研'},
                    {value: 6, text: '硕博'},
                    {value: 7, text: '其他'},

                ];break;
            case 'admin.purview':
                return [
                    {value: 1, text: '信息查看员'},
                    {value: 2, text: '信息管理员'},
                    {value: 10, text: '管理员'},
                ];break;
            default:
                return null;
        }
    };
    //修改、详情
    function initEditForm(data){
        //$("#iframe-image-show").empty();
        $('#reward-table').find('.odd').remove();
        $('#punish-table').find('.odd').remove();
        var $type = data.student ? 'student' : (data.teacher?'teacher':'admin');
        $('#'+$type).removeClass('hide').siblings().addClass('hide');
        towForm(data , $type , 'reward');
        towForm(data , $type , 'punish');

        $.fn.editable.defaults.mode = 'inline';
        $('#user-detail').find("[name='form-edit']").each(function(){
            if(!$(this).parents('fieldset').hasClass('hide')){
                var name = $(this).attr("data-name");
                var dataType = $(this).attr("data-type");
                var copythis = this;
                var editSource = getEditSource(name);
                var displayValue = eval("data." + name);
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
                        postData["id"] = data.id;
                        postData["edit_value"] = param["value"];
                        postData["edit_name"] = name;
                        if(name.split('.').length == 2){
                            postData["type"] = name.split('.')[0];
                            postData["edit_name"] = name.split('.')[1];
                            postData["id"] = data[(name.split('.')[0])]['id'];
                        }
                        $.ajax({
                            url:"/api/user/edit",
                            data:postData,
                            dataType:'json',
                            type:'POST',
                            success:function(data){
                                if(name.split('.').length == 2){
                                    $(copythis).text(intTostr(data[name.split('.')[1]] , name));
                                    htmlData[name.split('.')[0]][name.split('.')[1]] = data[name.split('.')[1]];
                                    if(name.split('.')[1] == 'department_id' && name.split('.')[0] == 'student'){
                                        htmlData['student']['team_id'] = 0;
                                    }
                                    resetModel('edit');
                                    return;
                                }
                                $(copythis).text(intTostr(data[name] , name));
                                userList(params);
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
            }
            //启用下拉框中的下拉选项
            if(editSource){options["source"] = editSource;}
            //为data-name为describe的项做数据验证
            switch (name){}
            if(dataType == 'select'){
                displayValue = intTostr(displayValue , name);
            }
            if(name == 'birth'){displayValue = CommonTool.formatTime(displayValue , 'm月d日');}
            if(!displayValue){displayValue="Empty";}
            $(this).text(displayValue).editable('destroy');
            $(this).editable(options);
        });
    }
    function intTostr(value , type){
        if(type == 'active') {
            if (value == 1) return '激活';
            if (value == 0) return '冻结';
        }
        if(type == 'sex') {
            if (value == 1)return '男';
            if (value == 2)return '女';
            if (value == 0)return '第三类性别';
        }
        if(type == 'type') {
            if (value == 1) return '学生';
            if (value == 2) return '教职工';
            if(value == 3) return '管理员';
        }
        if(type == 'student.department_id' || type == 'teacher.department_id'){
            for(var i = 0,len = department.length; i<len; i++){
                if(value == department[i]['id']){
                    return value = department[i]['depName'];
                }
            }
        }
        if(type == 'student.major_id'){
            for(var i = 0,len = myMajor.length; i<len; i++){
                if(value == myMajor[i]['id']){
                    return value = myMajor[i]['majorName'];
                }
            }
        }
        if(type == 'student.team_id'){
            for(var i = 0,len = myTeam.length; i<len; i++){
                if(value == myTeam[i]['id']){
                    return value = myTeam[i]['teamName'];
                }
            }
        }
        if(type == 'student.status'){
            if(value == 1) return '在读';
            if(value == 2) return '毕业';
            if(value == 3) return '休学';
            if(value == 4) return '退学';
            if(value == 5) return '考研';
            if(value == 6) return '硕博';
            if(value == 7) return '其他';
        }
        if(type == 'admin.purview'){
            if(value == 1) return '信息查看员';
            if(value == 2) return '信息管理员';
            if(value == 10) return '管理员';
        }
        if(type == 'reward_type'){
            if(value == 0) return '奖助学金';
            if(value == 1) return '奥数比赛';
            if(value == 2) return '演讲比赛';
            if(value == 3) return '文章发表';
            if(value == 4) return '运动会';
            if(value == 5) return '书法文艺';
            if(value == 6) return '音乐舞蹈';
            if(value == 7) return '其他';
        }
        if(type == 'reward_ranking'){
            if(value == 0) return '此类比赛无名次';
            if(value == 1) return '第一名';
            if(value == 2) return '第二名';
            if(value == 3) return '第三名';
            if(value == 4) return '特等奖';
            if(value == 5) return '参与奖';
        }
        if(type == 'reward_level'){
            if(value == 1) return '奖助学金';
            if(value == 2) return '班级';
            if(value == 3) return '院校级';
            if(value == 4) return '市级';
            if(value == 5) return '省级';
            if(value == 6) return '国家级';
            if(value == 7) return '世界级';
        if(value == 7) return '世界级';
        }
        if(type == 'punish_content'){
            if(value == 0) return '请选择';
            if(value == 1) return '警告处分';
            if(value == 2) return '记小过一次';
            if(value == 3) return '记大过一次';
            if(value == 4) return '留校查看';
            if(value == 5) return '劝退';
            if(value == 6) return '开除';
            if(value == 7) return '其他';
        }
    }
    //显示添加
    $("#add-reward").click(function(){
        $('#form-add-reward').removeClass('hide');
    });
    $("#add-punish").click(function(){
        $('#form-add-punish').removeClass('hide');
    });
    //取消添加
    $('#cancel-reward').click(function(){
        $('#form-add-reward').addClass('hide');
    });
    $('#cancel-punish').click(function(){
        $('#form-add-punish').addClass('hide');
    });
    //添加记录
    $('#insert-reward').click(function(){
        insertRewardOrPunish('reward');
        $('#form-add-reward').addClass('hide');
    });
    $('#insert-punish').click(function(){
        insertRewardOrPunish('punish');
        $('#form-add-punish').addClass('hide');
    });
    //删除记录（detail列表内的记录）
    $('#reward-table').on('click', '.delete-reward' , function(){
        var $this = this;
        deleteRewardOrPunish($this , 'reward');
    });
    $('#punish-table').on('click', '.delete-punish' , function(){
        var $this = this;
        deleteRewardOrPunish($this , 'punish');
    });
    function insertRewardOrPunish(RewardOrPunish){
        var postData = {},value = {};
        var $type = htmlData.student ? 'student' : (htmlData.teacher?'teacher':'admin');
        var edit_value = htmlData[$type] && htmlData[$type][RewardOrPunish] ? htmlData[$type][RewardOrPunish] : [];
        postData['_csrf'] = token;
        postData['id'] = htmlData[$type]['id'];
        postData['type'] = $type;
        if(RewardOrPunish == 'reward'){
            $("#form-add-reward .form-control").each(function(){
                value[$(this).attr('data-name')] = $(this).val();
            });
        }else  if(RewardOrPunish == 'punish'){
            $("#form-add-punish .form-control").each(function(){
                value[$(this).attr('data-name')] = $(this).val();
            });
        }
        value['dataTime'] = Math.round((new Date().getTime())/1000);
        edit_value.push(value);
        postData['edit_name'] = RewardOrPunish;
        postData['edit_value'] = edit_value;
        htmlData[$type][RewardOrPunish] = edit_value;
        $.ajax({
            url: 'api/user/edit',
            data: postData,
            type: 'post',
            dataType: 'json',
            success:function(data){
                var html = '';
                if(RewardOrPunish == 'reward'){
                    html += '<tr class="odd" role="row">';
                    html +='<td>'+ value["reward_time"] +'</td>';
                    html +='<td>'+ value['reward_name'] +'</td>';
                    html +='<td>'+ intTostr(value['reward_type'] , 'reward_type')+'</td>';
                    html +='<td>'+ intTostr(value['reward_ranking'] , 'reward_ranking')+'</td>';
                    html +='<td>'+ intTostr(value['reward_level'] , 'reward_level')+'</td>';
                    html +='<td class="delete-reward" data-id="'+ value["dataTime"] +'"><i class="icon-trash"></i>删除</td>';
                    html +='</tr>';
                    $("#reward-table tbody").append(html);return;
                }
                if(RewardOrPunish == 'punish'){
                    html += '<tr class="odd" role="row">';
                    html +='<td>'+ value["punish_time"] +'</td>';
                    html +='<td>'+ value['punish_reason'] +'</td>';
                    html +='<td>'+ intTostr(value['punish_content'] , 'punish_content')+'</td>';
                    html +='<td class="delete-punish" data-id="'+ value["dataTime"] +'"><i class="icon-trash"></i>删除</td>';
                    html +='</tr>';
                    $("#punish-table tbody").append(html);return;
                }
            }
        });
    }
    function deleteRewardOrPunish($this , RewardOrPunish){
        var id = $($this).attr('data-id');
        var $type = htmlData.student ? 'student' : (htmlData.teacher?'teacher':'admin');
        var reward = htmlData[$type][RewardOrPunish];
        var postData = {};
        for(var i = 0,len = reward.length ; i<len ; i++){
            if(id == reward[i]['dataTime']){
                reward.splice(i , 1);
            }
        }
        postData['_csrf'] = token;
        postData['id'] = htmlData[$type]['id'];
        postData['type'] = $type;
        postData['edit_name'] = RewardOrPunish;
        postData['edit_value'] = reward;
        $($this).parents('.odd').remove();
        $.ajax({
            url: 'api/user/edit',
            data: postData,
            type: 'post',
            dataType: 'json'
        });
        return;
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

    //删除
    $("#doConfirm").click(function(){
        var dataType = $(this).parent().parent().attr('data-type');
        var postData = {};
        postData["_csrf"] = token;
        switch (dataType){
            case 'img_url':
                postData["name"] = $(this).parent().parent().attr('data-value');
                postData["url"] = 'image';
                $.ajax({
                    url:"/api/file/delete",
                    data:postData,
                    dataType:'json',
                    type:'POST',
                    success:function(data){
                        $("#dialog-confirm").modal("hide");
                    },
                    error:function(XMLHttpRequest){
                        alert(XMLHttpRequest.responseJSON.message+"");
                        $(copythis).text(oldValue);
                    }
                });break;
            case 'is_delete':
                postData["edit_name"] = 'is_delete';
                postData["edit_value"] = 1;
                postData["id"] = htmlData.id;
                $.ajax({
                    url:"/api/user/edit",
                    data:postData,
                    dataType:'json',
                    type:'POST',
                    success:function(data){
                        $("#dialog-confirm").modal("hide");
                        userList(params);
                    },
                    error:function(XMLHttpRequest){
                        alert(XMLHttpRequest.responseJSON.message+"");
                        $(copythis).text(oldValue);
                    }
                });break;
        }
    });
    var myMajor, myTeam;
    resetModel = function (model) {
        switch (model){
            case 'edit':
                $("#user-detail").modal("show");
                if(htmlData.type == 1) {
                    myMajor = []; myTeam = [];
                    for(var i= 0,len=major.length; i<len ; i++){
                        if(major[i]['department_id'] == htmlData.student.department_id){
                            myMajor.push(major[i]);
                        }
                    }
                    for(var i= 0,len=team.length; i<len ; i++){
                        if(team[i]['major_id'] == htmlData.student.major_id){
                            myTeam.push(team[i]);
                        }
                    }
                   // $('a[data-name="student.team_id"]').text('6546546');

                }
                initEditForm(htmlData);
                break;
            case 'delete':
                $("#dialog-confirm").modal("show").find('p').text("你是否要删除这个用户？");
                $("#dialog-confirm").attr('data-type' , 'is_delete');
                break;
        }
    };
    var createButtonList = function(row){
        var buttonList = [];
        buttonList.push("<a name=\"table-button-list\" class='user-edit' type='edit' data-id='"+row+"' ><i class=\"icon-edit\"></i> Edit</a>");
        buttonList.push("<a name=\"table-button-list\" class='user-edit' type='delete' data-id='"+row+"' ><i class=\"icon-trash\"></i> Remove</a>");
        return buttonList;
    };
    //userList
    var  oldCondition = params;
    function userList(params){
        $.ajax({
            url:"/api/user/list",
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
                        var button = createButtonList(data[i]['id'])
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+data[i]["id"]+'</td>';
                        html +='<td>'+ data[i]['username'] +'</td>';
                        html +='<td>'+ data[i]['email']+'</td>';
                        html +='<td>'+ data[i]['phone']+'</td>';
                        html +='<td>'+ intTostr(data[i]['sex'] , 'sex') +'</td>';
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
                    if(condition['id'] !== oldCondition['id'] || condition['username'] !== oldCondition['username']
                        || condition['email'] !== oldCondition['email'] || condition['phone'] !== oldCondition['phone']){
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
                $('#table-user-list tbody').empty();
                $('#table-user-list tbody').append(html);
                $('.user-edit').click(function(){
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
    userList(params);

    var page = 1;
    $('#visible-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            params['page'] = page = dataPage;
            userList(params);
        }
    });
});