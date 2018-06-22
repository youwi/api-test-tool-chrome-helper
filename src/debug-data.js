window.PANEL_SESSION = {
  "document": window.document,
  "requests": [{
    "method": "POST",
    "url": "http://hr.lieluobo.testing/api/biz/hr/order/list",
    "httpVersion": "HTTP/1.1",
    "headers": [{
      "name": "Cookie",
      "value": "_channel=cw; bms_token=b94797b1c3c14269b1f221c8643f75f4; bi_token=afb7189d8a8646a893156240b8f74021; _token=cb51b2adaeb44e25914922b287370a48; _role=llbhr"
    }, {"name": "Origin", "value": "http://hr.lieluobo.testing"}, {"name": "Accept-Encoding", "value": "gzip, deflate"}, {"name": "X-B3-TraceId", "value": "9247fae02107ec3e"}, {
      "name": "Accept-Language",
      "value": "zh-CN,zh;q=0.9"
    }, {"name": "authorization", "value": "cb51b2adaeb44e25914922b287370a48"}, {"name": "X-B3-ParentSpanId", "value": "9247fae02107ec3e"}, {
      "name": "X-Requested-With",
      "value": "XMLHttpRequest"
    }, {"name": "Connection", "value": "keep-alive"}, {"name": "channel", "value": "hr"}, {"name": "Content-Length", "value": "223"}, {"name": "Pragma", "value": "no-cache"}, {
      "name": "Host",
      "value": "hr.lieluobo.testing"
    }, {"name": "author", "value": "llbhr"}, {
      "name": "User-Agent",
      "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36"
    }, {"name": "Content-Type", "value": "application/json;charset=UTF-8"}, {"name": "Accept", "value": "application/json, text/javascript, */*; q=0.01"}, {
      "name": "Cache-Control",
      "value": "no-cache"
    }, {"name": "X-B3-SpanId", "value": "89e98e99efcce752"}, {"name": "X-B3-Sampled", "value": "1"}],
    "queryString": [],
    "cookies": [{"name": "_channel", "value": "cw", "expires": null, "httpOnly": false, "secure": false}, {
      "name": "bms_token",
      "value": "b94797b1c3c14269b1f221c8643f75f4",
      "expires": null,
      "httpOnly": false,
      "secure": false
    }, {"name": "bi_token", "value": "afb7189d8a8646a893156240b8f74021", "expires": null, "httpOnly": false, "secure": false}, {
      "name": "_token",
      "value": "cb51b2adaeb44e25914922b287370a48",
      "expires": null,
      "httpOnly": false,
      "secure": false
    }, {"name": "_role", "value": "llbhr", "expires": null, "httpOnly": false, "secure": false}],
    "headersSize": 880,
    "bodySize": 0,
    "postData": {
      "mimeType": "application/json;charset=UTF-8",
      "text": "{\"page\":1,\"size\":10,\"keyword\":\"\",\"hideCancel\":true,\"orderFilter\":\"0\",\"positionId\":null,\"degree\":[],\"seniority\":{},\"dateRange\":null,\"sort\":\"hrReceiveAt:desc\",\"auditRate\":null,\"labels\":[],\"shareStatus\":[1,2],\"status\":[51,53]}"
    },
    "response": "{\"code\":1,\"msg\":\"OK\",\"body\":[],\"meta\":{\"pagination\":{\"page\":1,\"size\":10,\"total\":0,\"totalPages\":1}}}"
  }, {
    "method": "POST",
    "url": "http://hr.lieluobo.testing/api/biz/hr/order/stats",
    "httpVersion": "HTTP/1.1",
    "headers": [{
      "name": "Cookie",
      "value": "_channel=cw; bms_token=b94797b1c3c14269b1f221c8643f75f4; bi_token=afb7189d8a8646a893156240b8f74021; _token=cb51b2adaeb44e25914922b287370a48; _role=llbhr"
    }, {"name": "Origin", "value": "http://hr.lieluobo.testing"}, {"name": "Accept-Encoding", "value": "gzip, deflate"}, {"name": "X-B3-TraceId", "value": "9247fae02107ec3e"}, {
      "name": "Accept-Language",
      "value": "zh-CN,zh;q=0.9"
    }, {"name": "authorization", "value": "cb51b2adaeb44e25914922b287370a48"}, {"name": "X-B3-ParentSpanId", "value": "9247fae02107ec3e"}, {
      "name": "X-Requested-With",
      "value": "XMLHttpRequest"
    }, {"name": "Connection", "value": "keep-alive"}, {"name": "channel", "value": "hr"}, {"name": "Content-Length", "value": "223"}, {"name": "Pragma", "value": "no-cache"}, {
      "name": "Host",
      "value": "hr.lieluobo.testing"
    }, {"name": "author", "value": "llbhr"}, {
      "name": "User-Agent",
      "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36"
    }, {"name": "Content-Type", "value": "application/json;charset=UTF-8"}, {"name": "Accept", "value": "application/json, text/javascript, */*; q=0.01"}, {
      "name": "Cache-Control",
      "value": "no-cache"
    }, {"name": "X-B3-SpanId", "value": "98afcefdaa1c771e"}, {"name": "X-B3-Sampled", "value": "1"}],
    "queryString": [],
    "cookies": [{"name": "_channel", "value": "cw", "expires": null, "httpOnly": false, "secure": false}, {
      "name": "bms_token",
      "value": "b94797b1c3c14269b1f221c8643f75f4",
      "expires": null,
      "httpOnly": false,
      "secure": false
    }, {"name": "bi_token", "value": "afb7189d8a8646a893156240b8f74021", "expires": null, "httpOnly": false, "secure": false}, {
      "name": "_token",
      "value": "cb51b2adaeb44e25914922b287370a48",
      "expires": null,
      "httpOnly": false,
      "secure": false
    }, {"name": "_role", "value": "llbhr", "expires": null, "httpOnly": false, "secure": false}],
    "headersSize": 881,
    "bodySize": 0,
    "postData": {
      "mimeType": "application/json;charset=UTF-8",
      "text": "{\"page\":1,\"size\":10,\"keyword\":\"\",\"hideCancel\":true,\"orderFilter\":\"0\",\"positionId\":null,\"degree\":[],\"seniority\":{},\"dateRange\":null,\"sort\":\"hrReceiveAt:desc\",\"auditRate\":null,\"labels\":[],\"shareStatus\":[1,2],\"status\":[51,53]}"
    },
    "response": "{\"code\":1,\"msg\":\"OK\",\"body\":{}}"
  }],
  "domList": [],
  "currentType": 1,
  "filterBlackList": ["api/v1/spans"],
  "filterWhiteList": ["/api/"]
}