'use strict';

angular.module('ngTicket').constant('localeZh', {
    FORMTIPS: {
        saveSuccess: "保存成功",
        operateSuccess:"操作成功",
        operateError:"操作失败",
        modifySuccess: "修改成功",
        checkedSuccess: "验证成功",
        saveError: "保存失败",
        modifyError: "修改失败",
        exception: "网络异常 请重试",
        confirmRemove: "确定删除 ?",
        confirmAllremove: "确定删除选定 ?",
        removeSuccess: "删除成功",
        removeError: "删除失败",
        uplodMax: "最多一次上传{0}张",
        uplodSizeMax: "请上传小于{0}MB的文件",
        uplodError: "上传失败，请重新上传。",
        dataError: "获取数据失败 请稍后重试",
        messageError: "验证码发送失败 请稍后重试",
        acceptSuccess: "认领成功",
        acceptError: "认领失败",
        releaseSuccess: "发布成功",
        releaseError: "发布失败",
        isdelayed:"延迟状态修改成功",
        rollbackSuccess: "回滚成功",
        rollbackError: "回滚失败"
    },
    ORDERS: {
        deliverySuccess: "发货成功",
        deliveryError: "发货失败",
        closeSuccess: "关闭成功"
    },
    GOODS: {
        upShelvesOk: "上架成功",
        upShelvesNo: "上架失败",
        downShelvesOk: "下架架成功",
        downShelvesNo: "下架失败"
    },
    USER: {
        addSuccess: "添加成功",
        addError: "添加失败",
        sendMsSuccess:"发送成功",
        sendMsFailed:"发送失败"
    },
    DATETIME: {
        second: '秒',
        minute: '分',
        hour: '时',
        day: '天',
        month: '月',
        year: '年',
        fullD: 'yyyy年MM月dd日 HH:mm',
        shortD: 'MM-dd HH:mm',
        dayAgo: '天前',
        hourAgo: '小时前',
        minuteAgo: '分钟前',
        secondAgo: '刚刚'
    }

});
