<?php

namespace frontend\assets;

use yii\web\AssetBundle;

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
    public $js = [
        'js/plugin/jquery.min.js',
        'js/plugin/jQuery.cookie.js',
        'js/plugin/l-by-l.min.js',
        'js/index/index.js',
        'js/article/comment.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
