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
        'css/base.css',
        'css/site.css',
        'css/index.css',
    ];
    //导入公共文件
    public $js = [
        'js/plugin/jquery.min.js',
        'js/plugin/jQuery.cookie.js',
        'js/plugin/l-by-l.min.js',
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
