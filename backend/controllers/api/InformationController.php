<?php
namespace backend\controllers\api;


use common\models\Information;
use Yii;
use yii\web\Controller;
use common\models\User;
use yii\web\Response;
use common\models\Department;

/**
 * Site controller
 */
class InformationController extends Controller
{

    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
        Yii::$app->response->format = Response::FORMAT_JSON;
    }

    public function actionOne()
    {
        $department = new Department();
        $department->scenario = Department::SCENARIO_ONE;
        $department->setAttributes(Yii::$app->request->post());
        $department->expand = Yii::$app->request->post('expand');
        $department->order_by = ['id'=>2];
        return $department->getOne();
    }
    public function actionList()
    {
        $department = new Department();
        $department->scenario = Department::SCENARIO_LIST;
        $department->setAttributes(Yii::$app->request->post());
        $department->expand = ['user'];
        list($total, $result) = $department->getList();
        return ['data'=>$result , 'total' => $total];
    }
    public function actionEdit()
    {
        $department = new Department();
        $department->scenario = Department::SCENARIO_EDIT;
        $postData = Yii::$app->request->post();
        $department->setAttributes($this->SafeFilter($postData));
        return $department->getEdit();
    }
    public function actionUpdate()
    {
        $department = new User();
        $department->scenario = User::SCENARIO_UPDATE;
        $postData = Yii::$app->request->post();
        $department->setAttributes($this->SafeFilter($postData));
        $department->id = Yii::$app->user->identity->id;
        return $department->getUpdate();
    }

    public function actionAdd()
    {
        $information = new Information();
        $information->scenario = Information::SCENARIO_ADD;
        $information->setAttributes(Yii::$app->request->post());
        $information->create_time = time();
        return $information->getAdd();
    }
}