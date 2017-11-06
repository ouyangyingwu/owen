<?php

namespace frontend\assets;

use yii\web\AssetBundle;
use yii\web\View;

/**
 * Main frontend application asset bundle.
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        //'css/base.css',
        'css/font-awesome.css',         //图标生成文件
        'css/components.min.css',
        //'assets/bootstrap-modal/css/bootstrap-modal.css',
        'css/site.css',
        'css/index.css',
        'assets/bootstrap-editable/css/bootstrap-editable.css', //数据编辑器css
    ];
    //导入公共文件
    public $js = [
        'js/public/jquery.min.js',
        'js/public/jQuery.cookie.js',   //cookie插件
        'js/public/main.js',            //常用的公共处理函数
        'assets/bootstrap-editable/js/bootstrap.js',
        'assets/bootstrap-editable/js/bootstrap-editable.js',   //数据编辑器js
    ];
    //把导入的js文件移动到头部
    public $jsOptions = ['position' => View::POS_HEAD];

    //依赖关系
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];

    //按需加载js方法
    public static function addScript($view, $jsfile) {
        $view->registerJsFile($jsfile, [AppAsset::className(), 'depends' => 'frontend\assets\AppAsset']);
    }
    //定义按需加载css方法
    public static function addCss($view, $cssfile) {
        $view->registerCssFile($cssfile, [AppAsset::className(), 'depends' => 'frontend\assets\AppAsset']);
    }
}
