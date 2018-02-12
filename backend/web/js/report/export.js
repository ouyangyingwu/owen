/**
 * Created by admin on 2018/2/3.
 */
$(function(){
    $('ul.tabs-left li').click(function(){
        var name = $(this).attr('name');
        $(this).addClass('active').siblings().removeClass('active');
        $('.'+name).removeClass('hide').siblings().addClass('hide');;
    });

    //选择时间插件
    var optionsStudnet = {
        preset : 'date',
        minDate: new Date(new Date().setYear(new Date().getFullYear() - 5)),
        maxDate: new Date(new Date().setYear(new Date().getFullYear() + 5)),
        theme: "android-ics light",
        mode: "scroller",
        dateFormat: 'yyyy-mm-dd',
        display: "modal"
    };
    $('.scheduleTime').val("").scroller("destroy");
    $('.scheduleTime').scroller(optionsStudnet);

    var optionsTeam = {
        preset : 'date',
        minDate: new Date(new Date().setYear(new Date().getFullYear() - 3)),
        maxDate: new Date(new Date().setYear(new Date().getFullYear())),
        theme: "android-ics light",
        mode: "scroller",
        dateFormat: 'yyyy',
        display: "modal",
        dateOrder: 'yy',        //面板中日期排列格式
        setText: '确定',        //确认按钮名称
        cancelText: '取消',     //取消按钮名籍我
    };
    $('.scheduleTime').val("").scroller("destroy");
    $('.scheduleTime').scroller(optionsTeam);

    //定义新的规则
    $.validator.addMethod("stuNo", function(value){
        var tag = true;
        var regexp = /^[S][0-9]{8}$/;
        if(!value.match(regexp)){
            tag = false;
        }
        return tag;
    }, "学号格式不正确! ");

    $('#student-score').validate({
        rules:{"stuNo":{required:true , stuNo:true}},
        messages: {},
        errorClass: "help-block",
        //错误提示的html标签
        errorElement:'span',
        submitHandler: function() {
            btnExport($('#student-score'));
        }
    });

    $('#team-score').validate({
        rules:{"stuNo":{required:true , stuNo:true}},
        messages: {},
        errorClass: "help-block",
        //错误提示的html标签
        errorElement:'span',
        submitHandler: function() {
            btnExport($('#team-score'));
        }
    });
    $('#course-score').validate({
        rules:{"period":{required:true},courseName:{required:true}},
        messages: {},
        errorClass: "help-block",
        //错误提示的html标签
        errorElement:'span',
        submitHandler: function() {
            btnExport($('#course-score'));
        }
    });
    $('#major-score').validate({
        rules:{majorName:{required:true}},
        messages: {},
        errorClass: "help-block",
        //错误提示的html标签
        errorElement:'span',
        submitHandler: function() {
            btnExport($('#major-score'));
        }
    });

     function btnExport(Object){
        var form = Object.attr("id");
        var params = [];
        $("#" + form).find(".form-control").each(function(){
            var name = $(this).attr("name");
            var value = $(this).val();
            value = value ? value : '';
            params.push(name + "=" + value);
        });
        var url = "report/" + form + "?" + params.join("&");
        //console.log(url);return;
        window.location.href = url;
    };
});
