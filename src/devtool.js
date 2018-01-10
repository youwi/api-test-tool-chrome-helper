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
            }
        } catch (e) {
            chrome.devtools.inspectedWindow.eval('console.log("error")');

        }
    }

);

chrome.devtools.inspectedWindow.eval('console.log(' +JSON.stringify(chrome.devtools)+ ')');

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