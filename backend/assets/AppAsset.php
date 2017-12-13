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
        'assets/bootstrap/css/bootstrap.min.css',
        'assets/bootstrap/css/font-awesome.css',
        //内容编辑插件
        'assets/bootstrap-editable/css/bootstrap-editable.css',
        'css/custom-styles.css',
    ];
    public $js = [
        'js/public/jquery.min.js',
        //cookie插件
        'js/public/jQuery.cookie.js',
        //bootstrap插件
        'assets/bootstrap/js/bootstrap.min.js',
        //分页插件
        'js/public/jquery.twbsPagination.js',
        //内容编辑插件
        'assets/bootstrap-editable/js/bootstrap-editable.min.js',
        'js/public/main.js',
    ];
    //把导入的js文件移动到头部
    public $jsOptions = ['position' => View::POS_HEAD];

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
