<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/5/25
 * Time: 15:23
 */
?>
<div id="sideNav" href=""><i class="icon-caret-right"></i></div>
<div class="sidebar-collapse">
    <?php if(isset($list) && $list): ?>
    <ul class="nav" id="main-menu">
        <?php foreach ($list as $menu): ?>
            <li>
            <a href="javascript:void(0)" class=""><i class="<?= $menu['icon']?>"></i> <?= $menu['name']?>
                <?php if(isset($menu['children']) && $menu['children']): ?> <span class="icon-angle-right arrow"></span><?php endif; ?>
            </a>
            <?php if(isset($menu['children']) && $menu['children']): ?>
                <ul class="nav nav-second-level b-color hidee">
                <?php foreach ($menu['children'] as $children): ?>
                    <li>
                        <a href="<?= $children['url'] ?>" class="location-file"><i class="icon-cogs"></i> <?= $children['name']?> </a>
                    </li>
                <?php endforeach; ?>
                </ul>
            <?php endif; ?>
            </li>
        <?php endforeach; ?>
    </ul>
    <?php endif; ?>
</div>