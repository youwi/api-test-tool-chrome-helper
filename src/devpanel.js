


(function createChannel() {
    //Create a port with background page for continous message communication
    var port = chrome.extension.connect({
        name: "API" //Given a Name
    });

    // Listen to messages from the background page
    port.onMessage.addListener(function (message) {
        document.querySelector('#api_root').innerHTML = message.content;
    });

}());
function sendObjectToInspectedPage(message) {
    message.tabId = chrome.devtools.inspectedWindow.tabId;
    chrome.extension.sendMessage(message);
}

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



