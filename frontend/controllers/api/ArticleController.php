<?php
namespace frontend\controllers\api;

use Yii;
use yii\web\Controller;
use common\models\Article;
use yii\web\Response;

/**
 * Site controller
 */
class ArticleController extends Controller
{
    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
        Yii::$app->response->format = Response::FORMAT_JSON;
    }

    public function actionOne()
    {
        $article = new Article();
        $article->id = Yii::$app->request->post('id');
        return $article->getOne();
    }
    public function actionList()
    {
        $article = new Article();
        $article->scenario = Article::SCENARIO_SEARCH;
        $article->setAttributes(Yii::$app->request->post());    //只有上一句代码存在时才能使用这句接批量收数据
        $article->expand = ['user'];
        $article->status = 1;
        list($total, $result) = $article->getList();
        return ['data'=>$result , 'total' => $total];
    }
    public function actionAdd()
    {
        $article = new Article();
        $article->scenario = Article::SCENARIO_ADD;
        $postData = Yii::$app->request->post();
        $article->setAttributes($this->SafeFilter($postData));
        $article->user_id = Yii::$app->user->identity->id;
        return $article->getAdd();
    }
    public function actionEdit()
    {
        $article = new Article();
        $article->scenario = Article::SCENARIO_EDIT;
        $postData = Yii::$app->request->post();
        $article->setAttributes($this->SafeFilter($postData));
        return $article->getEdit();
    }
}