/**
 * Created by admin on 2017/9/22.
 */
$(function(){
    /**
     *index-head
     */
    var ladder = $(".index-head-left div");
    var content = $(".index-head-right");
    var text;
    ladder.mouseenter(function(){
        text = $(this).text();
        switch ($(this).attr('class')){
            case 'ladder-one':
                $(this).css({background:'#FFFD9F'}).animate({width:300+'px'},500);
                content.lbyl({
                    content: "农历一九九五年腊月一十三，公历一九九六年二月一日出生于欧阳海。",
                    speed: 100, type: 'show'});break;
            case 'ladder-two':
                $(this).css({background:'#FDFB9D'}).animate({width:350+'px'},500);
                content.lbyl({
                    content: "在那里我度过了了一个温馨的童年，还有几个要好的朋友。听叔伯们说：我小时候一点也不怕生，见到人都会打招呼，比现在可爱多了。",
                    speed: 100,type: 'show'});break;
            case 'ladder-three':
                $(this).css({background:'#FBF99B'}).animate({width:400+'px'},500);
                content.lbyl({
                content: "时间的流逝我也在慢慢的长大，但是村里的人却越来越少了。直到那年（估计是零一年）过完年之后父母也带我离开了家乡。",
                speed: 100,type: 'show'});break;
            case 'ladder-four':
                $(this).css({background:'#F9F799'}).animate({width:450+'px'},500);
                content.lbyl({
                    content: "到了城市里之后，就带我去报名学前班。因为是下半学期加上初到城市里，所以经常被人欺负（印象中是几个女生）。" +
                    "一个学期后班上的同学升学为一年级，而我则因为只读了一个学期被留级了。",
                    speed: 100,type: 'show'});break;
            case 'ladder-five':
                $(this).css({background:'#F8F698'}).animate({width:500+'px'},500);
                content.lbyl({
                    content: "又过了一年到了该升学的时候，学校以成绩差为由要求再留级一年。父母几番交涉无果但是又觉得该去上小学，于是我转到了新的学校——“牛巷口小学”。" +
                    "转学之后因为离家较远，所以中午不回家去用父母给的三块钱吃买东西吃。直到三年级的时候，妈妈也到了学校附近来工作了。",
                    speed: 100,type: 'show'});break;
            case 'ladder-six':
                $(this).css({background:'#F8F698'}).animate({width:550+'px'},500);
                content.lbyl({
                    content: "在升四年级的时候我们学校被削了（撤点并校政策）只剩下三年级，原有的四五六年级全部转到附近的“东风中学”的附属小学，我也就在附属小学过了四年级，" +
                    "我们转过来的这批人都被分在‘通学班’（即相对于寄宿生的班级，学生中午晚上都回家吃饭，班号123）。到了五年级的时候不知道什么原因，牛巷口小学的五六年级恢复了" +
                    "我们全班又转了过去，升六年级的时候又被削了，通学班（123班）又重现。",
                    speed: 100,type: 'show'});break;
            case 'ladder-seven':
                $(this).css({background:'#F8F698'}).animate({width:600+'px'},500);
                content.lbyl({
                    content: "零八年的时候我成功的升到了东风中学，被分在了号称实验班225班，初中生活相对平静，我的成绩也不错，就是英语没有及格过。初三的时候被同学带去上网，" +
                    "开始的时候放假去一次，渐渐受DNF（《地下城与勇士》一款免费角色扮演2D游戏）的吸引越来越频繁，在寒假之前发展到了每天去上网。在寒假时候更是晚上偷偷溜出去通宵",
                    speed: 100,type: 'show'});break;
            case 'ladder-eight':
                $(this).css({background:'#F8F698'}).animate({width:650+'px'},500);
                content.lbyl({
                    content: "一一年升入了“桂阳县第一中学”，开学分班考试后被分在了重点班1102班（那时候虽然上网但是底子还在）。因为离家较远我也转寄宿为了生，" +
                    "在离开了家人的约束下我成功的放飞了自我（每周通宵四次以上，上课睡觉，中下午继续上网），高二成功的分到了最差的班级。到了高三的时候想努力赶上来，" +
                    "不在去通宵了，白天上网的时间也少了，但是对自己不够狠，上课听但是课后学习的时间不多，更没有主动的学习",
                    speed: 100,type: 'show'});break;
            case 'ladder-nine':
                $(this).css({background:'#F8F698'}).animate({width:700+'px'},500);
                content.lbyl({
                    content: "大学",
                    speed: 100,type: 'show'});break;
            case 'ladder-ten':
                $(this).css({background:'#F8F698'}).animate({width:700+'px'},500);
                content.lbyl({
                    content: "工作",
                    speed: 100,type: 'show'});break;
        }
    });
    ladder.mouseleave(function () {
        $(this).css({background:'#96FF93'}).animate({width:100+'px'},500).text(text);
    });
});