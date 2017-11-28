<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\helpers\Url;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use frontend\assets\AppAsset;
use common\widgets\Alert;

//导入公共css，js文件
AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>

<div class="wrap">
    <?php
    NavBar::begin([
        'brandLabel' => 'Owen Home',
        'brandUrl' => Yii::$app->homeUrl,
        'options' => [
            'class' => 'navbar-inverse navbar-fixed-top',
        ],
    ]);
    $menuItems = [
        ['label' => 'Home', 'url' => ['/site/index']],
        ['label' => 'Article', 'url' => ['/article/index']],
        ['label' => 'User', 'url' => ['/user/index']],
    ];
    if (Yii::$app->user->isGuest) {
        $menuItems[] = ['label' => 'Signup', 'url' => ['/site/signup']];
        $menuItems[] = ['label' => 'Login', 'url' => ['/site/login']];
    } else {
        $menuItems[] = '<li>'
            . Html::beginForm(['/site/logout'], 'post')
            . Html::submitButton(
                'Logout (' . Yii::$app->user->identity->username . ')',
                ['class' => 'btn btn-link logout']
            )
            . Html::endForm()
            . '</li>';
        /*'<li style="padding: 7px;"><img src="../image/'.Yii::$app->user->identity->img_url.'" style="width: 60px; height: 40px; border-radius: 20px;"></li>';
        $menuItems[] = ['label' => Yii::$app->user->identity->username , 'url' => ['/user/one']];*/
    }
    echo Nav::widget([
        'options' => ['class' => 'navbar-nav navbar-right'],
        'items' => $menuItems,
    ]);
    NavBar::end();
    ?>

    <div class="container">
        <?= Breadcrumbs::widget([
            'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
        ]) ?>
        <?= Alert::widget() ?>
        <?= $content ?>
    </div>
</div>

<footer class="footer">
    <div class="container">
        <p class="pull-left">&copy; My Home Page <?= date('Y') ?></p>

        <p class="pull-right"><?= Yii::powered() ?></p>
    </div>
</footer>

<?php $this->endBody() ?>
<?php if(array_key_exists('js_path', $this->params) && !empty($this->params['js_path'])): ?>
    <script type="text/javascript">
        var _config = {"baseUrl":"<?= Url::base() ?>"};
        <?php if(array_key_exists('js_config_param', $this->params) && is_array($this->params['js_config_param'])): ?>
            <?php foreach ($this->params['js_config_param'] as $key => $val): ?>
                _config["<?= $key ?>"] =  "<?= $val ?>";
            <?php endforeach;?>
        <?php endif; ?>
        /**
         *设置全局变量
         */
        SmsJs.config.set(_config);
    </script>
<?php endif; ?>
</body>
</html>
<?php $this->endPage() ?>
