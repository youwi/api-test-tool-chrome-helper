var PANEL_SESSION = {
  document: null,
  requests: [],
  domList: [],
  currentType: 1,
  filterBlackList: ["api/v1/spans"],
  filterWhiteList: ["/api/"],
}

function domRoot() {
  return PANEL_SESSION.document.querySelector("#api_root")
}

function domContent() {
  return PANEL_SESSION.document.querySelector("#content")
}

function domFormatFitnesse() {
  return PANEL_SESSION.document.querySelector('#typeFitnesse')
}

function domFormatPythonMini() {
  return PANEL_SESSION.document.querySelector('#typePython')
}

function domSelectFormatType() {
  return PANEL_SESSION.document.querySelector('#selectType')
}

function domInputApiMatch() {
  return PANEL_SESSION.document.querySelector('#api_match')
}

function domApiType() {
  return PANEL_SESSION.document.querySelector("#api_type")
}

function domClear() {
  return PANEL_SESSION.document.querySelector('#clearSession')
}

function domApiCount() {
  return PANEL_SESSION.document.querySelector("#api_count")
}

function initWithChrome(browser) {
  if (browser && browser.devtools && browser.devtools.inspectedWindow) {
    browser.devtools.inspectedWindow.eval('FIT_LIST=[]');
    browser.devtools.network.onRequestFinished.addListener(
      function (request) {

        try {
          //if (request.request.url.toString().indexOf("/api/") > -1) {
          if (isInWhiteList(request.request.url)) {

            //chrome.devtools.inspectedWindow.eval('console.log(' +JSON.stringify(request) + ')');
            if (isInBlackList(request.request.url)) {
              return;
            }
            request.getContent((response) => {
              request.request.response = response
            });

            setTimeout(() => {
              appendToApiPanel(request.request)
            }, 50)
          }
        } catch (e) {
          browser.devtools.inspectedWindow.eval('console.error(' + JSON.stringify(e) + ')');
        }
      }
    );

    browser.devtools.panels.create("API",
      null,
      "../html/devpanel.html",
      function (panel) {
        panel.onShown.addListener(function (win) {
          PANEL_SESSION.document = win.document
          domFormatFitnesse().addEventListener('click', reformatToFitnesse, false);
          domFormatPythonMini().addEventListener('click', reformatToPython, false);
          domClear().addEventListener('click', clearAll, false);
          domSelectFormatType().addEventListener('change', reformatBySelect, false);
          domInputApiMatch().addEventListener('input', _.debounce(apiMatchChanged, 20), false);
          PANEL_SESSION.filterWhiteList[0] = localStorage.filterWhiteList || "/api"
          domInputApiMatch().value = PANEL_SESSION.filterWhiteList.join(",")
          domSelectFormatType().innerHTML = getSelectOptions()
          initSession()
        });
      }
    );

  }
}

initWithChrome(chrome)


if (!('toJSON' in Error.prototype)) {
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
  var tpl = "";
  tpl += "| script | Connect Server| " + spUrl(request) + "|\n"
  tpl += fillBodyOrParamNotExt(request)
  tpl += "| " + request.method.toLowerCase() + "|\n"
  tpl += "| check  | json Structure| code,msg,body | true  |\n"
  tpl += "| check  | json Value    | msg            | OK    |\n"
  tpl += buildFitScriptResponse(request)
  return tpl;
}

function buildFitScriptResponse(request) {
  if (request.response) {
    if (request.response.constructor == String) {
      return "| check  | text Contain | " + request.response + "| true | \n"
    } else {
      return "| check  | text Contain | " + JSON.stringify(request.response, 0, 4) + "| true | \n"
    }
  } else {
    return ""
  }

}

function getSelectOptions() {
  let options = HTTPSnippet.availableTargets()
  let out = []
  options.map(item => {
    item.clients.map(client => {
      out.push(` <option value="${item.key}/${client.key}">${item.key}/${client.key}</option>`)
    })
  })
  return out
}

function buildPythonScript(request) {
  //return snippet.convert('python',"requestMini")
  try {
    let snippet = new HTTPSnippet(request)
    return snippet.convert('python', "simple")
  } catch (e) {
    return e
  }
}

function buildLangScript(request) {
  try {
    let snippet = new HTTPSnippet(request)
    return snippet.convert(PANEL_SESSION.currentLang, PANEL_SESSION.currentType)
  } catch (e) {
    return e
  }
}


/**
 *  use global function to save info.
 *  代替 devpanel.js来处理dom元素.
 */

var type_list = ["..", "Fitnesse", "Python3", "Python3/request", "JavaScript", "node.js", "node.js/request"]

