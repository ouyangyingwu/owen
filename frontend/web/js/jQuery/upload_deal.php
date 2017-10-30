<?php
	header('Content-type:text/html;charset=utf-8;');
	
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
		var_dump($_FILES);die;
		$fileExt = $file_arr[count($file_arr)-1];				//获取后缀名

		//判断文件上传的后缀名是否为允许的类型
		$alowExt = "txt,doc,jpg,png,gif,";
		if(strstr($alowExt,$fileExt)){
			//设置名字
			$fileNewName = "ZNDXTDXY15DS".date("YmdHis").mt_rand(10000,99999).".".$fileExt;
			if(is_uploaded_file($_FILES["filepath"]["tmp_name"])){  //判断文件是否通过HTTP POST方式上传的
				if(@move_uploaded_file($_FILES["filepath"]["tmp_name"],"./image/upload/".$fileNewName)){	//保存到指定文件夹
					echo "文件上传成功！存在: " . "image/upload/" . $fileNewName;
				} else {
					echo "文移动传成功！";
				}
			}
		} else {
			echo $fileExt."类型文件不允许上传！";
		}		
	}
?>