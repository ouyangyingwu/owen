<?php
namespace common\models;

use Yii;
use common\exception\ModelException;

/**
 * 导出excel文件
 *
 */
class Report extends  BaseModel
{
    public $start_time;
    public $end_time;
    public $student_id;
    public $teacher_id;
    public $admin_id;

    private $_query;

    const SCENARIO_EXPORT_REPORT = 'export_report';
    const SCENARIO_IMPORT_REPORT = 'import_report';

    /**
     * @inheritdoc
     * 字段验证规则
     */
    public function rules()
    {
        return [
            [['start_time','end_time','student_id','teacher_id','admin_id' ],'integer'],
        ];
    }
    //保护字段
    public function scenarios()
    {
        return [
            self::SCENARIO_EXPORT_REPORT => ['start_time','end_time','student_id','teacher_id','admin_id'],
        ];
    }

    public function exportStudentScore(){
        //$this->scenario = self::SCENARIO_EXPORT_REPORT;
        //if ($this->validate()) {
        /*WHERE r.exam_time >= time($this->start_time)
            AND r.exam_time < time($this->end_time)
            AND r.exam_time <> null*/
            $connection = Yii::$app->db;
            $staticSql = "SELECT * FROM register AS r
            LEFT JOIN course AS c ON r.course_id=c.id
            LEFT JOIN user_student AS s ON r.student_id=s.id
            LEFT JOIN user AS u ON s.user_id=u.id
            LEFT JOIN team as t ON s.team_id=t.id
            LEFT JOIN major as m ON s.major_id=m.id
            LEFT JOIN department as d ON s.department_id=d.id

            ORDER BY c.courseName ASC";

            $countCommand = $connection->createCommand($staticSql);
            $student_register = $countCommand->query()->readAll();
            $connection->close();
            /*$csvData = [];
            array_push($csvData, [
                '系', '专业', '班级', '学号', '姓名', '届', '开始时间', '结束时间', '科目','成绩'
            ]);*/
            $csvData = "系\t 专业\t 班级\t 学号\t 姓名\t 届\t 开始时间\t 结束时间\t 科目\t 成绩\r";

            //var_dump($student_register);die;
            if($student_register){
                foreach($student_register as $res){
                    /*array_push($csvData, [
                        $res['depName'],
                        $res['majorName'],
                        $res['teamName'],
                        $res['stuNo'],
                        $res['username'],
                        $res['period'],
                        $this->start_time,
                        $this->end_time,
                        $res['courseName'],
                        $res['score'],
                    ]);*/
                    $csvData .= $res['depName']."\t";
                    $csvData .= $res['majorName']."\t";
                    $csvData .= $res['teamName']."\t";
                    $csvData .= $res['stuNo']."\t";
                    $csvData .= $res['username']."\t";
                    $csvData .= $res['period']."\t";
                    $csvData .= $this->start_time."\t";
                    $csvData .= $this->end_time."\t";
                    $csvData .= $res['courseName']."\t";
                    $csvData .= $res['score']."\r";
                }
            }
            //array_push($csvData,[]);

            $fileName = '成绩 ('.$this->start_time.' to '.$this->end_time.')';
            //return [$fileName, $csvData];
            //return [$fileName, $this->outPutCSV($csvData)];
        /*} else {
            $errorStr = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorStr);
        }*/
        $dataResult = array();      //todo:导出数据（自行设置）
        $headTitle = "XX保险公司 优惠券赠送记录";
        $title = "优惠券记录";
        $headtitle= "<tr style='height:50px;border-style:none;><th border=\"0\" style='height:60px;width:270px;font-size:22px;' colspan='11' >{$headTitle}</th></tr>";
        $titlename = "<tr>
               <th style='width:70px;' >合作商户</th>
               <th style='width:70px;' >会员卡号</th>
               <th style='width:70px;'>车主姓名</th>
               <th style='width:150px;'>手机号</th>
               <th style='width:70px;'>车牌号</th>
               <th style='width:100px;'>优惠券类型</th>
               <th style='width:100px;'>优惠券名称</th>
               <th style='width:100px;'>优惠券面值</th>
               <th style='width:100px;'>优惠券数量</th>
               <th style='width:70px;'>赠送时间</th>
               <th style='width:90px;'>截至有效期</th>
           </tr>";
        $filename = $title.".xls";
        $this->excelData($dataResult,$titlename,$headtitle,$filename);
    }

    public function excelData($datas,$titlename,$title,$filename){
        $str = "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\"\r\nxmlns:x=\"urn:schemas-microsoft-com:office:excel\"\r\nxmlns=\"http://www.w3.org/TR/REC-html40\">\r\n<head>\r\n<meta http-equiv=Content-Type content=\"text/html; charset=utf-8\">\r\n</head>\r\n<body>";
        $str .="<table border=1><head>".$titlename."</head>";
        $str .= $title;
        foreach ($datas  as $key=> $rt )
        {
            $str .= "<tr>";
            foreach ( $rt as $k => $v )
            {
                $str .= "<td>{$v}</td>";
            }
            $str .= "</tr>\n";
        }
        $str .= "</table></body></html>";
        header( "Content-Type: application/vnd.ms-excel; name='excel'" );
        header( "Content-type: application/octet-stream" );
        header( "Content-Disposition: attachment; filename=".$filename );
        header( "Cache-Control: must-revalidate, post-check=0, pre-check=0" );
        header( "Pragma: no-cache" );
        header( "Expires: 0" );
        exit( $str );
    }

    /**
     * 把数据处理好，为导出做准备
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
}
