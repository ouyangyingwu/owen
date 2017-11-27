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
    public $url;

    //上传文件或图片并返回文件名
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
            $Text = "txt,text";
            $Word = "doc,docx";
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
                /**
                 * file_put_contents(file,data,mode,context)
                 * file	必需。规定要写入数据的文件。如果文件不存在，则创建一个新文件。
                 * data	可选。规定要写入文件的数据。可以是字符串、数组或数据流。
                 * mode 可选。规定如何打开/写入文件。可能的值：
                    FILE_USE_INCLUDE_PATH ：检查 file 副本的内置路径
                    FILE_APPEND ：在文件末尾以追加的方式写入数据
                    LOCK_EX ：对文件上锁
                 * context可选。规定文件句柄的环境。context 是一套可以修改流的行为的选项。若使用 null，则忽略。
                */
                $text = file_get_contents($this->tmp_name);
                //转化编码格式，防止中文乱码
                $text = iconv("gb2312", "utf-8//IGNORE",$text);
                //过滤可疑字符
                $newText = $this->SafeFilter($text);
                if($text === $newText){
                    $fileNewName = "CS" . date("YmdHis") . mt_rand(1000, 9999) . "." . $fileExt;
                    if (is_uploaded_file($this->tmp_name)) {  //判断文件是否通过HTTP POST方式上传的
                        if (@move_uploaded_file($this->tmp_name, "./file/" . $fileNewName)) {
                            return $fileNewName;
                        } else {
                            return "上传失败";
                        }
                    }
                } else {
                    $this->content = $newText;
                    return $this->FileCreate();
                }
            } elseif (strstr($Word, $fileExt)){
                //如果上传文件是word文本类型，就把它转化为txt文本(注意:这段代码只能转化文字图片无法转化)
                $filename = $this->tmp_name;
                $striped_content = '';
                $content = '';

                if(!$filename || !file_exists($filename)) return false;

                $zip = zip_open($filename);
                if (!$zip || is_numeric($zip)) return false;

                while ($zip_entry = zip_read($zip)) {
                    if (zip_entry_open($zip, $zip_entry) == FALSE) continue;

                    if (zip_entry_name($zip_entry) != "word/document.xml") continue;

                    $content .= zip_entry_read($zip_entry, zip_entry_filesize($zip_entry));

                    zip_entry_close($zip_entry);
                }
                zip_close($zip);
                $content = str_replace('</w:r></w:p></w:tc><w:tc>', "<p>", $content);
                $content = str_replace('</w:r></w:p>', "</p>", $content);
                $striped_content = strip_tags($content);

                /*echo $striped_content . $content;return;
                return array(
                    "strip_content"=>$striped_content,
                    "content"=>$content);*/

                $this->content =  $this->SafeFilter($striped_content);
                return $this->FileCreate();
            } else {
                echo $fileExt . "类型文件不允许上传！";
            }
        }
    }

    //删除图片
    public function FileDelete(){
        if (@unlink ('../web/'.$this->url.'/'.$this->name)) {
            return true;
        } else {
            return false;
        }
    }

    //创建文本，一般用于内容较多的文章
    public function FileCreate(){
        $name = 'CS'.date('YmdHis', time()).rand(1000 , 9999).'.txt';
        $url = '../web/file/'.$name;
        //创建文件，并且给予它编辑的权限
        $url = fopen($url , "w");
        //内容写入文件
        fwrite($url , $this->content);
        if(fclose($url)){
            return $name;
        }
    }

    /**
     * XSS攻击通用过滤
     */
    public function SafeFilter ($data)
    {
        $data = trim($data);                                //清理空格
        //$data = strip_tags($data);                        //过滤html标签
        $data = htmlspecialchars($data,ENT_NOQUOTES);       //将字符内容转化为html实体
        //$data = addslashes($data);                        //给单引号（'）、双引号（"）、反斜线（\）与 NUL（NULL 字符）
        return $data;
    }

    //下载文件
//    public function FileDownLoad (){
//        if($this->name && file_exists("../web/file/".$this->name)){
//            $type = "url";
//        }else{
//            $type = "content";
//        }
//       // var_dump($type);die;
//        switch($type){
//            case "url":
//                //var_dump(456);die;
//                $filePath =  '../web/file/'.$this->name;                        //要下载的文件路径
//                $filename = $this->name;                                        //下载时的文件名
//                header('Content-Type:txt'); //指定下载文件类型
//                header('Content-Disposition: attachment; filename="'.$filename.'"'); //指定下载文件的描述
//                header('Content-Length:'.filesize($filename)); //指定下载文件的大小
//                readfile($filename); //读取文件并在浏览器中输出
//            break;
//            case "content":
//                /**
//                 *因为没有文件存在，所以我们分三步执行
//                 */
//                //一：先创建文件，并且把内容写入文件
//                $name = $this->FileCreate();
//                //二：下载文件
//                $filePath =  '../web/file/'.$name;
//                $filename = $name;
//                header("Content-type: txt/text/doc/docx");
//                header("Content-Disposition: attachment; filename=".$filename);
//                readfile($filePath);
//                //二：删除该文件
//                @unlink ('../web/file/'.$name);
//        }
//    }
}
