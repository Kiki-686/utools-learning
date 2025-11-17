const fs = require("fs");
const {
    exec
} = require('child_process');
const os = require("os")
const {
    clipboard
} = require('electron')
window.clipboard = clipboard

getConfData = () => {
    try {
        return fs.readFileSync(conf_path, "utf-8");
    } catch (err) {
        return ""
    }

}

delConfData = () => {
    fs.unlink(conf_path, function (error) {
        if (error) {
            console.log(error);
        }
    })
}

saveConfData = (data, callback) => {
    fs.mkdir(app_path, function (error) {
        if (error) {
            console.log(error);
        }
    })

    fs.writeFile(conf_path, data, 'utf8', function (error) {
        if (error) {
            console.log(error)
        } else {
            callback();
        }
    })
}

readSearchFile = () => {
    let confData = getConfData();
    if (confData) {
        let jsonData = JSON.parse(confData);
        filePath = jsonData.file_path;
        // console.log("~~~", filePath)
        let data = fs.readFileSync(filePath, "utf-8");
        json_data = JSON.parse(data)
        let search_data = [];
        json_data.forEach(c => {
            search_data.push({
                name_id: c.name_id,
                uid: c.uid,
                file: c.file,
                sheet: c.sheet,
                cn: c.cn,
                gm: c.gm,
                comment: c.comment,
                pinyin_comment_full: c.pinyin_comment_full,
                pinyin_comment_short: c.pinyin_comment_short,
                pinyin_cn_full: c.pinyin_cn_full,
                pinyin_cn_short: c.pinyin_cn_short,
                detail: c.detail
            })
        })
        return search_data;

    }

}

checkSearchFilePath = (confData) => {
    let jsonData = JSON.parse(confData);
    // console.log("~~~~~",json_data)
    filePath = jsonData.file_path;
    // console.log("~~~~~~",filePath)
    if (!fs.existsSync(filePath)) {
        utools.showNotification('未找到搜索文件', clickFeatureCode = null, silent = false)
    } else {
        saveConfData(confData, function () {
            search_data = readSearchFile();
            utools.showNotification("保存成功", clickFeatureCode = null, silent = false)
        });
    }
}


floatMsg = (msg) => {
    layui.use('layer', function () {
        let layer = layui.layer;
        layer.msg(msg);

    });
}


// notice = (msg) =>{
//     layui.use('layer', function () {
//         let layer = layui.layer;
//         layer.open({
//             type: 1
//             ,offset: "rb" //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
//             ,id: 'layerDemo' //防止重复弹出
//             ,content: '<div style="padding: 20px 100px;">'+ msg +'</div>'
//             ,btn: '关闭'
//             ,btnAlign: 'c' //按钮居中
//             ,shade: 0 //不显示遮罩
//             ,yes: function(){
//               layer.closeAll();
//             }
//           });

//     });
// }






copyOrder = (order) => {
    if (order == '') {
        return
    }
    // exec('clip').stdin.end(order)
    window.clipboard.writeText(order)
    utools.showNotification('已复制:' + order, clickFeatureCode = null, silent = false)

    // layui.use('layer', function () {
    //     var layer = layui.layer;
    //     layer.msg('复制 {0}'.format(order));

    // });
    utools.hideMainWindow();

}

window.onerror = function (message, url, line, column, error) {
    utools.showNotification(message, clickFeatureCode = null, silent = false)
}


String.prototype.format = function () {
    var values = arguments;
    return this.replace(/\{(\d+)\}/g, function (match, index) {
        if (values.length > index) {
            return values[index];
        } else {
            return "";
        }
    });
};
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
  };