function reformatToFitnesse() {
  PANEL_SESSION.currentType = 1;
  domApiType().innerHTML = type_list[PANEL_SESSION.currentType];
  initSession()
}

function reformatToPython() {
  PANEL_SESSION.currentType = 2;
  domApiType().innerHTML = type_list[PANEL_SESSION.currentType];
  initSession()
}

function clearAll() {
  clearSession()
}

function reformatBySelect(v) {
  if (v.target) {

    try {
      PANEL_SESSION.currentType = v.target.value.split("/")[1]
      PANEL_SESSION.currentLang = v.target.value.split("/")[0]
    } catch (e) {
      return e
    }
  }
  initSession()
}

function apiMatchChanged(v) {
  domApiType().innerHTML = "apiMatchChanged init";
  if (v && v.target) {
    localStorage.filterWhiteList = v.target.value
    PANEL_SESSION.filterWhiteList[0] = v.target.value
    initSession()
  } else {
    domApiType().innerHTML = "apiMatchChanged Error";
    console.error("not get v apiMatchChanged")
  }
}

function isInBlackList(url) {
  let out = false
  PANEL_SESSION.filterBlackList.map((str) => {
    if (url.indexOf(str) > -1) {
      out = true
    }
  })
  return out
}

function isInWhiteList(url) {
  let out = false
  PANEL_SESSION.filterWhiteList.map((str) => {
    if (url.indexOf(str) > -1) {
      out = true
    }
  })
  return out
}

function clearSession() {
  PANEL_SESSION.requests = []
  initSession();
}

function clearDom() {
  let dom = domContent()
  while (dom.firstChild) {
    dom.removeChild(dom.firstChild);
  }
}

/**
 *  show All
 */
function initSession() {
  clearDom()
  let domList = PANEL_SESSION.requests.map(t => buildCodeDom(t));
  appendAllToContent(domList)

  domApiCount().innerHTML = PANEL_SESSION.requests.length;
  domApiType().innerHTML = type_list[PANEL_SESSION.currentType];
}

/**
 * build text then append to root.
 * @param obj
 */
function buildCodeDom(obj) {
  if (isInBlackList(obj.url)) return
  if ((PANEL_SESSION.document != null) && isInWhiteList(obj.url)) {
    let outScriptText = null
    if (PANEL_SESSION.currentType === 1) {
      outScriptText = buildFitScript(obj)
    } else if (PANEL_SESSION.currentType === 2) {
      outScriptText = buildPythonScript(obj)
    } else {
      outScriptText = buildLangScript(obj)
    }

    let pre = PANEL_SESSION.document.createElement("pre");
    let code = PANEL_SESSION.document.createElement("code");
    code.className = "javascript";
    code.innerHTML = outScriptText;
    pre.append(code)
    return pre
  }
}

function appendAllToContent(domList) {
  // <pre><code>...</code>
  let root = domContent();
  if (domList.length) {
    domList.map(p => root.append(p))
  }
  domApiCount().innerHTML = PANEL_SESSION.requests.length;
  domApiType().innerHTML = type_list[PANEL_SESSION.currentType];
}

/**
 * daynic append to Content
 */
function appendToApiPanel(obj) {
  PANEL_SESSION.requests.push(obj);
  domApiCount().innerHTML = PANEL_SESSION.requests.length;
  domContent().append(buildCodeDom(obj))
}

/**
 * 分离URL,导致参数重复
 */
function spUrl(req) {
  if (req.method.toLocaleLowerCase() === "get") {
    return req.url.split("?")[0]
  }
  return req.url
}

/**
 * 根据GET或POST生成模板
 * @param req
 * @return {*}
 */
var CHAR_EXP = "\\n"

function fillBodyOrParam(req, expchar) {
  if (expchar == null)
    expchar = CHAR_EXP;
  if (req.method.toLocaleLowerCase() === "post") {
    if (req.postData && req.postData.text != null && req.postData.text.length > 60) {
      return "| set Body| {{{ " + expchar + excp(JSON.stringify(JSON.parse(req.postData.text), 0, 4), expchar) + expchar + " }}}|" + expchar
    } else if (req.postData) {
      return "| set Body| " + excp(req.postData.text) + " |" + expchar
    } else {
      return "| set Body| {} |" + expchar
    }
  } else if (req.method.toLocaleLowerCase() === "get") {
    let out = ""
    for (let item of req.queryString) {
      out += "| set Param | " + item.name + " |   | " + item.value + "  |" + expchar
    }
    return out
  }
}

function fillBodyOrParamNotExt(req) {
  return fillBodyOrParam(req, "\n")
}

/**
 * 转义引号
 */
function excp(str, expchar) {
  if (expchar == "\\n")
    return str.replace(/"/g, '\\"')
  else
    return str
}