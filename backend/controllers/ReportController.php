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
        $report->scenario = Report::SCENARIO_EXPORT_REPORT_ONE;
        $report->setAttributes(Yii::$app->request->get());
        list($filenName, $content) = $report->exportStudentScore();
        $this->putCsv($content,$filenName);
    }
    /**
     * 导出课程成绩
     */
    public function actionCourseScore(){
        $report = new Report();
        $report->scenario = Report::SCENARIO_EXPORT_REPORT_COURSE;
        $report->setAttributes(Yii::$app->request->get());
        list($filenName, $content) = $report->exportCourseScore();
        $this->putCsv($content,$filenName);
    }
    /**
     * 导出班级全部学生成绩
     */
    public function actionTeamScore(){
        $report = new Report();
        $report->scenario = Report::SCENARIO_EXPORT_REPORT_TEAM;
        $report->setAttributes(Yii::$app->request->get());
        list($filenName, $content) = $report->exportTeamScore();
        //var_dump($content,$fileName,$title,$titlename);die;
        $this->putCsv($content,$filenName);
    }
    /**
     * 导出专业全部学生成绩
     */
    public function actionMajorScore(){
        $report = new Report();
        $report->scenario = Report::SCENARIO_EXPORT_REPORT_MAJOR;
        $report->setAttributes(Yii::$app->request->get());
        list($filenName, $content) = $report->exportMajorScore();
        $this->putCsv($content,$filenName);
    }
    /**
     * 生成导出excel文件
     */
    private function putCsv($content,$fileName)
    {
        header('Content-type:text/csv; charset=utf-8');
        header('Content-Disposition:attachment;filename='.$fileName.'.csv');
        header('Cache-Control:must-revalidate,post-check=0,pre-check=0');
        header('Expires:0');
        header('Pragma:public');
        //字符转译，使的中文不乱码
        $content = iconv('UTF-8',"GB2312//IGNORE",$content);
        echo $content;
    }
    /**
     * 导入课程成绩
     */
    public function actionImportScore(){
        $report = new Report();
        $report->scenario = Report::SCENARIO_IMPORT_REPORT;
        $report->setAttributes(Yii::$app->request->get());
        list($filenName, $content) = $report->exportImportScore();
        $this->putCsv($content,$filenName);
    }
}
