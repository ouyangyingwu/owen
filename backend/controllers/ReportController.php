<?php
namespace backend\controllers;

use Yii;
use yii\web\Controller;
use common\models\Report;

/**
 * Report controller
 */
class ReportController extends Controller
{
    /**
     * 导出学生成绩
     */
    public function actionStudentScore(){
        $report = new Report();
        //$report->scenario = Report::SCENARIO_EXPORT_REPORT;
        $report->setAttributes(Yii::$app->request->get());
        $report->start_time = Yii::$app->request->get('start_time');
        $report->end_time = Yii::$app->request->get('end_time');
        list($filenName, $content) = $report->exportStudentScore();
        //var_dump($content);die;
        $this->putCsv($content,$filenName);
    }

    /**
     * 生成导出excel文件
     */
    private function putCsv($content,$fileName){
        /* //可用，但是中文会出现乱码
        header('Content-type:text/csv; charset=utf-8');
        header('Content-Disposition:attachment;filename='.$fileName.'.csv');
        header('Cache-Control:must-revalidate,post-check=0,pre-check=0');
        header('Expires:0');
        header('Pragma:public');
        echo $content;*/

        /* //可用，但是每次打开会报（文件格式和扩展名不匹配）
        header("Content-type:application/vnd.ms-excel");
        header("Content-Disposition:filename=".$fileName.".xls");
        $strexport = iconv('UTF-8',"GB2312//IGNORE",$content);
        exit($strexport);*/
    }

}
