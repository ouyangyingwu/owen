<?php

/* @var $this yii\web\View */

$this->title = 'Owen Home';
?>
<script type="text/javascript">
    //console.log(location.href.split('#/')[1].split('.')[1]);
    if(location.href.split('#/')[1].split('.')[1] != 'html'){
        location.href = "/#/dashboard_toDoList.html";
    }
</script>
