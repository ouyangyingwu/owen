<?php
namespace backend\controllers\api;

use common\models\Department;
use common\models\Team;
use common\models\UserStudent;
use Yii;
use yii\web\Controller;
use common\models\User;
use common\models\Major;
use yii\web\Response;

/**
 * Site controller
 */
class MajorController extends Controller
{

    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
        Yii::$app->response->format = Response::FORMAT_JSON;
    }

    public function actionOne()
    {
        $major = new Major();
        $major->scenario = Major::SCENARIO_SEARCH_ONE;
        $major->setAttributes(Yii::$app->request->post());
        $major->id = Yii::$app->request->post('id');
        return $major->getOne();
    }
    public function actionData(){
        $major = new Major();
        $major->scenario = Major::SCENARIO_SEARCH_ONE;
        $major->order_by = ['id'=>2];
        $major = $major->getOne();

        $userTeacher = new User();
        $userTeacher->expand = ['teacher'];
        $userTeacher->type = 2;
        list($totle , $user) = $userTeacher->getList();

        $department = new Department;
        list($totle , $department) = $department->getList();

        return[
            'majorNo' => $major['majorNo'],
            'user' => $user,
            'department' => $department,
        ];
    }
    public function actionList()
    {
        $major = new Major();
        $major->scenario = Major::SCENARIO_LIST;
        $major->setAttributes(Yii::$app->request->post());
        list($total, $result) = $major->getList();
        return ['data'=>$result , 'total' => $total];
    }
    public function actionListData()
    {
        $department = new Department();
        $department->per_page = '';
        list($total , $department) = $department->getList();

        $userList = new User();
        $userList->type = 2;
        $userList->expand = ['teacher'];
        $userList->per_page = '';
        list($total , $userList) = $userList->getList();

        $team = new Team();
        $team->per_page = '';
        list($total , $team) = $team->getList();
        foreach($team as &$item){
            $item['people'] = UserStudent::find()->where(['major_id'=>$item['id']])->count();
        }
        return[
            'department' => $department,
            'teacher' => $userList,
            'team' => $team,
        ];
    }
    public function actionEdit()
    {
        $major = new Major();
        $major->scenario = Major::SCENARIO_EDIT;
        $postData = Yii::$app->request->post();
        $major->setAttributes($this->SafeFilter($postData));
        return $major->getEdit();
    }
    public function actionAdd()
    {
        $major = new Major();
        $major->scenario = Major::SCENARIO_ADD;
        $major->setAttributes(Yii::$app->request->post());
        return $major->getAdd();
    }
}