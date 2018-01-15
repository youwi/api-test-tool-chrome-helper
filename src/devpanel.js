console.log("ss")


var listBody=document.getElementsByTagName("body")
var body=listBody[0]



chrome.runtime.onMessage.addListener(function callback(message, sender, sendResponse){


    body.append(message)
})


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        sendResponse({farewell: "goodbye"});
        body.append(message)
    });