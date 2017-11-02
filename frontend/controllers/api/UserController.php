<?php
namespace frontend\controllers\api;


use Yii;
use yii\web\Controller;
use common\models\User;
use yii\web\Response;

/**
 * Site controller
 */
class UserController extends Controller
{
    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
        Yii::$app->response->format = Response::FORMAT_JSON;
    }

    public function actionOne()
    {
        $user = new User();
        $user->scenario = User::SCENARIO_ADD;
        $user->id = Yii::$app->request->post('id');
        return $user->getOne();
    }
    public function actionList()
    {
        $user = new User();
        $user->scenario = User::SCENARIO_SEARCH;
        $user->select = Yii::$app->request->post('select');
        list($total, $result) = $user->getList();
        return $result;
    }
    public function actionAdd()
    {
        $user = new User();
        $user->scenario = User::SCENARIO_ADD;
        $user->setAttributes(Yii::$app->request->post());
        $user->user_id = Yii::$app->user->identity->id;
        return $user->getAdd();

    }
}