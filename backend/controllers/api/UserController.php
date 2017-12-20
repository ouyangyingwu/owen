<?php
namespace backend\controllers\api;


use Yii;
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
        $user->setAttributes(Yii::$app->request->post());
        $user->expand = Yii::$app->request->post('expand');
        $user->order_by = ['id'=>2];
        return $user->getOne();
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
    public function actionEdit()
    {
        if(!Yii::$app->request->post('type')){
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
        $user->dirthday = strtotime($user->dirthday);

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
}