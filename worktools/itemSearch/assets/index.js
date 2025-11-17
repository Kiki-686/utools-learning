let text = ''
let json_data = ""
let li_key = 0
let input_text = ""
let conf_path;
let app_path;
let filePath = "";
let search_data;
let searchResult;
let finalResult;
var li_html = "";
var index = 0;
let hide_result = false;
let detail_history = [];

utools.onPluginEnter(({
    code,
    type,
    payload
}) => {
    console.log({
        code,
        type,
        payload
    });
    app_path = utools.getPath('userData') + '/searchItem';
    conf_path = app_path + '/config.conf';
    console.log(conf_path);

    search_data = window.readSearchFile();
    // console.log(search_data)
    if (!search_data) {
        window.floatMsg("未读取到搜索内容，检查配置")
    }

    if (code == 'searchItem') {
        $(".setting").hide();

        utools.setSubInput(({
            text
        }) => {
            searchItem(text);
        }, "请输入需要查询的关键词");
        searchItem(text);
    }
});

genLiHtml = (result) => {
    for (let i of result) {
        if (i.detail) {
            li_html = li_html +
                "<li>" +
                "<div class='li-favicon'><img src='assets/order.png'\"></div>" +
                "<div class='li-content'><div class='li-name'>" + '<font color="#F77E07">{0}</font> {1} {2} <font color="#F77E07">{3}</font>'.format(i.uid, i.cn, i.name_id, i.gm) +
                "</div><div class='li-order' index='{0}' uid='{1}'>".format(index, i.uid) + "描述：{0} {1}_{2} {3}".format(i.comment, i.file, i.sheet,JSON.stringify(i.detail).substring(0, 150)) + "</div></div>" +
                "</li>";

        } else {
            li_html = li_html +
                "<li>" +
                "<div class='li-favicon'><img src='assets/order.png'\"></div>" +
                "<div class='li-content'><div class='li-name'>" + '<font color="#F77E07">{0}</font> {1} {2} <font color="#F77E07">{3}</font>'.format(i.uid, i.cn, i.name_id, i.gm) +
                "</div><div class='li-order' index='{0}'>".format(index) + "描述：{0} {1}_{2}".format(i.comment, i.file, i.sheet) + "</div></div>" +
                "</li>";
        }
        index += 1
    }
}

showDetailPage = (uid) => {

    for (const i of detail_history) {
        if (i['buttonName'] === uid) {
            let historyHtml = (`
            <div> 
            <fieldset class="layui-elem-field site-demo-button" style="margin-top: 0px;">
            <legend style="font-size:16px" >历史</legend>
            <div>                
            `)
            for (let i of detail_history) {
                historyHtml = historyHtml + '<button type="button" class="layui-btn layui-btn-primary" onclick="showDetailPage(\'{0}\')">{1}</button>'.format(i['buttonName'], i['buttonName'])
            }
            historyHtml += (`
                </div>
                </fieldset>
                </div >  
            `)
            $("#data").html(historyHtml + i['html']);
            break
        }

    }


}
$(document).keydown(e => {
    switch (e.keyCode) {
        case 40: // 向下箭头
            event.preventDefault();
            if ($('.selected').children('.li-content').children(".li-order").attr("index") == "99" && hide_result) {
                hide_result = false
                finalResult = searchResult.slice(100, searchResult.length)
                genLiHtml(finalResult)
                $(".content ul").html(li_html);
            }
            max_key = $(".content ul li").length - 1;
            li_key = li_key + 1;
            if (li_key > max_key) {
                li_key = 0;
                $(document).scrollTop(0);
            } else {
                $(document).scrollTop($(document).scrollTop() + 0)
            }
            selectLi();
            break;
        case 38: // 向上箭头
            event.preventDefault();
            if ($('.selected').children('.li-content').children(".li-order").attr("index") == "99" && hide_result) {
                hide_result = false
                finalResult = searchResult.slice(100, searchResult.length)
                genLiHtml(finalResult)
                $(".content ul").html(li_html);
            }
            max_key = $(".content ul li").length - 1;
            li_key = li_key - 1;
            if (li_key < 0) {
                li_key = max_key;
                $(document).scrollTop($(document).height());
            } else {
                $(document).scrollTop($(document).scrollTop() - 0)
            }
            selectLi();
            break;
        case 39: //右箭头打开界面

            console.log(detail_history)
            let detailMsg = $('.selected').children('.li-content').children(".li-order").text();
            console.log(detailMsg)
            if (searchResult[$('.selected').children('.li-content').children(".li-order").attr("index")]['detail']) {

                detailData = searchResult[$('.selected').children('.li-content').children(".li-order").attr("index")]['detail']
                let uid = $('.selected').children('.li-content').children(".li-order").attr("uid")

                detailHtml = (`     
         
                <div class="layui-form">
                    <table class="layui-table">
                        <colgroup>
                        <col>
                        <col>
                        <col>
                        <col>
                        </colgroup>
                        <tbody>                
                `)
                for (let i of detailData) {
                    detailHtml = detailHtml +
                        "<tr>" +
                        '<td style="word-break : break-all;min-width: 80px">' + i[0] + "</td>" +
                        '<td style="min-width: 80px">' + i[1] + "</td>" +
                        '<td style="word-break : break-all">' + i[2] + "</td>" +
                        "</tr>"
                }
                detailHtml = detailHtml + "</tbody></table></div>"

                // 保存详情页信息
                detail_history.insert(0, {
                    "buttonName": uid,
                    "html": detailHtml
                })
                if (detail_history.length >= 8) {
                    detail_history = detail_history.slice(0, 8)
                }

                let historyHtml = (`
                <div> 
                <fieldset class="layui-elem-field site-demo-button" style="margin-top: 0px;">
                <legend style="font-size:16px" >历史</legend>
                <div>                
                `)
                for (let i of detail_history) {
                    historyHtml = historyHtml + '<button type="button" class="layui-btn layui-btn-primary" onclick="showDetailPage(\'{0}\')">{1}</button>'.format(i['buttonName'], i['buttonName'])
                }

                historyHtml += (`
                    </div>
                    </fieldset>
                    </div >  
                `)

                $("#data").html(historyHtml + detailHtml)
                $(".detail").show();
                $(".content").hide();
                utools.subInputBlur();




            }
            break;
        case 37: // 左箭头
            $(".detail").hide();
            $(".content").show();
            utools.subInputFocus();
            break;
        case 13: // 回车
            if (e.ctrlKey && e.which == 13) { // ctrl + enter
                window.copyOrder(searchResult[$('.selected').children('.li-content').children(".li-order").attr("index")]['gm']);
            } else {
                window.copyOrder(searchResult[$('.selected').children('.li-content').children(".li-order").attr("index")]['uid']);
                break;
            }
    }
});

