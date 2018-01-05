<?php

namespace backend\assets;

use yii\web\AssetBundle;
use yii\web\View;

/**
 * Main backend application asset bundle.
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        //bootstrap插件
        'assets/bootstrap/css/bootstrap.min.css',
        //生成图标
        'assets/bootstrap/css/font-awesome.css',
        //内容编辑插件
        'assets/bootstrap-editable/css/bootstrap-editable.css',
        //时间插件
        'assets/mobile/mobiscroll.min.css',
        //select2
        'assets/select2/css/select2.min.css',
        //轻量级测试图,折线图（点线相连）
        '/assets/summaryGraph/Lightweight-Chart/cssCharts.css',
        //绘制图表库样式
        '/assets/summaryGraph/morris/morris-0.4.3.min.css',
        //公共样式
        'css/custom-styles.css',
    ];
    public $js = [
        //JQ库文件
        'js/public/jquery.min.js',
        //cookie插件
        'js/public/jQuery.cookie.js',
        //bootstrap插件
        'assets/bootstrap/js/bootstrap.min.js',
        //分页插件
        'js/public/jquery.twbsPagination.js',
        //内容编辑插件
        'assets/bootstrap-editable/js/bootstrap-editable.min.js',
        //数据验证插件
        'js/public/jquery.validate.min.js',
        //数据验证插件中文提示信息
        'js/public/message_zh.js',
        //时间插件
        'assets/mobile/mobiscroll.min.js',
        //select2
        'assets/select2/js/select2.min.js',
        //公共特效
        'js/main.js',
    ];
    //把导入的js文件移动到头部
    public $jsOptions = ['position' => View::POS_HEAD];

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
