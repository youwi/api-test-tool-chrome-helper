

chrome.devtools.network.onRequestFinished.addListener(
    function(request) {
             chrome.devtools.inspectedWindow.eval(
                'console.log("Large image: " + unescape("' +
                escape(request.request.url) + '"))');
             console.log("---")
    }
);