<?php

/* @var $this yii\web\View */

$this->title = 'Owen Home';
?>
<script type="text/javascript">
    //console.log(location.href , location.href.indexOf('html'));
    if(location.href.indexOf('html') < 0){
        location.href = "/#/dashboard_toDoList.html";
    }
</script>
