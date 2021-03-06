<?php
namespace backend\controllers\api;

use Yii;
use yii\web\Controller;
use yii\web\Response;
use common\models\Alumna;

/**
 * Site controller
 */
class AlumnaController extends Controller
{

    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
        Yii::$app->response->format = Response::FORMAT_JSON;
    }
    public function actionList()
    {
        $alumna = new Alumna();
        $alumna->scenario = Alumna::SCENARIO_LIST;
        $alumna->setAttributes(Yii::$app->request->post());
        list($total, $result) = $alumna->getList();
        if($result){
            foreach($result as &$value){
                $value['age'] = (date('m') - date('m' , $value['birth'])) > 0 ? (date('Y') - date('Y' , $value['birth'])) : (date('Y') - date('Y' , $value['birth']))-1;
                $value['reason_list'] = json_decode($value['reason_list']);
                $value['reward'] = json_decode($value['reward']);
                $value['punish'] = json_decode($value['punish']);
            }
        }
        return ['data'=>$result , 'total' => $total];
    }
    public function actionEdit()
    {
        $alumna = new Alumna();
        $alumna->scenario = Alumna::SCENARIO_EDIT;
        $alumna->setAttributes(Yii::$app->request->post());
        return $alumna->getEdit();
    }
    public function actionAdd()
    {
        $alumna = new Alumna();
        $alumna->scenario = Alumna::SCENARIO_ADD;
        $postData = Yii::$app->request->post();
        $alumna->setAttributes($this->SafeFilter($postData));
        return $alumna->getAdd();
    }
}