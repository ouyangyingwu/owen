<?php
namespace backend\controllers\api;

use common\models\AdminMenu;
use common\models\Alumna;
use common\models\Department;
use common\models\Major;
use common\models\Team;
use Yii;
use common\models\Dict;
use yii\web\Controller;
use common\models\User;
use common\models\UserStudent;
use common\models\UserTeacher;
use common\models\UserAdmin;
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
        $user->scenario = User::SCENARIO_ONE;
        $user->id = Yii::$app->user->identity->id;
        $user->setAttributes(Yii::$app->request->post());
        return $user->getOne();
    }
    public function actionNumber()
    {
        $user = new User();
        $user->scenario = User::SCENARIO_ONE;
        $user->setAttributes(Yii::$app->request->post());
        $user->expand = Yii::$app->request->post('expand');
        $user->order_by = ['id'=>2];
        return $user->getOne();
    }
    public function actionListData()
    {
        $department = new Department();
        $department->per_page = '';
        list($total , $department) = $department->getList();

        $major = new Major();
        $major->per_page = '';
        list($total , $major) = $major->getList();

        $team = new Team();
        $team->per_page = '';
        list($total , $team) = $team->getList();

        return[
            'team' => $team,
            'major' => $major,
            'department' => $department,
            'sex' => Dict::$sex,
            'adminName' => Dict::$adminName,
            'active' => Dict::$active,
            'character' => Dict::$character,
            'studentStatus' => Dict::$studentStatus,
        ];
    }
    public function actionList()
    {
        $user = new User();
        $user->scenario = User::SCENARIO_SEARCH;
        $user->setAttributes(Yii::$app->request->post());
        $user->expand = ['student' , 'teacher' , 'admin'];
        list($total, $result) = $user->getList();
        foreach($result as &$item){
            if($item['student'] && $item['student']['reward']){
                $item['student']['reward'] = json_decode($item['student']['reward']);
            }
            if($item['student'] && $item['student']['punish']){
                $item['student']['punish'] = json_decode($item['student']['punish']);
            }
            if($item['teacher'] && $item['teacher']['reward']){
                $item['teacher']['reward'] = json_decode($item['teacher']['reward']);
            }
            if($item['teacher'] && $item['teacher']['punish']){
                $item['teacher']['punish'] = json_decode($item['teacher']['punish']);
            }
            if($item['admin'] && $item['admin']['reward']){
                $item['admin']['reward'] = json_decode($item['admin']['reward']);
            }
            if($item['admin'] && $item['admin']['punish']){
                $item['admin']['punish'] = json_decode($item['admin']['punish']);
            }

        }
        return ['data'=>$result , 'total' => $total];
    }
    public function actionListStudent()
    {
        $user = new UserStudent();
        $user->scenario = UserStudent::SCENARIO_LIST;
        $user->setAttributes(Yii::$app->request->post());
        $user->expand = ['user','major','department','team'];
        $user->order_by = ['id'=>1];
        list($total, $result) = $user->getList();
        if($result){
            foreach($result as &$item){
                if($item['reward']){
                    $item['reward'] = json_decode($item['reward']);
                }
                if( $item['punish']){
                    $item['punish'] = json_decode($item['punish']);
                }

            }
        }
        return ['data'=>$result , 'total' => $total];
    }
    public function actionListTeacher()
    {
        $user = new UserTeacher();
        $user->scenario = UserTeacher::SCENARIO_LIST;
        $user->setAttributes(Yii::$app->request->post());
        $user->expand = ['user','department','division'];
        list($total, $result) = $user->getList();
        if($result){
            foreach($result as &$item){
                if($item['reward']){
                    $item['reward'] = json_decode($item['reward']);
                }
                if( $item['punish']){
                    $item['punish'] = json_decode($item['punish']);
                }

            }
        }
        return ['data'=>$result , 'total' => $total];
    }
    public function actionEdit()
    {
        if(!Yii::$app->request->post('type') || Yii::$app->request->post('type')=='user'){
            $user = new User();
            $user->scenario = User::SCENARIO_EDIT;
            $postData = Yii::$app->request->post();
            $user->setAttributes($this->SafeFilter($postData));
            return $user->getEdit();
        }else{
            switch(Yii::$app->request->post('type')){
                case 'student':
                    $user = new UserStudent();
                    $user->scenario = UserStudent::SCENARIO_EDIT;
                    $user->setAttributes(Yii::$app->request->post());
                    return $user->getEdit();break;
                case 'teacher':
                    $user = new UserTeacher();
                    $user->scenario = UserTeacher::SCENARIO_EDIT;
                    $user->setAttributes(Yii::$app->request->post());
                    return $user->getEdit();break;
                case 'admin':
                    $user = new UserAdmin();
                    $user->scenario = UserAdmin::SCENARIO_EDIT;
                    $user->setAttributes(Yii::$app->request->post());
                    return $user->getEdit();break;
            }
        }
    }
    public function actionUpdate()
    {
        $user = new User();
        $user->scenario = User::SCENARIO_UPDATE;
        $postData = Yii::$app->request->post();
        $user->setAttributes($this->SafeFilter($postData));
        $user->id = Yii::$app->user->identity->id;
        return $user->getUpdate();
    }
    public function actionResetPassword()
    {
        $user = new User();
        $user->scenario = User::SCENARIO_RESET_PASSWORD;
        $user->setAttributes(Yii::$app->request->post());
        $user->id = Yii::$app->user->identity->id;
        return $user->getResetPassword();
    }
    public function actionAdd()
    {
        $user = new User();
        $user->scenario = User::SCENARIO_ADD;
        $postData = Yii::$app->request->post();
        $user->setAttributes($this->SafeFilter($postData));
        $user->birth = strtotime($user->birth);

        //开始事务
        $transaction = Yii::$app->db->beginTransaction();
        $user = $user->getAdd();
        try{
            if(!$user){
                throw new \Exception('用户创建失败！');
            }
            if($user->type == 1){
                $userStudent = new UserStudent();
                $userStudent->scenario = UserStudent::SCENARIO_ADD;
                $userStudent->user_id = $user->id;
                $userStudent->setAttributes(Yii::$app->request->post());
                if(!$userStudent->getAdd()){
                    throw new \Exception('角色生成失败！');
                }
            }elseif($user->type == 2){
                $userTeacher = new UserTeacher();
                $userTeacher->scenario = UserTeacher::SCENARIO_ADD;
                $userTeacher->user_id = $user->id;
                $userTeacher->setAttributes(Yii::$app->request->post());
                if(!$userTeacher->getAdd()){
                    throw new \Exception('角色生成失败！');
                }
            }elseif($user->type == 3){
                $userAdmin = new UserAdmin();
                $userAdmin->scenario = UserAdmin::SCENARIO_ADD;
                $userAdmin->user_id = $user->id;
                $userAdmin->setAttributes(Yii::$app->request->post());
                if(!$userAdmin->getAdd()){
                    throw new \Exception('角色生成失败！');
                }
            }
            $transaction->commit();
        } catch(\Exception $e){
            $transaction->rollback();
            throw new \Exception($e->getMessage());
        }
        return true;
    }
    public function actionFinishSchool()
    {
        $user = new User();
        $user->scenario = User::SCENARIO_DELETE;
        $user->id = Yii::$app->request->post('id');
        $student = new UserStudent();
        $student->scenario = User::SCENARIO_DELETE;
        $student->id = Yii::$app->request->post('id');
        if($user->getDelete() && $student->getDelete()){
            $alumna = new Alumna();
            $alumna->scenario = Alumna::SCENARIO_ADD;
            $alumna->setAttributes(Yii::$app->request->post());
            $alumna->reward = json_encode($alumna->reward);
            $alumna->punish = json_encode($alumna->punish);
            return $alumna->getAdd();
        }
        throw new \Exception('未知错误！！！');
    }

    public function actionMenuList()
    {
        $type = Yii::$app->user->identity->type;
        if($type == 3){
            $admin = UserAdmin::find()->asArray()->select('purview')->where(['user_id'=>Yii::$app->user->identity->id])->one();
            $type = $admin['purview'];
        }
        $adminMenu = new AdminMenu();
        $adminMenu->scenario = AdminMenu::SCENARIO_LIST;
        $adminMenu->id = Dict::$adminPurview[$type];
        $adminMenu->order_by = ['sort'=>1];
        $list = $adminMenu->getList();
        $html = $this->renderPartial('left', ['list' => $list]);
        return ['html' => $html];
    }
}