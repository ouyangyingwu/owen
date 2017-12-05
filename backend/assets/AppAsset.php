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
        /*'css/base.css',*/
        'assets/bootstrap/css/bootstrap.min.css',
        'assets/bootstrap/css/font-awesome.css',
       /* 'css/site.css',
        'css/layout.css',*/
        'css/custom-styles.css',
    ];
    public $js = [
        'js/public/jquery.min.js',
        'assets/bootstrap/js/bootstrap.min.js',
        'js/public/main.js',
        /*'js/site/index.js'*/
    ];
    //把导入的js文件移动到头部
    public $jsOptions = ['position' => View::POS_HEAD];

    //按需加载js方法
    public static function addScript($view, $jsfile) {
        $view->registerJsFile($jsfile, [AppAsset::className(), 'depends' => 'frontend\assets\AppAsset']);
    }
    //定义按需加载css方法
    public static function addCss($view, $cssfile) {
        $view->registerCssFile($cssfile, [AppAsset::className(), 'depends' => 'frontend\assets\AppAsset']);
    }

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
