/**
 * Created by admin on 2018/1/5.
 */
$(function() {
    var htmlData, department,major,team;
    var token = $('meta[name=csrf-token]').attr('content');
    var params = {_csrf:token , per_page:10},page = 1,stuStatua_old,stuStatua = 1,teaStatua_old,teaStatua = 1;
    function todo(){
        $.ajax({
            url: 'api/dashboard/todo',
            data: params,
            type: 'post',
            dataType: 'json',
            success:function(data){
                if(data.overCount){
                    $('.overView .todolist').each(function(){
                        var dataName = $(this).attr('data-name');
                        if(data.overCount[dataName]){
                            $(this).find('p').text(data.overCount[dataName]);
                        }
                    });
                }
                if(data.stuStatus){
                    $('.stuStatus .gray').each(function(){
                        var dataName = $(this).attr('data-name');
                        if(data.stuStatus[dataName]){
                            $(this).find('.small').text(data.stuStatus[dataName]);
                        }
                    });
                }
                if(data.teaStatus){
                    $('.teaStatus .gray').each(function(){
                        var dataName = $(this).attr('data-name');
                        if(data.teaStatus[dataName]){
                            $(this).find('.small').text(data.teaStatus[dataName]);
                        }
                    });
                }
                if(data.course){
                    $('.round .easypiechart').each(function(){
                        var dataName = $(this).attr('data-name');
                        if(data.course[dataName]){
                            $(this).attr('data-percent',data.course[dataName]).children().children().text(data.course[dataName]);
                        }
                    });
                    $('#teal').easyPieChart({
                        scaleColor: false,
                        barColor: '#1ebfae'
                    });
                    $('#orange').easyPieChart({
                        scaleColor: false,
                        barColor: '#ffb53e'
                    });
                    $('#red').easyPieChart({
                        scaleColor: false,
                        barColor: '#f9243f'
                    });
                    $('#blue').easyPieChart({
                        scaleColor: false,
                        barColor: '#30a5ff'
                    });
                }
                if(data.newStudent){
                    var newStudent = [];
                    for(var tmp in data.newStudent){
                        newStudent.push({x:tmp , value:data['newStudent'][tmp]});
                    };
                    /* 折线图（无底色）
                     ----------------------------------------*/
                    Morris.Line({
                        element: 'morris-line-chart',
                        data: newStudent,
                        xkey: 'x',
                        ykeys: ['value'],
                        labels: ['每年届人数'],
                        fillOpacity: 0.6,
                        hideHover: 'auto',
                        behaveLikeLine: true,
                        resize: false,
                        pointFillColors:['#ffffff'],
                        pointStrokeColors: ['black'],
                        lineColors:['gray','#24C2CE']

                    });
                    mainApp.initFunction();
                    mainApp.Conversion();
                }
            }
        })
    }
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
        todo();
    })();

    var mainApp = {
        initFunction: function () {
            /* 直方图
             -----------------------------------------*/
            /*Morris.Bar({
             element: 'morris-bar-chart',
             data: [{
             y: '2006',
             a: 100,
             b: 90
             }, {
             y: '2007',
             a: 75,
             b: 65
             }, {
             y: '2008',
             a: 50,
             b: 40
             }, {
             y: '2009',
             a: 75,
             b: 65
             }, {
             y: '2010',
             a: 50,
             b: 40
             }, {
             y: '2011',
             a: 75,
             b: 65
             }, {
             y: '2012',
             a: 100,
             b: 90
             }],
             xkey: 'y',
             ykeys: ['a', 'b'],
             labels: ['Series A', 'Series B'],
             barColors: [
             '#A6A6A6','#24C2CE',
             '#A8E9DC'
             ],
             hideHover: 'auto',
             resize: true
             });

             /!* 圆形图
             ----------------------------------------*!/
             Morris.Donut({
             element: 'morris-donut-chart',
             data: [{
             label: "Download Sales",
             value: 12
             }, {
             label: "In-Store Sales",
             value: 60
             }/!*, {
             label: "Mail-Order Sales",
             value: 28
             }*!/],
             colors: [
             '#A6A6A6','#24C2CE',
             //'#A8E9DC'
             ],
             resize: true
             });*/

            /* 折线图加底色
             ----------------------------------------*/
            Morris.Area({
                element: 'morris-area-chart',
                data: [
                    {period: '2010 Q1', iphone: 2666, ipad: null, itouch: 2647},
                    {period: '2010 Q2', iphone: 2778, ipad: 2294, itouch: 2441},
                    {period: '2010 Q3', iphone: 4912, ipad: 1969, itouch: 2501},
                    {period: '2010 Q4', iphone: 3767, ipad: 3597, itouch: 5689},
                    {period: '2011 Q1', iphone: 6810, ipad: 1914, itouch: 2293},
                    {period: '2011 Q2', iphone: 5670, ipad: 4293, itouch: 1881},
                    {period: '2011 Q3', iphone: 4820, ipad: 3795, itouch: 1588},
                    {period: '2011 Q4', iphone: 15073, ipad: 5967, itouch: 5175},
                    {period: '2012 Q1', iphone: 2666, ipad: null, itouch: 2647},
                    {period: '2012 Q2', iphone: 2778, ipad: 2294, itouch: 2441},
                    {period: '2012 Q3', iphone: 4912, ipad: 1969, itouch: 2501},
                    {period: '2012 Q4', iphone: 3767, ipad: 3597, itouch: 5689},
                    {period: '2013 Q1', iphone: 2666, ipad: null, itouch: 2647},
                    {period: '2013 Q2', iphone: 2778, ipad: 2294, itouch: 2441},
                    {period: '2013 Q3', iphone: 4912, ipad: 1969, itouch: 2501},
                    {period: '2013 Q4', iphone: 3767, ipad: 3597, itouch: 5689}
                ],
                xkey: 'period',
                ykeys: ['iphone', 'ipad', 'itouch'],
                labels: ['iPhone', 'iPad', 'iPod Touch'],
                pointSize: 2,
                hideHover: 'auto',
                pointFillColors:['#ffffff'],
                pointStrokeColors: ['black'],
                lineColors:['#A6A6A6','#24C2CE'],
                resize: true
            });
        },
        //数据转换装换
        Conversion: function () {
        //列表总览样式切换
        if ($('.overView .todolist .active')) {
            var dataName = $('.overView .todolist .active').parent().attr('data-name');
            $('#' + dataName).show().siblings().hide();
            eval(dataName + '()');
        }
        $('.overView .todolist').click(function () {
            page = 1;
            $(this).children().addClass('active');
            $(this).parent().siblings().children().children().removeClass('active');
            var dataName = $(this).attr('data-name');
            $('#' + dataName).show().siblings().hide();
            eval(dataName + '()');
        });
        //学生的状态切换
        $('.stuStatus .gray').click(function () {
            $(this).addClass('this-status');
            $(this).siblings().removeClass('this-status');
            stuStatua = $(this).attr('data-name');
            studentList();
        });
        //教师部门切换
        $('.teaStatus .gray').click(function () {
            $(this).addClass('this-status');
            $(this).siblings().removeClass('this-status');
            teaStatua = $(this).attr('data-name');
            teacherList();
        });
    }
    };

    function intTostr(value , type){
        if(type == 'user.active') {
            if (value == 1) return '激活';
            if (value == 0) return '冻结';
            return '';
        }
        if(type == 'user.sex' || type == 'sex') {
            if (value == 1)return '男';
            if (value == 2)return '女';
            if (value == 0)return '第三类性别';
            return '';
        }
        if(type == 'status'){
            if(value == 1) return '在读';
            if(value == 2) return '硕士研究生';
            if(value == 3) return '博士研究生';
            if(value == 4) return '休学';
            if(value == 5) return '其他';
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
        if(type == 'user.birth') return CommonTool.formatTime(value , 'Y年m月d日');
        return value;
    }

    //二级列表
    function towForm(data , type){
        var html = '';
        if(type == 'reward'){
            for (var i= 0,leng=data.length ; i<leng ; i++){
                html += '<tr class="odd" role="row">';
                html +='<td>'+ (data[i]["reward_time"]?data[i]["reward_time"]:'') +'</td>';
                html +='<td>'+ (data[i]['reward_name']?data[i]['reward_name']:'') +'</td>';
                html +='<td>'+ (data[i]['reward_type']?intTostr(data[i]['reward_type'] , 'reward_type'):'') +'</td>';
                html +='<td>'+ (data[i]['reward_ranking']?intTostr(data[i]['reward_ranking'] , 'reward_ranking'):'') +'</td>';
                html +='<td>'+ (data[i]['reward_level']?intTostr(data[i]['reward_level'] , 'reward_level'):'') +'</td>';
                html +='<td class="delete-reward" data-id="'+data[i]['dataTime']+'"><i class="icon-trash"></i>删除</td>';
                html +='</tr>';
            }
            $("#reward-table tbody").append(html);return;
        }
        if(type == 'punish'){
            for (var i= 0,leng=data.length ; i<leng ; i++){
                html += '<tr class="odd" role="row">';
                html +='<td>'+ (data[i]["punish_time"]?data[i]["punish_time"]:'') +'</td>';
                html +='<td>'+ (data[i]['punish_reason']?data[i]['punish_reason']:'') +'</td>';
                html +='<td>'+ (data[i]['punish_content']?intTostr(data[i]['punish_content'] , 'punish_content'):'') +'</td>';
                html +='<td class="delete-punish" data-id="'+data[i]['dataTime']+'"><i class="icon-trash"></i>删除</td>';
                html +='</tr>';
            }
            $("#punish-table tbody").append(html)
        }
    }
    //init edit form
    var getEditSource = function(name){
        switch(name){
            case 'user.active':
                return [
                    {value: 1, text: '激活'},
                    {value: 0, text: '冻结'}
                ];break;
            case 'user.sex':
                return [
                    {value: 0, text: '第三性别'},
                    {value: 1, text: '男'},
                    {value: 2, text: '女'},
                ];break;
            case 'department.depName':
                var departmentList = [];
                for(var i = 0,len = department.length; i<len; i++){
                    departmentList.push({value: department[i]['id'], text: department[i]['depName']});
                }
                return departmentList;break;
            case 'major.majorName':
                var majorList = [];
                for(var i = 0,len = major.length; i<len; i++){
                    majorList.push({value: major[i]['id'], text: major[i]['majorName']});
                }
                return majorList;break;
            case 'team.teamName':
                var teamList = [];
                for(var i = 0,len = team.length; i<len; i++){
                    teamList.push({value: team[i]['id'], text: team[i]['teamName']});
                }
                return teamList;break;
            case 'status':
                return [
                    {value: 1, text: '在读'},
                    {value: 2, text: '硕士研究生'},
                    {value: 3, text: '博士研究生'},
                    {value: 4, text: '休学'},
                    {value: 5, text: '其他'},

                ];break;
            default:
                return null;
        }
    };
    //修改、详情
    function initEditForm(data , type){
        console.log(data);
        //$("#iframe-image-show").empty();
        $('#reward-table').find('.odd').remove();
        $('#punish-table').find('.odd').remove();
        if(data.reward){towForm(data.reward,'reward')}
        if(data.punish){towForm(data.punish,'punish')}

        $.fn.editable.defaults.mode = 'inline';
        switch (type){
            case 'student':
                $('#student-detail').find("[name='form-edit']").each(function(){
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
                                        studentList();
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
                    displayValue = intTostr(displayValue , name);
                    if(!displayValue){displayValue="Empty";}
                    $(this).text(displayValue).editable('destroy');
                    $(this).editable(options);
                });
                break;
            case 'teacher':
                $('#teacher-detail').find("[name='form-edit']").each(function(){
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
                                        studentList();
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
                    displayValue = intTostr(displayValue , name);
                    if(!displayValue){displayValue="Empty";}
                    $(this).text(displayValue).editable('destroy');
                    $(this).editable(options);
                });
                break;
            case 'department':
                $('#department-detail').find("[name='form-edit']").each(function(){
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
                                        studentList();
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
                    displayValue = intTostr(displayValue , name);
                    if(!displayValue){displayValue="Empty";}
                    $(this).text(displayValue).editable('destroy');
                    $(this).editable(options);
                });
                break;
            case 'alumna':
                $('#alumna-detail').find("[name='form-edit']").each(function(){
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
                                        studentList();
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
                    displayValue = intTostr(displayValue , name);
                    if(!displayValue){displayValue="Empty";}
                    $(this).text(displayValue).editable('destroy');
                    $(this).editable(options);
                });
                break;
        }
    }

    resetModel = function (model) {
        switch (model){
            case 'edit':
                $("#student-detail").modal("show");
                initEditForm(htmlData , 'student');
                break;
            case 'graduation':
                $('#prompt-confirm p').text('是否准该学生毕业？');
                $('#prompt-confirm').attr('data-type' , model).modal('show');
                break;
            case 'pubMed':
                $('#prompt-confirm p').text('该学生是否确认考取硕士研究生学位？');
                $('#prompt-confirm').attr('data-type' , model).modal('show');
                break;
            case 'leaveSchool':
                $('#prompt-enter').modal('show');
                break;
            case 'back_school':
                $('#prompt-confirm p').text('该学生是否确认结束休学并且以返校？');
                $('#prompt-confirm').attr('data-type' , model).modal('show');
                break;
            case 'dropOut':
            case 'delete':
                $('#expelANDabort').attr('data-type' , model).modal('show');
                break;
            case 'teacher-edit':
                $("#teacher-detail").modal("show");
                initEditForm(htmlData , 'teacher');
                break;
            case 'department-edit':
                $("#department-detail").modal("show");
                initEditForm(htmlData , 'department');
                break;
            case 'alumna-edit':
                $("#alumna-detail").modal("show");
                initEditForm(htmlData , 'alumna');
                break;
        }
    };
    //提示信息处理
    $('#doConfirm').click(function(){
        var dataType = $(this).parents('#prompt-confirm').attr('data-type');
        switch (dataType){
            case 'graduation':
            case 'pubMed':
            case 'back_school':
                statusChang(dataType);$('#prompt-confirm').modal('hide');break;
        }
    });
    //休学验证
    $('#leaveschool').validate({
        rules:{"leaveschool_length": {required: true , max:2,min:0.5}},
        messages: {'leaveschool_length':'休学时长最多为2年，最少为半年'},
        errorClass: "help-block",
        //错误提示的html标签
        errorElement:'span',
        //focusCleanup:true,
        submitHandler: function() {
            statusChang('leaveSchool' , $('[name="leaveschool_length"]').val());
            $('#prompt-enter').modal('hide');
        }
    });
    //退学开除验证
    $('#expel-reason').validate({
        rules:{"leaveschool_length": {required: true}},
        messages: {},
        errorClass: "help-block",
        //错误提示的html标签
        errorElement:'span',
        //focusCleanup:true,
        submitHandler: function() {
            var type = $('#expelANDabort').attr('data-type');
            statusChang(type , $('[name="expel-reason"]').val());
            $('#expelANDabort').modal('hide');
        }
    });
    var createButtonList = function(row , type){
        var buttonList = [];
        if(type == 'student'){
            buttonList.push("<a name=\"table-button-list\" class='student-edit' type='edit' data-id='"+ row['id'] +"' ><i class=\"icon-edit\"></i> 编辑信息 </a>");
            if(row['status'] == 1){
                buttonList.push("<a name=\"table-button-list\" class='student-edit' type='graduation' data-id='"+ row['id'] +"' ><i class=\"icon-exchange\"></i> 毕业 </a>");
                buttonList.push("<a name=\"table-button-list\" class='student-edit' type='pubMed' data-id='"+ row['id'] +"' ><i class=\"icon-external-link\"></i> 考研 </a>");
                buttonList.push("<a name=\"table-button-list\" class='student-edit' type='leaveSchool' data-id='"+ row['id'] +"' ><i class=\"icon-signout\"></i> 休学 </a>");
                buttonList.push("<a name=\"table-button-list\" class='student-edit' type='dropOut' data-id='"+ row['id'] +"' ><i class=\"icon-reply\"></i> 退学 </a>");
                buttonList.push("<a name=\"table-button-list\" class='student-edit' type='delete' data-id='"+ row['id'] +"' ><i class=\"icon-trash\"></i> 开除 </a>");
            }
            if(row['status'] == 2){
                buttonList.push("<a name=\"table-button-list\" class='student-edit' type='graduation' data-id='"+ row['id'] +"' ><i class=\"icon-exchange\"></i> 毕业 </a>");
                buttonList.push("<a name=\"table-button-list\" class='student-edit' type='pubMed' data-id='"+ row['id'] +"' ><i class=\"icon-external-link\"></i> 考博 </a>");
            }
            if(row['status'] == 3 || row['status'] == 4){
                buttonList.push("<a name=\"table-button-list\" class='student-edit' type='graduation' data-id='"+ row['id'] +"' ><i class=\"icon-exchange\"></i> 毕业 </a>");
            }
            if(row['status'] == 5){
                buttonList.push("<a name=\"table-button-list\" class='student-edit' type='back_school' data-id='"+ row['id'] +"' ><i class=\"icon-signin\"></i> 返校 </a>");
            }
        }
        if(type == 'teacher'){
            buttonList.push("<a name=\"table-button-list\" class='teacher-edit' type='teacher-edit' data-id='"+ row['id'] +"' ><i class=\"icon-edit\"></i> 编辑信息 </a>");
        }
        if(type == 'department'){
            buttonList.push("<a name=\"table-button-list\" class='department-edit' type='department-edit' data-id='"+ row['id'] +"' ><i class=\"icon-edit\"></i> 编辑信息 </a>");
        }
        if(type == 'alumna'){
            buttonList.push("<a name=\"table-button-list\" class='alumna-edit' type='alumna-edit' data-id='"+ row['id'] +"' ><i class=\"icon-edit\"></i> 编辑信息 </a>");
        }
        return buttonList;
    };
    function studentList(){
        var postData = {};
        postData['page'] = page;
        postData['status'] = stuStatua;
        postData['per_page'] = 5;
        postData['_csrf'] = token;
        $.ajax({
            url:"/api/user/list-student",
            data:postData,
            dataType:'json',
            type:'POST',
            success:function(data){
                var total = data.total,student = data.data,html = '';
                var lastPage = total?1+(page-1)*5:0 , fastPage = page*5>parseInt(total)?parseInt(total):page*5 , overPage = total;
                if(student){
                    total = total > 5 ? Math.ceil(total/5) : 1;

                    //数据列表
                    for (var i=0;i<student.length;i++){
                        var button = createButtonList(student[i] , 'student');
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+student[i]["stuNo"]+'</td>';
                        html +='<td>'+ student[i]['user']['username'] +'</td>';
                        html +='<td>'+ student[i]['user']['email']+'</td>';
                        html +='<td>'+ student[i]['user']['phone']+'</td>';
                        html +='<td>'+ intTostr(student[i]['user']['sex'] , 'sex') +'</td>';
                        html +='<td>'+ intTostr(student[i]['status'] , 'status') +'</td>';
                        html +='<td>'+ button +'</td>';
                        html +='</tr>';
                    }
                    //分页代码
                    var refresh = false;
                    if(stuStatua_old != stuStatua){
                        stuStatua_old = stuStatua;
                        refresh = true;
                    }
                    var per_page = 5;
                    //当页码总数少于要显示的页码数时，显示页码总数
                    if(total < 5){ per_page = total;}
                    //判断筛选条件是否发生了变化
                    $('#student-pages').twbsPagination({
                        //总页数
                        totalPages: total,
                        //显示页码数
                        visiblePages: per_page,
                        //是否刷新页码
                        page: refresh,
                        version: '1.1'
                    });
                } else {
                    html = '<tr rowspan="4"><td style="text-align: center" colspan="7">No matching records found</td></tr>';
                    $('#student-pages').empty();
                }
                if(total = 0) $('#student-pages').empty();
                $('#student-over').children('.last-page').text(lastPage);
                $('#student-over').children('.fast-page').text(fastPage);
                $('#student-over').children('.over-page').text(overPage);
                $('#table-student-list tbody').empty().append(html);
                $('.student-edit').click(function(){
                    var student_id = $(this).attr('data-id');
                    for (var i=0 ; i<student.length ; i++){
                        if(student_id == student[i]['id']){
                            htmlData = student[i];             //获取到当前id的所有数据
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
    $('#student-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            page = dataPage;
            studentList();
        }
    });

    function teacherList(){
        var postData = {};
        postData['page'] = page;
        postData['per_page'] = 5;
        postData['_csrf'] = token;
        postData['division_id'] = teaStatua;
        $.ajax({
            url:"/api/user/list-teacher",
            data:postData,
            dataType:'json',
            type:'POST',
            success:function(data){
                var total = data.total,teacher = data.data,html = '';
                var lastPage = total?1+(page-1)*5:0 , fastPage = page*5>parseInt(total)?parseInt(total):page*5 , overPage = total;
                if(teacher){
                    total = total > 5 ? Math.ceil(total/5) : 1;

                    //数据列表
                    for (var i=0;i<teacher.length;i++){
                        var button = createButtonList(teacher[i] , 'teacher');
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+teacher[i]["teachNo"]+'</td>';
                        html +='<td>'+ teacher[i]['user']['username'] +'</td>';
                        html +='<td>'+ teacher[i]['user']['email']+'</td>';
                        html +='<td>'+ teacher[i]['user']['phone']+'</td>';
                        html +='<td>'+ intTostr(teacher[i]['user']['sex'] , 'sex') +'</td>';
                        html +='<td>'+ teacher[i]['position']   +'</td>';
                        html +='<td>'+ button +'</td>';
                        html +='</tr>';
                    }
                    //分页代码
                    var refresh = false;
                    if(teaStatua_old != teaStatua){
                        teaStatua_old = teaStatua;
                        refresh = true;
                    }
                    var per_page = 5;
                    //当页码总数少于要显示的页码数时，显示页码总数
                    if(total < 5){ per_page = total;}
                    //判断筛选条件是否发生了变化
                    $('#teacher-pages').twbsPagination({
                        //总页数
                        totalPages: total,
                        //显示页码数
                        visiblePages: per_page,
                        //是否刷新页码
                        page: refresh,
                        version: '1.1'
                    });
                } else {
                    html = '<tr rowspan="4"><td style="text-align: center" colspan="7">No matching records found</td></tr>';
                    $('#teacher-pages').empty();
                }
                if(total = 0) $('#teacher-pages').empty();
                $('#teacher-over').children('.last-page').text(lastPage);
                $('#teacher-over').children('.fast-page').text(fastPage);
                $('#teacher-over').children('.over-page').text(overPage);
                $('#table-teacher-list tbody').empty().append(html);
                $('.teacher-edit').click(function(){
                    var teacher_id = $(this).attr('data-id');
                    for (var i=0 ; i<teacher.length ; i++){
                        if(teacher_id == teacher[i]['id']){
                            htmlData = teacher[i];             //获取到当前id的所有数据
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
    $('#teacher-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            page = dataPage;
            teacherList(page);
        }
    });

    function departmentList(){
        var postData = {};
        postData['page'] = page;
        postData['per_page'] = 5;
        postData['_csrf'] = token;
        $.ajax({
            url:"/api/department/list",
            data:postData,
            dataType:'json',
            type:'POST',
            success:function(data){
                var total = data.total,department = data.data,html = '';
                var lastPage = total?1+(page-1)*5:0 , fastPage = page*5>parseInt(total)?parseInt(total):page*5 , overPage = total;
                if(department){
                    total = total > 5 ? Math.ceil(total/5) : 1;

                    //数据列表
                    for (var i=0;i<department.length;i++){
                        var button = createButtonList(department[i] , 'department');
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+ department[i]["id"]+'</td>';
                        html +='<td>'+ department[i]["depNo"]+'</td>';
                        html +='<td>'+ department[i]['user']['username'] +'</td>';
                        html +='<td>'+ department[i]['depName']+'</td>';
                        html +='<td>'+ department[i]['depAddress'] +'</td>';
                        html +='<td>'+ department[i]['phone'] +'</td>';
                        html +='<td>'+ button +'</td>';
                        html +='</tr>';
                    }
                    //分页代码
                    var per_page = 5;
                    //当页码总数少于要显示的页码数时，显示页码总数
                    if(total < 5){ per_page = total;}
                    //判断筛选条件是否发生了变化
                    $('#department-pages').twbsPagination({
                        //总页数
                        totalPages: total,
                        //显示页码数
                        visiblePages: per_page,
                        //是否刷新页码
                        page: false,
                        version: '1.1'
                    });
                } else {
                    html = '<tr rowspan="4"><td style="text-align: center" colspan="7">No matching records found</td></tr>';
                    $('#department-pages').empty();
                }
                if(total = 0) $('#department-pages').empty();
                $('#department-over').children('.last-page').text(lastPage);
                $('#department-over').children('.fast-page').text(fastPage);
                $('#department-over').children('.over-page').text(overPage);
                $('#table-department-list tbody').empty().append(html);
                $('.department-edit').click(function(){
                    var department_id = $(this).attr('data-id');
                    for (var i=0 ; i<department.length ; i++){
                        if(department_id == department[i]['id']){
                            htmlData = department[i];
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
    $('#department-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            page = dataPage;
            departmentList(page);
        }
    });

    function alumnaList(){
        var postData = {};
        postData['page'] = page;
        postData['per_page'] = 5;
        postData['eminent'] = 1;
        postData['_csrf'] = token;
        $.ajax({
            url:"/api/alumna/list",
            data:postData,
            dataType:'json',
            type:'POST',
            success:function(data){
                var total = data.total,alumna = data.data,html = '';
                var lastPage = total?1+(page-1)*5:0 , fastPage = page*5>parseInt(total)?parseInt(total):page*5 , overPage = total;
                if(alumna){
                    total = total > 5 ? Math.ceil(total/5) : 1;

                    //数据列表
                    for (var i=0;i<alumna.length;i++){
                        var button = createButtonList(alumna[i] , 'alumna');
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+ alumna[i]["stuNo"] +'</td>';
                        html +='<td>'+ alumna[i]['name'] +'</td>';
                        html +='<td>'+ intTostr(alumna[i]['sex'] , 'sex') +'</td>';
                        html +='<td>'+ alumna[i]["age"] +'</td>';
                        html +='<td>'+ alumna[i]['email']+'</td>';
                        html +='<td>'+ alumna[i]['phone']+'</td>';
                        html +='<td>'+ CommonTool.formatTime(alumna[i]['graduate_time'] , 'Y-m') +'</td>';
                        html +='<td>'+ button +'</td>';
                        html +='</tr>';
                    }
                    //分页代码

                    var per_page = 5;
                    //当页码总数少于要显示的页码数时，显示页码总数
                    if(total < 5){ per_page = total;}
                    //判断筛选条件是否发生了变化
                    $('#alumna-pages').twbsPagination({
                        //总页数
                        totalPages: total,
                        //显示页码数
                        visiblePages: per_page,
                        //是否刷新页码
                        page: false,
                        version: '1.1'
                    });
                } else {
                    html = '<tr rowspan="4"><td style="text-align: center" colspan="7">No matching records found</td></tr>';
                    $('#alumna-pages').empty();
                }
                if(total = 0) $('#alumna-pages').empty();
                $('#alumna-over').children('.last-page').text(lastPage);
                $('#alumna-over').children('.fast-page').text(fastPage);
                $('#alumna-over').children('.over-page').text(overPage);
                $('#table-alumna-list tbody').empty().append(html);
                $('.alumna-edit').click(function(){
                    var alumna_id = $(this).attr('data-id');
                    for (var i=0 ; i<alumna.length ; i++){
                        if(alumna_id == alumna[i]['id']){
                            htmlData = alumna[i];
                        }
                    }
                    var Model = $(this).attr('type');
                    resetModel(Model , 'alumna-edit');
                });
            },
            error:function(XMLHttpRequest){
                alert(XMLHttpRequest.responseJSON.message+"");
            }
        });
    }
    $('#alumna-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            page = dataPage;
            alumnaList(page);
        }
    });

    function statusChang(type , data){
        if(type == 'graduation' || type == 'pubMed'){
            if(parseInt(htmlData.credit) >= parseInt(htmlData.major.majorCred)){
                var postData = {},url = type=='graduation'?'api/user/finish-school':'api/user/edit';
                postData["_csrf"] = token;
                postData["id"] = htmlData.id;
                if(type=='graduation'){
                    postData["id"] = htmlData.user.id;
                    postData['stuNo'] = htmlData.stuNo;
                    postData['name'] = htmlData.user.username;
                    postData['sex'] = htmlData.user.sex;
                    postData['birth'] = htmlData.user.birth;
                    postData['email'] = htmlData.user.email;
                    postData['phone'] = htmlData.user.phone;
                    postData['session'] = htmlData.team.period;
                    postData['depName'] = htmlData.department.depName;
                    postData['majorName'] = htmlData.major.majorName;
                    postData['teamName'] = htmlData.team.teamName;
                    postData['credit'] = htmlData.credit;
                    postData['reward'] = htmlData.reward;
                    postData['punish'] = htmlData.punish;
                    postData['admission_time'] = htmlData.create_time;
                }else if(type=='pubMed'){
                    postData["edit_value"] = 2;
                    postData["edit_name"] = 'status';
                    postData["type"] = 'student';
                }
                userEdit(url , postData);
            }else {
                $("#dialog-confirm p").text('该学生的学分不足！！！');
                $("#dialog-confirm").modal('show');
                return;
            }
        }else{
            var postData = {},url = 'api/user/edit';
            postData["_csrf"] = token;
            if( type == 'leaveSchool'){
                postData["id"] = htmlData.id;
                postData["edit_value"] = 5;
                postData["edit_name"] = 'status';
                postData["type"] = 'student';
                postData["leaveschool_length"] = data;
            }
            if(type == 'back_school'){
                postData["id"] = htmlData.id;
                postData["edit_value"] = 1;
                postData["edit_name"] = 'status';
                postData["type"] = 'student';
            }
            if(type == 'dropOut' || type == 'delete'){
                url = 'api/user/finish-school';
                postData["id"] = htmlData.user.id;
                postData['stuNo'] = htmlData.stuNo;
                postData['name'] = htmlData.user.username;
                postData['sex'] = htmlData.user.sex;
                postData['birth'] = htmlData.user.birth;
                postData['email'] = htmlData.user.email;
                postData['phone'] = htmlData.user.phone;
                postData['session'] = htmlData.team.period;
                postData['depName'] = htmlData.department.depName;
                postData['majorName'] = htmlData.major.majorName;
                postData['teamName'] = htmlData.team.teamName;
                postData['credit'] = htmlData.credit;
                postData['reward'] = htmlData.reward;
                postData['punish'] = htmlData.punish;
                postData['admission_time'] = htmlData.create_time;
                postData['type'] = type == 'dropOut' ? 2 : 3;
                postData['expel_reason'] = data;
            }
            userEdit(url , postData);
        }
    }
    function userEdit(url , postData){
        $.ajax({
            url: url,
            data: postData,
            type: 'post',
            dataType: 'json',
            success:function(data){
                $("#dialog-confirm p").text('操作成功！！！');
                $("#dialog-confirm").modal('show');
                todo();
                studentList();
            }
        })
    }
});
