<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>文件上传下载</title>
</head>

<body>
<form action="upload_deal.php" method="post" name="myform" enctype="multipart/form-data">
	请选择您要上传的文件：
    <input type="hidden" name="MAX_FILE_SIZE" value="<?=10*1024*1024?>" />
    <input type="file" name="filepath" /><br/>
    <input type="submit" value="立即上传" />
</form>
</body>
</html>