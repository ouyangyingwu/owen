<?php
namespace backend\controllers\api;


use Yii;
use yii\web\Controller;
use common\models\ClassRoom;
use yii\web\Response;

/**
 * Site controller
 */
class ClassRoomController extends Controller
{

    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
        Yii::$app->response->format = Response::FORMAT_JSON;
    }

    public function actionOne()
    {
        $user = new ClassRoom();
        $user->scenario = ClassRoom::SCENARIO_ADD;
        $user->id = Yii::$app->request->post('id');
        return $user->getOne();
    }
    public function actionList()
    {
        $room = new ClassRoom();
        $room->scenario = ClassRoom::SCENARIO_LIST;
        $room->setAttributes(Yii::$app->request->post());
        $room->expand = ['user'];
        list($total, $result) = $room->getList();
        foreach($result as &$item){
            if($item['maintain']){
                $item['maintain'] = json_decode($item['maintain']);
            }
        }
        return ['data'=>$result , 'total' => $total];
    }
    public function actionEdit()
    {
        $user = new ClassRoom();
        $user->scenario = ClassRoom::SCENARIO_EDIT;
        $user->setAttributes(Yii::$app->request->post());
        return $user->getEdit();
    }
    public function actionUpdate()
    {
        $user = new ClassRoom();
        $user->scenario = ClassRoom::SCENARIO_UPDATE;
        $postData = Yii::$app->request->post();
        $user->setAttributes($this->SafeFilter($postData));
        return $user->getUpdate();
    }
    public function actionAdd()
    {
        $user = new ClassRoom();
        $user->scenario = ClassRoom::SCENARIO_ADD;
        $postData = Yii::$app->request->post();
        $user->setAttributes($this->SafeFilter($postData));
        return $user->getAdd();

    }
}