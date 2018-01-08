<?php
namespace backend\controllers\api;

use Yii;
use yii\web\Controller;
use common\models\User;
use yii\web\Response;
use common\models\Major;
use common\models\Course;
use common\models\UserTeacher;
use common\models\ClassRoom;
use common\models\Alumna;
use common\models\Department;
use common\models\Register;
use common\models\UserStudent;

/**
 * Site controller
 */
class Dashboard extends Controller
{

    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
        Yii::$app->response->format = Response::FORMAT_JSON;
    }

    public function actionTodo()
    {
        $student = new UserStudent();
        list($stuTotal , $student) = $student->getList();
        $teacher = new UserTeacher();
        list($teaTotal , $teacher) = $teacher->getList();
        $department = new Department();
        list($depTotal , $department) = $department->getList();
        $alumna = new Alumna();
        list($aiuTotal , $alumna) = $alumna->getList();
        $overCount = [];
        $overCount[] = $stuTotal;
        $overCount[] = $teaTotal;
        $overCount[] = $depTotal;
        $overCount[] = $aiuTotal;
        return[
            'overCount' => $overCount,

        ];
    }
    public function actionList()
    {
        $course = new Course();
        $course->scenario = Course::SCENARIO_LIST;
        $course->setAttributes(Yii::$app->request->post());
        $course->expand = ['user' , 'major' , 'department','classRoom'];
        list($total, $result) = $course->getList();
        if($result){
            foreach($result as &$value){
                $value['people'] = Register::find()->where(['id'=>$course->id])->count();
                $value['class_time'] = json_decode($value['class_time']);
            }
        }
        return ['data'=>$result , 'total' => $total];
    }
    public function actionListData()
    {
        $user = new User();
        $user->type = 2;
        $user->expand = ['teacher'];
        $user->per_page = '';
        list($totle , $teacher) = $user->getList();

        $major = new Major();
        $major->per_page = '';
        list($total, $major) = $major->getList();

        $classRoom = new ClassRoom();
        $classRoom->per_page = '';
        $classRoom->crNumberOfSeat = Yii::$app->request->post('number');
        list($total, $classRoom) = $classRoom->getList();
        return[
            'teacher' => $teacher,
            'major' => $major,
            'classRoom' => $classRoom
        ];
    }
}