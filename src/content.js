/**
 * Created by yu on 2017/7/21.
 */

//console.log(document.getElementsByClassName("path-li"))


var HAS_UPDATED=false
var base_ip="http://172.16.52.181:9090/"
var jq=`<script src="http://code.jquery.com/jquery-1.12.4.min.js"     integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ="     crossorigin="anonymous"></script>`
var sc=`<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>`
var jqtheme=`<link rel="stylesheet" type="text/css" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"/>`
var mo=`<form>
             <label for="name">FitNesse Server IP</label><br/>
            <input type="text" name="ip" id="ip" value="http://172.16.52.181:9090/" class="text ui-widget-content ui-corner-all" style="width: 400px;"><br/>
            <label for="email">Path</label><span id="helpText"></span><br/>
            <input type="text" name="path" id="path" value="LieLuoBo" class="text ui-widget-content ui-corner-all"><br/>
            <label for="content">Content</label><br/>
            <textarea  name="content" id="content" class="text ui-widget-content ui-corner-all"   style="width: 500px;  height: 150px;"  >
!define url (\${base_url}/bi/cw/detail/interviews)
!contents -R2 -g -p -f -h
            </textarea>
            <br/>
    
            <!-- Allow form submission with keyboard without duplicating the dialog button -->
            <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
         </form>`

var waiter=setInterval(()=>{
    if(window.location.href.indexOf("yoda")===-1){
        clearInterval(waiter);
        return
    }
    if(window.location.href==="http://yoda:9001/server/"){
        clearInterval(waiter);
        return
    }
    console.log("umock plugin running")

    var paths=$(".path-li");
    if($.isEmptyObject(paths))
        return
    if(HAS_UPDATED)
        return




    $(".project-title").append("<div id='dialog-form'>"+mo+"</div>")
    $(".project-title").append(jq)
    $(".project-title").append(sc)
    $(".project-title").append(jqtheme)

    showFitnesseCreateDialog()

    $(".path-li .path-head .middle-right").append("<span class='h-tag _sp-button' >...</span>")
    $(".path-li .path-head .middle-right").append("<span class='h-tag _fit-button' >+></span>")

    $(".path-li .path-head").map((i,dom)=>{
        var method=$(dom).find(".path-method").text()
        var url=$(dom).find(".path-name").text()

        //添加转义文字
       // $(dom).find(".path-name").after(" <span class='path-description'>"+toUpWord(url)+"</span>")

        $(dom).find("._sp-button").text(getTempText(method+":"+url));

        $(dom).find("._sp-button").on("click",(e)=>{
            e.stopPropagation();
            toggleTempMark(method+":"+url,$(dom).find("._sp-button"))
        })
        $(dom).find("._fit-button").on("click",(e)=>{
            e.stopPropagation();
            if(localStorage.ip)     $("#ip").val(localStorage.ip)
            //if(localStorage.path)     $("#path").val(localStorage.path)
            //if(localStorage.content)     $("#content").val(localStorage.content)
            $("#content").val(`!define url (\${base_url}${url})\n!contents -R2 -g -p -f -h`)
            $("#path").val(toUpWord(url))
            $("#helpText").text(url+"  "+$(dom).find(".path-description").text())
            FIT_NESSE_DIALOG.dialog("open")
        })
    })

    $("#ip").on("change",(v)=>localStorage.ip=v.target.value)
    $("#path").on("change",(v)=>localStorage.path=v.target.value)
    $("#content").on("change",(v)=>localStorage.content=v.target.value)

    var style="    margin-left: 14px;  color: white;  background: #61affe;"


    $(".project-title").append("<span class='h-tag _sp-export-button ' style='"+style+"'>导出进度表</span>");
    $(".project-title").append("<span class='h-tag _sp-export-content' ></span>");

    $("._sp-export-button").on("click",exportProgress)
    HAS_UPDATED=true
    clearInterval(waiter);
},1000)

var FIT_NESSE_DIALOG
var showFitnesseCreateDialog=()=>{
    FIT_NESSE_DIALOG=$("#dialog-form").dialog({
        autoOpen: false,
        height: 500,
        width: 600,
        modal: true,
        buttons: {
            "Create A Suite":fitnesseAddChild,
            Cancel: function() {
                FIT_NESSE_DIALOG.dialog( "close" );
            }
        },
        close: function() {
        }
    });
}

var fitnesseAddChild=()=>{
    $.get($("#ip").val()+"?addChild",{
            pageName:$("#path").val(),
            pageType:"Suite",
            helpText:$("#helpText").text(),
            pageContent:$("#content").val()
    },()=>{
            FIT_NESSE_DIALOG.dialog("close")
    })
}
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

setInterval(()=>{jsonExporter()},1000)
var jsonExporter=()=>{
    $(".param-ref") //对象

    $(".param-object-container").one("dblclick",(event)=>{
        var outjson={}
        var outString="{\n<br/>"
        $(event.currentTarget).find(".param-container").map((i,kki)=>{
            var key=$(kki).find(".param-name").text()
            var type=$(kki).find(".param-type").text()
            var desc=$(kki).find(".param-description").text();
            outString+="  &nbsp&nbsp"+key+""+typeTo(type)+",  //"+desc+"\n<br/>"
        })
        outString+="\n}"
        console.log(outString)
        $("._sp-bb").remove()
        $(event.currentTarget).append("<code class='_sp-bb'>"+outString+"</code>")
    }) //对象体
}

var typeTo=(str)=>{
    if(str=="integer")
        return 0
    if(str=="date")
        return "\"2017-01-01T12:00:00+08:00\""
    if(str=="string")
        return "\"\""
    if(str=="number")
        return 0.0
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

/**
 *  /bi/api ==>BiApi
 */
var toUpWord=(str)=>{
    var arr=str.split("/")
    for(var i=0;i<arr.length;i++){
        var tmp=arr[i]
         arr[i]= tmp.substring(0,1).toUpperCase()+tmp.substring(1,tmp.length);
    }
    return arr.join("")
}

//console.log(toUpWord("/bi/cw/detail/entering"))

function syncRemote() {

    var remoteIP="http://172.16.52.181:8101/umockapi";
    try{
        fetch(remoteIP)
            .then(response => response.json())
            .then((json) => {Object.assign(localStorage,json)})
    }catch(e){
        console.log(e)
    }

}