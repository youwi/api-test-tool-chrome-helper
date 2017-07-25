/**
 * Created by yu on 2017/7/21.
 */

console.log(document.getElementsByClassName("path-li"))


var HAS_UPDATED=false

var waiter=setInterval(()=>{
    console.log("running")

    var paths=$(".path-li");
    if($.isEmptyObject(paths))
        return
    if(HAS_UPDATED)
        return

    $(".path-li .path-head .middle-right").append("<span class='h-tag _sp-button' >...</span>")
    $(".path-li .path-head").map((i,dom)=>{
        var method=$(dom).find(".path-method").text()
        var url=$(dom).find(".path-name").text()

        $(dom).find("._sp-button").text(getTempText(method+":"+url));

        $(dom).find("._sp-button").on("click",(e)=>{
            e.stopPropagation();
            toggleTempMark(method+":"+url,$(dom).find("._sp-button"))
        })
    })
    var style="    margin-left: 14px;  color: white;  background: #61affe;"


    $(".project-title").append("<span class='h-tag _sp-export-button ' style='"+style+"'>导出进度表</span>");
    $(".project-title").append("<span class='h-tag _sp-export-content' ></span>");

    $("._sp-export-button").on("click",exportProgress)

    HAS_UPDATED=true
    clearInterval(waiter);
},1000)

var exportProgressState=false;
var exportProgress=()=>{
    var out={}
    var outList=[]
    var outTable=""
    if(exportProgressState){
        if($("._sp-export-content").text()==""){

        }else{
            $("._sp-export-content").text("")
            return
        }
    }

    $(".path-li .path-head").map((i,dom)=>{
        var method=$(dom).find(".path-method").text()
        var url=$(dom).find(".path-name").text()

        out[url+"    \t\t"+method]=  getTempText(method+":"+url)
        outList.push({url,method,state:getTempText(method+":"+url)})
    })
    console.log(out)
    outTable="<table>"+outList.map((item)=>{
       return  "<tr>"
           +"<td>"+item.url+"</td>"
           +"<td>"+item.method+"</td>"
           +"<td>"+item.state+"</td>"
           + "</tr>"
    }).join(" ")+"</table>"
    $("._sp-export-content").append(outTable)
    exportProgressState=true
}

//0 ¼ ½ ¾ 1
// 对应 1,2,3,4,
var toggleTempMark=(pathName,dom)=>{

    if(localStorage[pathName]=="1"){
        localStorage[pathName]=2
        $(dom).text("½")
    }else if(localStorage[pathName]=="2"){
        localStorage[pathName]=3
        $(dom).text("¾")
    }else if(localStorage[pathName]=="3"){
        localStorage[pathName]=4
        $(dom).text("OK")
    }else if(localStorage[pathName]=="4"){
        localStorage[pathName]=1
        $(dom).text("0")
    }else{
        localStorage[pathName]=1
        $(dom).text("0")
    }
}
var getTempText=(pathName)=>{
    if(localStorage[pathName]=="1"){
        return "0"
    }else if(localStorage[pathName]=="2"){
        return "½"
    }else if(localStorage[pathName]=="3"){
        return  "¾"
    }else if(localStorage[pathName]=="4"){
        return "OK"
    }
}