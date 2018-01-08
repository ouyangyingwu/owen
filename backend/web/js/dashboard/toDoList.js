/**
 * Created by admin on 2018/1/5.
 */
$(function() {
    var htmlData;
    var token = $('meta[name=csrf-token]').attr('content');
    var params = {_csrf:token , per_page:10},page = 1;
    (function(){
        $.ajax({
            url: 'api/dashboard/todo',
            data: params,
            type: 'post',
            dataType: 'json',
            success:function(data){
                var i = 0;
                $('.overView .todolist').each(function(){
                    $(this).find('p').text(data.overCount[i]);
                });
            }
        })
    })();

    "use strict";
    var mainApp = {

        initFunction: function () {
            /* MORRIS BAR CHART
             -----------------------------------------*/
            Morris.Bar({
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

            /* MORRIS DONUT CHART
             ----------------------------------------*/
            Morris.Donut({
                element: 'morris-donut-chart',
                data: [{
                    label: "Download Sales",
                    value: 12
                }, {
                    label: "In-Store Sales",
                    value: 60
                }/*, {
                    label: "Mail-Order Sales",
                    value: 28
                }*/],
                colors: [
                    '#A6A6A6','#24C2CE',
                    //'#A8E9DC'
                ],
                resize: true
            });

            /* MORRIS AREA CHART
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

            /* MORRIS LINE CHART
             ----------------------------------------*/
            Morris.Line({
                element: 'morris-line-chart',
                data: [
                    { x: '2014', a: 50, b: 90},
                    { x: '2015', a: 165,  b: 185},
                    { x: '2016', a: 150,  b: 130},
                    { x: '2017', a: 175,  b: 160},
                    { x: '2018', a: 80,  b: 65},
                    { x: '2019', a: 90,  b: 70},
                    { x: '2020', a: 100, b: 125},
                    { x: '2021', a: 155, b: 175},
                    { x: '2022', a: 80, b: 85},
                    { x: '2023', a: 145, b: 155},
                    { x: '2024', a: 160, b: 195}
                ],
                xkey: 'x',
                ykeys: ['a', 'b'],
                labels: ['Total Income', 'Total Outcome'],
                fillOpacity: 0.6,
                hideHover: 'auto',
                behaveLikeLine: true,
                resize: false,
                pointFillColors:['#ffffff'],
                pointStrokeColors: ['black'],
                lineColors:['gray','#24C2CE']

            });

            $('#easypiechart-teal').easyPieChart({
                scaleColor: false,
                barColor: '#1ebfae'
            });

            $('#easypiechart-orange').easyPieChart({
                scaleColor: false,
                barColor: '#ffb53e'
            });

            $('#easypiechart-red').easyPieChart({
                scaleColor: false,
                barColor: '#f9243f'
            });

            $('#easypiechart-blue').easyPieChart({
                scaleColor: false,
                barColor: '#30a5ff'
            });
        }
    };
    mainApp.initFunction();

    //列表总览样式切换
    $('.overView .todolist').click(function(){
        page = 1;
        $(this).children().addClass('active');
        $(this).parent().siblings().children().children().removeClass('active');
        console.log($(this).attr('data-name'));
        switch ($(this).attr('data-name')){
            case 'studentList':
                $('#studentList').show().siblings().hide();
                StudentList();break;
            case 'teacherList':
                $('#teacherList').show().siblings().hide();
                TeacherList();break;
            case 'departmentList':
                $('#departmentList').show().siblings().hide();
                DepartmentList();break;
            case 'alumnaList':
                $('#alumnaList').show().siblings().hide();
                AlumnaList();break;
        }
    });

    function intTostr(value , type){
        if(type == 'active') {
            if (value == 1) return '激活';
            if (value == 0) return '冻结';
            return '';
        }
        if(type == 'sex') {
            if (value == 1)return '男';
            if (value == 2)return '女';
            if (value == 0)return '第三类性别';
            return '';
        }
        if(type == 'status') {
            if (value == 1) return '在读';
            if (value == 2) return '毕业';
            if (value == 3) return '休学';
            if (value == 4) return '退学';
            if (value == 5) return '开除';
            if (value == 6) return '考研';
            if (value == 7) return '硕博';
            return '';
        }
    }
    var createButtonList = function(row){
        var buttonList = [];
        buttonList.push("<a name=\"table-button-list\" class='user-edit' type='edit' data-id='"+row+"' ><i class=\"icon-edit\"></i> Edit</a>");
        buttonList.push("<a name=\"table-button-list\" class='user-edit' type='delete' data-id='"+row+"' ><i class=\"icon-trash\"></i> Remove</a>");
        return buttonList;
    };
    function StudentList(page){
        var postData = {};
        postData['page'] = page ? page : '';
        postData['per_page'] = 5;
        postData['_csrf'] = token;
        postData['type'] = 1;
        $.ajax({
            url:"/api/user/list",
            data:postData,
            dataType:'json',
            type:'POST',
            success:function(data){
                var total = data.total,student = data.data,html = '';
                if(student){
                    total = total > 5 ? Math.ceil(total/5) : 1;

                    //数据列表
                    for (var i=0;i<student.length;i++){
                        var button = createButtonList(student[i]['id']);
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+student[i]["id"]+'</td>';
                        html +='<td>'+ student[i]['username'] +'</td>';
                        html +='<td>'+ student[i]['email']+'</td>';
                        html +='<td>'+ student[i]['phone']+'</td>';
                        html +='<td>'+ intTostr(student[i]['sex'] , 'sex') +'</td>';
                        html +='<td>'+ intTostr(student[i]['status'] , 'status') +'</td>';
                        html +='<td>'+ button +'</td>';
                        html +='</tr>';
                    }
                    //分页代码

                    var per_page = 5;
                    //当页码总数少于要显示的页码数时，显示页码总数
                    if(total < 5){ per_page = total;}
                    //判断筛选条件是否发生了变化
                    $('#visible-pages').twbsPagination({
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
                    $('#visible-pages').empty();
                }
                if(total = 0) $('#visible-pages').empty();
                $('#table-student-list tbody').empty();
                $('#table-student-list tbody').append(html);
                $('.user-edit').click(function(){
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
    StudentList();

    $('#visible-pages').on('click' , function(){
        console.log($(this).find('li.active'));
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            page = dataPage;
            StudentList(page);
        }
    });
    function TeacherList(page){
        var postData = {};
        postData['page'] = page ? page : '';
        postData['per_page'] = 5;
        postData['_csrf'] = token;
        postData['type'] = 2;
        $.ajax({
            url:"/api/user/list",
            data:postData,
            dataType:'json',
            type:'POST',
            success:function(data){
                var total = data.total,teacher = data.data,html = '';
                if(teacher){
                    total = total > 5 ? Math.ceil(total/5) : 1;

                    //数据列表
                    for (var i=0;i<teacher.length;i++){
                        var button = createButtonList(teacher[i]['id']);
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+teacher[i]["id"]+'</td>';
                        html +='<td>'+ teacher[i]['username'] +'</td>';
                        html +='<td>'+ teacher[i]['email']+'</td>';
                        html +='<td>'+ teacher[i]['phone']+'</td>';
                        html +='<td>'+ intTostr(teacher[i]['sex'] , 'sex') +'</td>';
                        html +='<td>'+ intTostr(teacher[i]['status'] , 'status') +'</td>';
                        html +='<td>'+ button +'</td>';
                        html +='</tr>';
                    }
                    //分页代码

                    var per_page = 5;
                    //当页码总数少于要显示的页码数时，显示页码总数
                    if(total < 5){ per_page = total;}
                    //判断筛选条件是否发生了变化
                    $('#visible-pages').twbsPagination({
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
                    $('#visible-pages').empty();
                }
                if(total = 0) $('#visible-pages').empty();
                $('#table-teacher-list tbody').empty();
                $('#table-teacher-list tbody').append(html);
                $('.user-edit').click(function(){
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
    function DepartmentList(page){
        var postData = {};
        postData['page'] = page ? page : '';
        postData['per_page'] = 5;
        postData['_csrf'] = token;
        postData['type'] = 2;
        $.ajax({
            url:"/api/user/list",
            data:postData,
            dataType:'json',
            type:'POST',
            success:function(data){
                var total = data.total,teacher = data.data,html = '';
                if(teacher){
                    total = total > 5 ? Math.ceil(total/5) : 1;

                    //数据列表
                    for (var i=0;i<teacher.length;i++){
                        var button = createButtonList(teacher[i]['id']);
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+teacher[i]["id"]+'</td>';
                        html +='<td>'+ teacher[i]['username'] +'</td>';
                        html +='<td>'+ teacher[i]['email']+'</td>';
                        html +='<td>'+ teacher[i]['phone']+'</td>';
                        html +='<td>'+ intTostr(teacher[i]['sex'] , 'sex') +'</td>';
                        html +='<td>'+ intTostr(teacher[i]['status'] , 'status') +'</td>';
                        html +='<td>'+ button +'</td>';
                        html +='</tr>';
                    }
                    //分页代码

                    var per_page = 5;
                    //当页码总数少于要显示的页码数时，显示页码总数
                    if(total < 5){ per_page = total;}
                    //判断筛选条件是否发生了变化
                    $('#visible-pages').twbsPagination({
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
                    $('#visible-pages').empty();
                }
                if(total = 0) $('#visible-pages').empty();
                $('#table-teacher-list tbody').empty();
                $('#table-teacher-list tbody').append(html);
                $('.user-edit').click(function(){
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
    function AlumnaList(page){
        var postData = {};
        postData['page'] = page ? page : '';
        postData['per_page'] = 5;
        postData['_csrf'] = token;
        postData['type'] = 2;
        $.ajax({
            url:"/api/user/list",
            data:postData,
            dataType:'json',
            type:'POST',
            success:function(data){
                var total = data.total,teacher = data.data,html = '';
                if(teacher){
                    total = total > 5 ? Math.ceil(total/5) : 1;

                    //数据列表
                    for (var i=0;i<teacher.length;i++){
                        var button = createButtonList(teacher[i]['id']);
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+teacher[i]["id"]+'</td>';
                        html +='<td>'+ teacher[i]['username'] +'</td>';
                        html +='<td>'+ teacher[i]['email']+'</td>';
                        html +='<td>'+ teacher[i]['phone']+'</td>';
                        html +='<td>'+ intTostr(teacher[i]['sex'] , 'sex') +'</td>';
                        html +='<td>'+ intTostr(teacher[i]['status'] , 'status') +'</td>';
                        html +='<td>'+ button +'</td>';
                        html +='</tr>';
                    }
                    //分页代码

                    var per_page = 5;
                    //当页码总数少于要显示的页码数时，显示页码总数
                    if(total < 5){ per_page = total;}
                    //判断筛选条件是否发生了变化
                    $('#visible-pages').twbsPagination({
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
                    $('#visible-pages').empty();
                }
                if(total = 0) $('#visible-pages').empty();
                $('#table-teacher-list tbody').empty();
                $('#table-teacher-list tbody').append(html);
                $('.user-edit').click(function(){
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
});
