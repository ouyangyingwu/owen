<?php
namespace common\models;

class Dict
{

    //角色Character
    const CHARACTER_STUDENT = 1;
    const CHARACTER_TEACHER = 2;
    const CHARACTER_ADMIN = 3;

    public static $character = [
        self::CHARACTER_STUDENT => "学生",
        self::CHARACTER_TEACHER => "教职工",
        self::CHARACTER_ADMIN => "管理员",
    ];

    //性别
    const SEX_UNKNOWN = 0;
    const SEX_STUDENT = 1;
    const SEX_FEMALE = 2;
    const SEX_THIRD_SEX = 3;

    public static $sex = [
        self::SEX_UNKNOWN => "未填写",
        self::SEX_STUDENT => "男",
        self::SEX_FEMALE => "女",
        self::SEX_THIRD_SEX => "未知性别",
    ];

    //管理员权限
    const STUDENT = 1;
    const TEACHER = 2;
    const ADMIN_INFORMATION_VIEW = 3;
    const ADMIN_INFORMATION_MANAGEMENT = 4;
    const ADMIN = 10;

    public static $adminName = [
        self::ADMIN_INFORMATION_VIEW => "信息查看员",
        self::ADMIN_INFORMATION_MANAGEMENT => "信息管理员",
        self::ADMIN => "管理员",
    ];
    public static $adminPurview = [
        self::STUDENT => [],
        self::TEACHER => [],
        self::ADMIN_INFORMATION_VIEW => [],
        self::ADMIN_INFORMATION_MANAGEMENT => [],
        self::ADMIN => "all",
    ];

    //角色状态
    const ACTIVE_STATUS_FREEZE = 0;
    const ACTIVE_STATUS_ACTIVATION = 1;

    public static $active = [
        self::ACTIVE_STATUS_FREEZE => "冻结",
        self::ACTIVE_STATUS_ACTIVATION => "激活",
    ];


    //学生状态
    const STUDENT_STATUS_READING = 1;
    const STUDENT_STATUS_MASTER_GRADUATE_STUDENT = 2;
    const STUDENT_STATUS_PHD_GRADUATE_STUDENT = 3;
    const STUDENT_STATUS_MASTER_READING = 4;
    const STUDENT_STATUS_LEAVE_SCHOOL = 5;
    const STUDENT_STATUS_OTHER = 6;

    public static $studentStatus = [
        self::STUDENT_STATUS_READING => "在读",
        self::STUDENT_STATUS_MASTER_GRADUATE_STUDENT => "硕士研究生",
        self::STUDENT_STATUS_PHD_GRADUATE_STUDENT => "博士研究生",
        self::STUDENT_STATUS_MASTER_READING => "硕博连读",
        self::STUDENT_STATUS_LEAVE_SCHOOL => "休学",
        self::STUDENT_STATUS_OTHER => "其他",
    ];

}