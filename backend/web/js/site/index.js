/**
 * Created by admin on 2017/11/30.
 */
$(function(){
    setInterval(function(){
        var date = new Date();
        var time = date.getFullYear()+'-'+supplement(date.getMonth())+'-'+ supplement(date.getDay()) +' ' +supplement(date.getHours())+':'+supplement(date.getMinutes())+':'+supplement(date.getSeconds());
        $('#dateTime').text(time);
    },1000);
    function  supplement (x){
        //补0
        if(x<10) x = '0'+x;
        return x;
    }
});