function selectLi() {
    $(".content ul li").removeClass("selected")
    $(".content ul li:eq(" + li_key + ")").addClass("selected")

    selected_bottom_window = $(document).scrollTop() + $(window).height() - $(".selected").offset().top;
    if (selected_bottom_window < $(".selected").height()) {
        $(document).scrollTop($(".selected").offset().top - $(window).height() + $(".selected").height())
    }
    //已选项距离窗口距离
    selected_top_window = $(".selected").offset().top - $(document).scrollTop();
    if (selected_top_window < 0) {
        $(document).scrollTop($(".selected").offset().top)
    }
}

//判断文件、搜索、返回匹配数据、添加匹配结果到li_html
function searchItem(searchWord) {
    $(".detail").hide();
    $(".content").show();
    let keyWord;
    let excelName;
    let words = searchWord.replace(/(^\s*)/g, "").split(" ")
    if (words.length == 1) {
        keyWord = words[0]
    } else {
        excelName = words[0]
        keyWord = words[1]
    }

    searchResult = search_data;
    if (excelName) {
        searchResult = searchResult.filter(x => (
            x.file.toLowerCase().includes(excelName.toLowerCase())
        ))

    }
    if (keyWord !== "") {
        searchResult = searchResult.filter(x => (
            x.uid.includes(keyWord) ||
            x.cn.includes(keyWord) ||
            x.comment.includes(keyWord) ||
            x.pinyin_cn_full.includes(keyWord) ||
            x.pinyin_cn_short.includes(keyWord) ||
            x.pinyin_comment_short.includes(keyWord) ||
            x.pinyin_comment_full.includes(keyWord)
        ))
    }
    // console.log(searchResult)

    if (searchResult.length > 100) {
        finalResult = searchResult.slice(0, 100)
        hide_result = true
    } else {
        finalResult = searchResult
    }
    li_html = ""
    index = 0
    genLiHtml(finalResult)
    utools.setExpendHeight(544);

    $(".content ul").html(li_html);
    //绑定点击事件
    $('.content ul li').unbind('click');
    $('.content ul li').on("click", function () {
        li_key = Number($(this).children('.li-content').children(".li-order").attr("index"));
        // window.copyOrder(order)
        selectLi();
    });

    // li_key = 0;
    if (searchResult.length !== 0) {
        selectLi();
    }
}

function saveConfig() {
    let text_data = $('.setting textarea').val();
    console.log("~~~~", text_data)
    if (text_data == null || text_data == "") {
        window.delConfData();
        utools.showNotification("已删除配置内容，请重新配置搜素文件路径", clickFeatureCode = null, silent = false);
        return;
    }
    window.checkSearchFilePath(text_data);
}

function showConfigPage() {
    $(".content").hide();
    let text_data = window.getConfData();

    $(".setting textarea").val(text_data);
    $(".setting").show();

}

function backContent() {
    $(".setting").hide();
    $(".content").show();
    searchItem("")
}


function closeDetail() {
    $(".detail").hide();
    $(".content").show();
    utools.subInputFocus();
}