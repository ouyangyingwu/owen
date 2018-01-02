<?php
namespace backend\controllers\api;

use common\models\UserTeacher;
use Yii;
use yii\web\Controller;
use common\models\User;
use yii\web\Response;
use common\models\Department;
use common\models\Major;
use common\models\Team;
use common\models\UserStudent;

/**
 * Site controller
 */
class TeamController extends Controller
{

    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
        Yii::$app->response->format = Response::FORMAT_JSON;
    }
    public function actionData()
    {
        $department_id = Yii::$app->request->post('department_id');
        $major = new Major();
        $major->department_id = $department_id;
        list($total , $major) = $major->getList();

        $user = new UserTeacher();
        $user->department_id = $department_id;
        $user->expand = ['user'];
        list($total , $user) = $user->getList();

        return[
            'major' => $major,
            'user' => $user,
        ];
    }
    public function actionList()
    {
        $team = new Team();
        $team->scenario = Team::SCENARIO_LIST;
        $team->setAttributes(Yii::$app->request->post());
        $team->expand = ['user' , 'major' , 'department'];
        list($total, $result) = $team->getList();
        if($result){
            foreach($result as &$value){
                $value['people'] = UserStudent::find()->where(['team_id'=>$value['id']])->count();
                $value['honor'] = json_decode($value['honor']);
            }
        }
        return ['data'=>$result , 'total' => $total];
    }
    public function actionListData()
    {
        $user = new User();
        $user->type = [1,2];
        $user->expand = ['student' , 'teacher'];
        $user->per_page = '';
        list($totle , $user) = $user->getList();
        $student = [];$teacher = [];
        foreach($user as $value){
            if($value['type'] == 1){
                $student[] = $value;
            }elseif($value['type'] == 2){
                $teacher[] = $value;
            }
        }
        $major = new Major();
        $major->per_page = '';
        list($total, $major) = $major->getList();

        $department = new Department();
        $department->per_page = '';
        list($total, $department) = $department->getList();
        return[
            'student' => $student,
            'teacher' => $teacher,
            'major' => $major,
            'department' => $department,
        ];
    }
    public function actionEdit()
    {
        $team = new Team();
        $team->scenario = Team::SCENARIO_EDIT;
        $team->setAttributes(Yii::$app->request->post());
        return $team->getEdit();
    }
    public function actionAdd()
    {
        $team = new Team();
        $team->scenario = Team::SCENARIO_ADD;
        $team->setAttributes(Yii::$app->request->post());
        return $team->getAdd();
    }
}