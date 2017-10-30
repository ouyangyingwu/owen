<?php
	header('Content-type:text/html;charset=utf-8;');
	
	$filename = "file.txt";
	
	//1打开文件
	$file_handle = fopen($filename,'w');
	//2写入文件
	for($i=1;$i<1000;$i++){
		fwrite($file_handle,"I love you!\n");
	}
	//3关闭文件
	fclose($file_handle);
	//4
?>