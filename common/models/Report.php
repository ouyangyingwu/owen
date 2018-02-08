<?php
namespace common\models;

use Yii;
use common\exception\ModelException;
use yii\base\Model;

/**
 * 导出excel文件
 * 在没有对应表的模型中应该继承Mode
 */
class Report extends  Model
{
    public $start_time;
    public $end_time;
    public $student_id;
    public $teacher_id;
    public $admin_id;
    public $teamName;
    public $stuNo;
    public $couNo;
    public $period;
    public $exam_time;

    private $_query;

    const SCENARIO_EXPORT_REPORT = 'export_report';
    const SCENARIO_EXPORT_REPORT_ONE = 'export_report_one';
    const SCENARIO_EXPORT_REPORT_TEAM = 'export_report_team';
    const SCENARIO_EXPORT_REPORT_MAJOR = 'export_report_major';
    const SCENARIO_EXPORT_REPORT_COURSE = 'export_report_course';

    const SCENARIO_IMPORT_REPORT = 'import_report';

    /**
     * @inheritdoc
     * 字段验证规则
     */
    public function rules()
    {
        return [
            [['start_time','end_time','student_id','teacher_id','admin_id','major_id','period'],'integer'],
            [['stuNo','couNo','exam_time','teamName'],'string'],
            [['stuNo'],'required','on'=>[self::SCENARIO_EXPORT_REPORT_ONE]],
            [['teamName','period'],'required','on'=>[self::SCENARIO_EXPORT_REPORT_TEAM]],
            [['major_id'],'required','on'=>[self::SCENARIO_EXPORT_REPORT_MAJOR]],
            [['couNo'],'required','on'=>[self::SCENARIO_EXPORT_REPORT_COURSE]],
        ];
    }
    //保护字段
    public function scenarios()
    {
        return [
            self::SCENARIO_EXPORT_REPORT => ['start_time','end_time','student_id','teacher_id','admin_id','stuNo'],
            self::SCENARIO_EXPORT_REPORT_ONE => ['start_time','end_time','stuNo'],
            self::SCENARIO_EXPORT_REPORT_TEAM => ['period','teamName','exam_time'],
        ];
    }

    public function exportStudentScore()
    {
        $this->scenario = self::SCENARIO_EXPORT_REPORT_ONE;
        if ($this->validate()) {

            $student = new UserStudent();
            $student->expand = ['register','register.course','user','team','major','department'];
            $student->stuNo = $this->stuNo;
            $student_register = $student->getOne();
            //var_dump($student_register);die;
            $csvData = [];
            array_push($csvData , ['系','专业','届','班级','学号','姓名']);
            if($student_register){
                array_push($csvData, [
                    $student_register['department']['depName'],
                    $student_register['major']['majorName'],
                    $student_register['team']['period'],
                    $student_register['team']['teamName'],
                    $student_register['stuNo'],
                    $student_register['user']['username'],
                ]);

                array_push($csvData , []);
                array_push($csvData , ['科目','考试时间','成绩','获得学分']);

                foreach ($student_register['register'] as $value) {
                    array_push($csvData , [
                        $value['course']['courseName'],
                        date('Y/m/d' , $value['exam_time']),
                        $value['score'],
                        $value['credit']
                    ]);
                }
            }
            $fileName = $student_register['user']['username'].'的成绩';
            return [$fileName, $this->outPutCSV($csvData)];
        } else {
            $errorStr = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorStr);
        }
    }

    public function exportTeamScore()
    {
        $this->scenario = self::SCENARIO_EXPORT_REPORT_TEAM;
        if ($this->validate()) {
            $team = new Team();
            $team->expand = ['student','student.user','student.register','department'];
            $team->teamName = $this->teamName;
            $student_register = $team->getOne();
            //var_dump($student_register);die;

            $headTitle = '第'.$student_register['period'].'届'.$student_register['department']['depName'].$student_register['teamName'].'的成绩单';
            $titlename = ['学号','姓名'];
            $course = new Course();
            $course->major_id = $student_register['major_id'];
            $course->period = $student_register['period'];
            $course->order_by = ['id'=>1];
            list($total , $courseList) = $course->getList();
            foreach($courseList as $value){
                $titlename[] = $value['courseName'];
            }
            list($title , $headTitle) = $this->excelData($titlename , $headTitle);

            $csvData = [];
            if($student_register){
                foreach($student_register['student'] as $value){
                    $data = [$value['stuNo'] , $value['user']['username']];
                    foreach ($value['register'] as $item) {
                        $data[] = $item['score']?:'';
                    }
                    array_push($csvData , $data);
                }
            }
            $fileName = $student_register['teamName'].'的成绩单';

            return [$csvData,$fileName,$title,$headTitle];
        } else {
            $errorStr = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorStr);
        }
    }

    /**
     * 字符串在转换
    */
    private function outPutCSV($csvData)
    {
        $content = [];
        foreach ($csvData as $data)
        {
            $content[] = '"'.implode('","', $data).'"';
        }
        return implode("\n", $content);
    }
    /**
     * html格式转换
     */
    private function excelData($titlename , $headTitle)
    {
        $width = count($titlename);
        $headTitle= "<tr style='height:50px;border-style:none;><th border=\"0\" style=\"height:60px;width:270px;font-size:22px;\" rowspan=\"2\" colspan='{$width}' >{$headTitle}</th></tr>";
        $title = '';
        $title = "<tr>";
        foreach($titlename as $value){
            $title .= "<th>{$value}</th>";
        }
        $title .= "</tr>";
        return [$title , $headTitle];
    }
}
