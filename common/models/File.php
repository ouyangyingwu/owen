<?php
namespace common\models;

use Yii;

class File extends  BaseModel
{
    public $content;
    public $name;
    public $type;
    public $tmp_name;
    public $error;
    public $size;

    public function FileUrl()
    {
        if (@$this->error > 0) {
            //上传失败
            switch ($this->error) {
                case 1 :
                    return "上传失败，超过了PHP配置文件中的upload_max_filesize设置的大小";
                    break;
                case 2 :
                    return "上传失败，超过了HTML表单中的MAX_FILE_SIZE选项指定的值";
                    break;
                case 3 :
                    return "上传失败，只有部分文件被上传";
                    break;
                case 4 :
                    return "上传失败，上传文件大小为0，即没有上传任何文件";
                    break;
            }
        } else {
            //上传成功
            //自动获取后缀名
            $file_arr = explode(".", $this->name);    //上传的文件名分割为数组
            $fileExt = $file_arr[count($file_arr) - 1];                //获取后缀名

            //判断文件上传的后缀名是否为允许的类型
            $alowExt = "jpg,png,gif";
            $Text ="txt,text,doc,docx";
            if (strstr($alowExt, $fileExt)) {
                //设置名字
                $fileNewName = "CS" . date("YmdHis") . mt_rand(1000, 9999) . "." . $fileExt;
                if (is_uploaded_file($this->tmp_name)) {  //判断文件是否通过HTTP POST方式上传的
                    if (@move_uploaded_file($this->tmp_name, "./image/upload/" . $fileNewName)) {
                        return "upload/" . $fileNewName;
                    } else {
                        return "上传失败";
                    }
                }
            } elseif(strstr($Text, $fileExt)){
                $fileNewName = "CS" . date("YmdHis") . mt_rand(1000, 9999) . "." . $fileExt;
                if (is_uploaded_file($this->tmp_name)) {  //判断文件是否通过HTTP POST方式上传的
                    if (@move_uploaded_file($this->tmp_name, "./file/" . $fileNewName)) {
                        return $fileNewName;
                    } else {
                        return "上传失败";
                    }
                }
            }else {
                echo $fileExt . "类型文件不允许上传！";
            }
        }
    }

    public function FileDelete(){
        if (@unlink ('../web/image/'.$this->name)) {
            return true;
        } else {
            return false;
        }
    }

    public function FileCreate(){
        $name = 'CS'.date('YmdHis', time()).rand(1000 , 9999).'.txt';
        $url = '../web/file/'.$name;
        $url = fopen($url , "w");
        fwrite($url , $this->content);
        if(fclose($url)){
            return $name;
        }
    }
}
