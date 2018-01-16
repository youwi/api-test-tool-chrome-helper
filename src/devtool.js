chrome.devtools.inspectedWindow.eval('FIT_LIST=[]');


chrome.devtools.network.onRequestFinished.addListener(
    function(request) {

        try {
            if (request.request.url.toString().indexOf("/api/") > -1) {

                //chrome.devtools.inspectedWindow.eval('console.log(' +JSON.stringify(request) + ')');
                if( isInBlackList(request.request.url)){
                    return;
                }

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



                //chrome.devtools.inspectedWindow.eval('window.FIT_LIST=[];FIT_LIST.push("' +tpl + '")');
                //chrome.devtools.inspectedWindow.eval('console.log(FIT_LIST)');
                //chrome.devtools.inspectedWindow.eval('console.log("' +tpl + '")');


                appendToApiPanel(request.request)
            }
        } catch (e) {
            chrome.devtools.inspectedWindow.eval('console.error(' +JSON.stringify(e) + ')');
        }
    }

);

if (!('toJSON' in Error.prototype)){
    Object.defineProperty(Error.prototype, 'toJSON', {
        value: function () {
            var alt = {};

            Object.getOwnPropertyNames(this).forEach(function (key) {
                alt[key] = this[key];
            }, this);

            return alt;
        },
        configurable: true,
        writable: true
    });
}

function buildFitScript(request) {
    var tpl="";
    tpl+="| script | Connect Server| "+spUrl(request)+"|\n"
    tpl+=fillBodyOrParamNotExt(request)
    tpl+="| "+request.method.toLowerCase()+"|\n"
    tpl+="| check  | json Structure| code,msg,body | true  |\n"
    tpl+="| check  | json Value    | msg            | OK    |\n"
    return tpl;
}
function buildPythonScript(request) {
    let  snippet = new HTTPSnippet(request)
    return snippet.convert('python')
}
/**
 *  use global function to save info.
 *  代替 devpanel.js来处理dom元素.
 */
var PANEL_SESSION={
    document:null,
    requests:[],
    currentType:1,
    filterBlackList:["api/v1/spans"]
}
var type_list=["..","Fitnesse","Python3","Python3/request","JavaScript","node.js","node.js/request"]

chrome.devtools.panels.create("API",
    null,
    "./src/devpanel.html",
    function(panel) {
        panel.onShown.addListener(function(win) {
            PANEL_SESSION.document=win.document
            PANEL_SESSION.document.querySelector('#typeFitnesse').addEventListener('click', eventA, false);
            PANEL_SESSION.document.querySelector('#typePython').addEventListener('click', eventB, false);
            PANEL_SESSION.document.querySelector('#clearSession').addEventListener('click', eventC, false);
            initSession()
        });
    }
);
function eventA() {
    PANEL_SESSION.currentType=1;
    PANEL_SESSION.document.querySelector("#api_type").innerHTML=type_list[PANEL_SESSION.currentType];
    initSession()
}
function eventB() {
    PANEL_SESSION.currentType=2;
    PANEL_SESSION.document.querySelector("#api_type").innerHTML=type_list[PANEL_SESSION.currentType];
    initSession()
}
function eventC() {
    clearSession()
}

function isInBlackList(url) {
    let out=false
    PANEL_SESSION.filterBlackList.map((str)=>{
        if(url.indexOf(str)>-1){
            out=true
        }
    })
    return out
}

function clearSession() {
    PANEL_SESSION.requests=[]
    initSession();
}
function initSession() {
    let elements = PANEL_SESSION.document.getElementsByTagName('pre')
    while (elements[0]) elements[0].parentNode.removeChild(elements[0])
    PANEL_SESSION.requests.map(t=>pureAdd(t))
    PANEL_SESSION.document.querySelector("#api_count").innerHTML=PANEL_SESSION.requests.length;
    PANEL_SESSION.document.querySelector("#api_type").innerHTML=type_list[PANEL_SESSION.currentType];
}
function pureAdd(obj) {
    if(isInBlackList(obj.url)) return
    if(PANEL_SESSION.document!=null){
        let intext=null
        if(PANEL_SESSION.currentType==1){
            intext=buildFitScript(obj)
        }else if(PANEL_SESSION.currentType==2){
            intext=buildPythonScript(obj)
        }else if(PANEL_SESSION.currentType==0){
            intext=JSON.stringify(obj)
        }
        let root= PANEL_SESSION.document.querySelector("#api_root");
        let p = PANEL_SESSION.document.createElement("pre");
        p.innerHTML=intext
        root.append(p);
        PANEL_SESSION.document.querySelector("#api_count").innerHTML=PANEL_SESSION.requests.length;
        PANEL_SESSION.document.querySelector("#api_type").innerHTML=type_list[PANEL_SESSION.currentType];
    }
}

function appendToApiPanel(obj) {
    PANEL_SESSION.requests.push(obj)
    pureAdd(obj)
}

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
        if(req.postData.text!=null &&req.postData.text.length>60 ){
            return "| set Body| {{{ \\n"+excp(JSON.stringify(JSON.parse(req.postData.text),0,4))+"\\n }}}|\\n"
        }
        return "| set Body| "+excp(req.postData.text)+" |\\n"
    }else if(req.method=="GET"){
        var out=""
        for(var item of req.queryString){
            out+="| set Param | " +item.name +" |   | "+item.value+"  |\\n"
        }
        return out
    }
}
function fillBodyOrParamNotExt(req){
    if(req.method=="POST"){
        if(req.postData.text!=null &&req.postData.text.length>60 ){
            return "| set Body| {{{ \n"+JSON.stringify(JSON.parse(req.postData.text),0,4)+" \n }}}|\n"
        }
        return "| set Body| "+req.postData.text+" |\n"
    }else if(req.method=="GET"){
        var out=""
        for(var item of req.queryString){
            out+="| set Param | " +item.name +" |   | "+item.value+"  |\n"
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