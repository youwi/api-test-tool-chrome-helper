chrome.devtools.inspectedWindow.eval('FIT_LIST=[]');


chrome.devtools.network.onRequestFinished.addListener(
    function(request) {

        try {
            if (request.request.url.toString().indexOf("/api/") > -1) {

                chrome.devtools.inspectedWindow.eval('console.log(' +JSON.stringify(request) + ')');
                // //注意这是回调方法
                //
                // request.getContent((response)=>{
                //     chrome.devtools.inspectedWindow.eval('console.log(' +JSON.stringify(response) + ')');
                // });
                // //注意这是回调方法
                // chrome.devtools.network.getHAR((log)=>{
                //     chrome.devtools.inspectedWindow.eval('console.log(' +JSON.stringify(log) + ')');
                // })

                var tpl="";
                tpl+="| script | Connect Server| "+spUrl(request.request)+"|\\n"
                tpl+=fillBodyOrParam(request.request)
                tpl+="| "+request.request.method.toLowerCase()+"|\\n"
                tpl+="| check  | json Structure| code,msg,body | true  |\\n"
                tpl+="| check  | json Value    | msg            | OK    |\\n"

                chrome.devtools.inspectedWindow.eval('window.FIT_LIST=[];FIT_LIST.push("' +tpl + '")');
                chrome.devtools.inspectedWindow.eval('console.log(FIT_LIST)');
                chrome.devtools.inspectedWindow.eval('console.log("' +tpl + '")');

                chrome.extension.sendMessage(JSON.stringify(request.request))
                chrome.extension.sendMessage("XX");
                if(__PANEL_DOCUMENT__!=null){
                    __PANEL_DOCUMENT__.document.querySelector("#api_root").innerHTML = JSON.stringify(request.request);
                }

                chrome.runtime.sendMessage(chrome.devtools.inspectedWindow.tabId,tpl)

            }
        } catch (e) {
            chrome.devtools.inspectedWindow.eval('console.log("error")');

        }
    }

);
/**
 *  use global function to save info.
 *  代替 devpanel.js来处理dom元素.
 */

var __PANEL_DOCUMENT__=null
chrome.devtools.panels.create("API",
    null,
    "./src/devpanel.html",
    function(panel) {
        panel.onShown.addListener(function(win) {
            console.log('i think this is the right onshow');
            var status = win.document.querySelector("#api_root");
            status.innerHTML = "Fixing to make magic.";
            __PANEL_DOCUMENT__=win
        });
        // code invoked on panel creation
    }
);


/**
 * 分离URL,导致参数重复
 */
function spUrl(req) {
    if(req.method=="GET"){
        return req.url.split("?")[0]
    }
    return req.url
}
/**
 * 根据GET或POST生成模板
 * @param req
 * @return {*}
 */
function fillBodyOrParam(req){
    if(req.method=="POST"){
        return "| set Body| "+excp(req.postData.text)+" |\\n"
    }else if(req.method=="GET"){
        var out=""
        for(var item of req.queryString){
            out+="| set Param | " +item.name +" |   | "+item.value+"  |\\n"
        }
        return out
    }
}
/**
 * 转义引号为
 */
function excp(str){
   return  str.replace(/"/g,'\\"')
}