<?php
	$filePath = "./ziliao/banner.jpg";
	$filename = "广告.jpg";
	header("Content-type:image/jpeg");
	header("Content-Length:".filesize($filePath));
	header("Content-Disposition:attachment;filename=".$filename);
	readfile($filePath);
?>