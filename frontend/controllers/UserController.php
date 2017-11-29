<?php
namespace frontend\controllers;

use Yii;
use yii\web\Controller;
use common\models\User;

/**
 * Site controller
 */
class UserController extends Controller
{
    public function actionIndex()
    {
        return $this->render('userList');
    }

    public function actionCreate()
    {
        return $this->render('userCreate');
    }
    public function actionOne()
    {
        return $this->render('userOne');
    }
}
