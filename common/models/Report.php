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
    public $courseName;
    public $majorName;

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
            [['start_time','end_time','student_id','teacher_id','admin_id','period'],'integer'],
            [['stuNo','couNo','exam_time','teamName'],'string'],
            [['stuNo'],'required','on'=>[self::SCENARIO_EXPORT_REPORT_ONE]],
            [['teamName','period'],'required','on'=>[self::SCENARIO_EXPORT_REPORT_TEAM]],
            [['majorName'],'required','on'=>[self::SCENARIO_EXPORT_REPORT_MAJOR]],
            [['period','couNo'],'required','on'=>[self::SCENARIO_EXPORT_REPORT_COURSE]],
        ];
    }
    //保护字段
    public function scenarios()
    {
        return [
            self::SCENARIO_EXPORT_REPORT => ['start_time','end_time','student_id','teacher_id','admin_id','stuNo'],
            self::SCENARIO_EXPORT_REPORT_ONE => ['start_time','end_time','stuNo'],
            self::SCENARIO_EXPORT_REPORT_COURSE => ['period','courseName','exam_time'],
            self::SCENARIO_EXPORT_REPORT_TEAM => ['period','teamName','exam_time'],
            self::SCENARIO_EXPORT_REPORT_MAJOR => ['majorName','period'],
        ];
    }
    /**
     * 获取一个学生的成绩
     */
    public function exportStudentScore()
    {
        $this->scenario = self::SCENARIO_EXPORT_REPORT_ONE;
        if ($this->validate()) {

            $student = new UserStudent();
            $student->expand = ['register','register.course','user','team','major','department'];
            $student->stuNo = $this->stuNo;
            $student_register = $student->getOne();

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
    /**
     * 获取一门课程学生的成绩
     */
    public function exportCourseScore()
    {
        $this->scenario = self::SCENARIO_EXPORT_REPORT_COURSE;
        if ($this->validate()) {

            $course = new Course();
            $course->expand = ['register.student.user','register.student.team'];
            $course->period = $this->period;
            $course->courseName = $this->courseName;
            $student_register = $course->getOne();

            $csvData = [];
            array_push($csvData , ['届','班级','姓名','成绩']);
            if($student_register){
                foreach ($student_register['register'] as $value) {
                    array_push($csvData, [
                        $student_register['period'],
                        $value['student']['team']['teamName'],
                        $value['student']['user']['username'],
                        $value['score'],
                    ]);
                }
            }
            $fileName = '第'.$student_register['period'].'届'.$student_register['courseName'].'课程的成绩单';
            return [$fileName, $this->outPutCSV($csvData)];
        } else {
            $errorStr = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorStr);
        }
    }
    /**
     * 获取一个班学生的成绩
     */
    public function exportTeamScore()
    {
        $this->scenario = self::SCENARIO_EXPORT_REPORT_TEAM;
        if ($this->validate()) {
            $team = new Team();
            $team->expand = ['student.user','student.register'];
            $team->teamName = $this->teamName;
            $student_register = $team->getOne();

            $titlename = ['学号','姓名'];
            $course = new Course();
            $course->period = $student_register['period'];
            $course->order_by = ['id'=>1];
            list($total , $courseList) = $course->getList();
            foreach($courseList as $value){
                $titlename[] = $value['courseName'];
            }
            $courseID = array_column($courseList , 'id');

            $csvData = [];
            array_push($csvData , $titlename);
            if($student_register){
                foreach($student_register['student'] as $value){
                    $data = [$value['stuNo'] , $value['user']['username']];
                    $stuCourseID = array_column($value['register'] , 'course_id');
                    foreach ($courseID as $cId) {
                        $i = array_search($cId , $stuCourseID);
                        if(is_numeric($i)){
                            $data[] = $value['register'][$i]['score']?:'0';
                        } else {
                            $data[] = '未选择';
                        }
                    }
                    array_push($csvData , $data);
                }
            }
            $fileName = '第'.$student_register['period'].'届'.$student_register['teamName'].'的成绩单';

            return [$fileName, $this->outPutCSV($csvData)];
        } else {
            $errorStr = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorStr);
        }
    }
    /**
     * 获取一个专业学生的成绩
     */
    public function exportMajorScore()
    {
        $this->scenario = self::SCENARIO_EXPORT_REPORT_MAJOR;
        if ($this->validate()) {
            $major = new Major();
            $major->expand = ['team.student.user','team.student.register'];
            $major->majorName = $this->majorName;
            $student_register = $major->getOne();
            //var_dump($student_register);die;

            $titlename = ['班级','学号','姓名'];
            $course = new Course();
            $course->period = $this->period;
            $course->order_by = ['id'=>1];
            list($total , $courseList) = $course->getList();
            foreach($courseList as $value){
                $titlename[] = $value['courseName'];
            }
            $courseID = array_column($courseList , 'id');
            $csvData = [];
            foreach($student_register['team'] as $teamList){
                $team = [];
                array_push($team , $titlename);
                $teaminformation = $teamList['period'].'届'.$teamList['teamName'];
                foreach($teamList['student'] as $value){
                    $data = [$teaminformation ,$value['stuNo'] , $value['user']['username']];
                    $stuCourseID = array_column($value['register'] , 'course_id');
                    foreach ($courseID as $cId) {
                        $i = array_search($cId , $stuCourseID);
                        if(is_numeric($i)){
                            $data[] = $value['register'][$i]['score']?:'0';
                        } else {
                            $data[] = '未选择';
                        }
                    }
                    array_push($team , $data);
                }
                array_push($csvData , $team);
                array_push($csvData , []);
            }
            $fileName = $this->period ? $this->majorName.'专业第'.$this->period.'届的成绩单' : $this->majorName.'专业的成绩单';
            return [$fileName, $this->outPutCSV($csvData)];
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
        $Dimension = $this->array_depth($csvData);
        if($Dimension == 3){
            foreach ($csvData as $data)
            {
                if(count($data) > 0){
                    foreach($data as $value){
                        $content[] = '"'.implode('","', $value).'"';
                    }
                } else {
                    $content[] = '"'.implode('","', []).'"';
                }
            }
        } else {
            foreach($csvData as $data){
                $content[] = '"'.implode('","', $data).'"';
            }
        }

        return implode("\n", $content);
    }
    /**
     * 计算数组的维度
     */
    private function array_depth($array) {
        if(!is_array($array)) return 0;
        $max_depth = 1;
        foreach ($array as $value) {
            if (is_array($value)) {
                $depth = $this->array_depth($value) + 1;

                if ($depth > $max_depth) {
                    $max_depth = $depth;
                }
            }
        }
        return $max_depth;
    }

    /**
     * 获取一个专业学生的成绩
     */
    public function exportImportScore($file_name)
    {
        $file = fopen($file_name , 'r');
        $file_data = [];
        while ($data = fgetcsv($file)) { //每次读取CSV里面的一行内容
        //print_r($data); //此为一个数组，要获得每一个数据，访问数组下标即可
            $file_data[] = $data;
        }
        fclose($file);

        var_dump($file_data);die;
    }
}
