// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


const tab_log = function(json_args) {
    var args = JSON.parse(unescape(json_args));
    console[args[0]].apply(console, Array.prototype.slice.call(args, 1));
}

chrome.devtools.network.onRequestFinished.addListener(
    function(request) {
        chrome.devtools.inspectedWindow.eval(
            'console.log("Large image: " + unescape("' +
            escape(request.request.url) + '"))');
        console.log("---")
    }
);