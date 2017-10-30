<?php
namespace common\models;

use Yii;

class File extends  BaseModel
{
    public $module;
    public $category;
    public $pk;
    public $name;
    public $type;


    const SCENARIO_FILE_URL = 'fileurl';
    const SCENARIO_ADD = 'add';
    const SCENARIO_STATUS = 'status';
    const SCENARIO_EDIT = 'edit';
    const SCENARIO_DELETE = 'delete';

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id','user_d' ,'title' ,'content'],'required','on'=>self::SCENARIO_EDIT],     //分情景模式验证，修改的时候需要这条规则
            [['id'],'required','on'=>[self::SCENARIO_DELETE,self::SCENARIO_STATUS]],
            [['user_id' ,'title' ,'content'],'required','on'=>self::SCENARIO_ADD],
            [['create_time' , 'type' , 'endit_time'], 'integer'],                     //这条及以下的规则是当数据存在时验证
            [['describe'], 'string', 'max' => 50],
            [['content'], 'string', 'max' => 50000],
        ];
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_FILE_URL => ['name'],
            self::SCENARIO_ADD => ['user_id' , 'describe' , 'title' , 'content'],
            self::SCENARIO_EDIT => ['id'  , 'describe' , 'title' , 'content'],
            self::SCENARIO_STATUS => ['id' , 'status'],
            self::SCENARIO_DELETE => ['id'],
        ];
    }

    public function FileUrl(){
        //header('Content-type:text/html;charset=utf-8;');
        if($this->name){
            $file_arr = explode(".",$this->name);	//上传的文件名分割为数组
            $fileExt = $file_arr[count($file_arr)-1];				//获取后缀名

            //判断文件上传的后缀名是否为允许的类型
            $alowExt = "txt,doc,jpg,png,gif,";
            if(strstr($alowExt,$fileExt)){
                //设置名字
                $fileNewName = "ZNDXTDXY15DS".date("YmdHis").mt_rand(10000,99999).".".$fileExt;
                //if(is_uploaded_file($_FILES["filepath"]["tmp_name"])){  //判断文件是否通过HTTP POST方式上传的
                    if(@move_uploaded_file($_FILES["filepath"]["tmp_name"],"./image/upload/".$fileNewName)){
                        return "upload/" . $fileNewName;
                        echo "文件上传成功！存在: " . "image/upload/" . $fileNewName;
                    } else {
                        echo "文移动传成功！";
                    }
                //}
            } else {
                echo $fileExt."类型文件不允许上传！";
            }
        }
        if(@$_FILES["filepath"]["error"]>0){
            //上传失败
            switch($_FILES["filepath"]["error"]){
                case 1 :echo "上传失败，超过了PHP配置文件中的upload_max_filesize设置的大小";break;
                case 2 :echo "上传失败，超过了HTML表单中的MAX_FILE_SIZE选项指定的值";break;
                case 3 :echo "上传失败，只有部分文件被上传";break;
                case 4 :echo "上传失败，上传文件大小为0，即没有上传任何文件";break;
            }
        } else {
            //上传成功
            //自动获取后缀名
            $file_arr = explode(".",$_FILES["filepath"]["name"]);	//上传的文件名分割为数组
            $fileExt = $file_arr[count($file_arr)-1];				//获取后缀名

            //判断文件上传的后缀名是否为允许的类型
            $alowExt = "txt,doc,jpg,png,gif,";
            if(strstr($alowExt,$fileExt)){
                //设置名字
                $fileNewName = "ZNDXTDXY15DS".date("YmdHis").mt_rand(10000,99999).".".$fileExt;
                if(is_uploaded_file($_FILES["filepath"]["tmp_name"])){  //判断文件是否通过HTTP POST方式上传的
                    if(@move_uploaded_file($_FILES["filepath"]["tmp_name"],"./image/upload/".$fileNewName)){
                        return "upload/" . $fileNewName;
                        echo "文件上传成功！存在: " . "image/upload/" . $fileNewName;
                    } else {
                        echo "文移动传成功！";
                    }
                }
            } else {
                echo $fileExt."类型文件不允许上传！";
            }
        }
    }
}
