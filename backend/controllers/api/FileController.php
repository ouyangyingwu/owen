<?php
namespace backend\controllers\api;

use common\models\File;
use Yii;
use yii\web\Controller;

/**
 * Site controller
 */
class FileController extends Controller
{
    public $enableCsrfValidation = false;

    /*public function beforeAction($action)     //本方法同上一句代码
    {
        if($this->action->id == 'url'){
            $this->enableCsrfValidation = false;
        }
        return parent::beforeAction($action); // TODO: Change the autogenerated stub
    }*/


    public function actionUrl()
    {
        //return false;
        $upload_file = new File();
        $upload_file->name = $_FILES['file']['name'];
        $upload_file->type = $_FILES['file']['type'];
        $upload_file->tmp_name = $_FILES['file']['tmp_name'];
        $upload_file->error = $_FILES['file']['error'];
        $upload_file->size = $_FILES['file']['size'];
        return $upload_file ->FileUrl();
    }
    public function actionDelete()
    {
        $delete_file = new File();
        $delete_file->name = Yii::$app->request->post('name');
        $delete_file->url = Yii::$app->request->post('url');
        return $delete_file ->FileDelete();
    }

    public function actionAdd()
    {
        $create_file = new File();
        $create_file->content = Yii::$app->request->post('content');
        return $create_file ->FileCreate();
    }
    /*public function actionDownLoad (){
        $downLoad_file = new File();
        $downLoad_file->name = Yii::$app->request->post('name');
        $downLoad_file->content = Yii::$app->request->post('content');
        $downLoad_file ->FileDownLoad();
    }*/
}