var PANEL_SESSION={
    document:null,
    requests:[],
    currentType:1,
    filterBlackList:["api/v1/spans"],
    filterWhiteList:["/api/"],
}

chrome.devtools.inspectedWindow.eval('FIT_LIST=[]');


chrome.devtools.network.onRequestFinished.addListener(
    function(request) {

        try {
            //if (request.request.url.toString().indexOf("/api/") > -1) {
            if(isInWhiteList(request.request.url)){

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
                 request.getContent((response)=>{
                    request.request.response=response
                 });

                //chrome.devtools.inspectedWindow.eval('window.FIT_LIST=[];FIT_LIST.push("' +tpl + '")');
                //chrome.devtools.inspectedWindow.eval('console.log(FIT_LIST)');
                //chrome.devtools.inspectedWindow.eval('console.log("' +tpl + '")');

                setTimeout(()=>{
                    appendToApiPanel(request.request)
                },50)
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
    tpl+=buildFitScriptResponse(request)
    return tpl;
}
function buildFitScriptResponse(request) {
    if(request.response){
        if(request.response.constructor==String){
            return "| check  | text Contain | "+request.response+"| true | \n"
        }else {
            return "| check  | text Contain | "+JSON.stringify(request.response,0,4)  +"| true | \n"
        }
    }else{
        return ""
    }

}
function buildPythonScript(request) {
    let  snippet = new HTTPSnippet(request)
    return snippet.convert('python',"requestMini")
}
/**
 *  use global function to save info.
 *  代替 devpanel.js来处理dom元素.
 */

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
            PANEL_SESSION.document.querySelector('#selectType').addEventListener('select', eventD, false);
            PANEL_SESSION.document.querySelector('#api_match').innerHTML=PANEL_SESSION.filterWhiteList.join(",")

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
function eventD(v) {
    console.log(v)
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
function isInWhiteList(url) {
    let out=false
    PANEL_SESSION.filterWhiteList.map((str)=>{
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
    if(req.method.toLocaleLowerCase()==="get"){
        return req.url.split("?")[0]
    }
    return req.url
}
/**
 * 根据GET或POST生成模板
 * @param req
 * @return {*}
 */
var CHAR_EXP="\\n"

function fillBodyOrParam(req,expchar){
    if(expchar==null)
        expchar=CHAR_EXP;
    if(req.method.toLocaleLowerCase()==="post"){
        if(req.postData && req.postData.text!=null &&req.postData.text.length>60 ){
            return "| set Body| {{{ "+expchar+excp(JSON.stringify(JSON.parse(req.postData.text),0,4),expchar)+expchar+" }}}|"+expchar
        }else if(req.postData ){
            return "| set Body| "+excp(req.postData.text)+" |"+expchar
        }else{
            return "| set Body| {} |"+expchar
        }
    }else if(req.method.toLocaleLowerCase()==="get"){
        let out=""
        for(let item of req.queryString){
            out+="| set Param | " +item.name +" |   | "+item.value+"  |"+expchar
        }
        return out
    }
}
function fillBodyOrParamNotExt(req){
   return  fillBodyOrParam(req,"\n")
}
/**
 * 转义引号
 */
function excp(str,expchar){
    if(expchar=="\\n")
        return  str.replace(/"/g,'\\"')
    else
        return  str
}