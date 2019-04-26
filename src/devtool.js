var PANEL_SESSION = {
  document: null,
  requests: [],
  domList: [],
  currentLang: "table",
  filterBlackList: ["api/v1/spans"],
  filterWhiteList: ["/api/"],
}

function domContent() {
  return PANEL_SESSION.document.querySelector("#content")
}

function domFormatFitnesseV2() {
  return PANEL_SESSION.document.querySelector('#typeFitnesseV2')
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
        panel.onShown.addListener(panelOnShown);
      }
    );

  }
}

function panelOnShown(win) {
  PANEL_SESSION.document = win.document;
  domFormatFitnesseV2().addEventListener('click', reformatToTable, false);
  domFormatPythonMini().addEventListener('click', reformatToPython, false);
  domClear().addEventListener('click', clearAll, false);
  domSelectFormatType().addEventListener('change', reformatBySelect, false);
  domInputApiMatch().addEventListener('input', _.debounce(apiMatchChanged, 20), false);
  PANEL_SESSION.filterWhiteList[0] = localStorage.filterWhiteList || "/api"
  domInputApiMatch().value = PANEL_SESSION.filterWhiteList.join(",")
  domSelectFormatType().innerHTML = getSelectOptions()
  initSession()
}


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

function getSelectOptions() {
  let options = HTTPSnippet.availableTargets()
  let out = []
  out.push(`<option value='table'>table</option>`);
  out.push(`<option value='python/simple'>python/simple</option>`);
  options.map(item => {
    item.clients.map(client => {
      out.push(` <option value="${item.key}/${client.key}">${item.key}/${client.key}</option>`)
    })
  })

  return out
}


function buildLangScript(request) {
  try {
    let snippet = new HTTPSnippet(request)
    return snippet.convert(PANEL_SESSION.currentLang, PANEL_SESSION.currentType)
  } catch (e) {
    console.error(e)
  }
}


function setSelectType(type) {
  domSelectFormatType().value = type
}

function reformatToTable() {
  PANEL_SESSION.currentLang="table"
  PANEL_SESSION.currentType=""
  setSelectType("table");
  initSession()
}

function reformatToPython() {
  PANEL_SESSION.currentLang="python"
  PANEL_SESSION.currentType="simple"
  setSelectType("python/simple");
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
      console.error(e)
    }
  }
  initSession()
}

function apiMatchChanged(v) {
  if (v && v.target) {
    localStorage.filterWhiteList = v.target.value
    PANEL_SESSION.filterWhiteList[0] = v.target.value
    initSession()
  } else {
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

/**
 * 如果大于50个接口,就自动清理一半,防止内存过大.
 */
function limitSession() {
  if(PANEL_SESSION.requests.length>50) {
    PANEL_SESSION.requests.splice(0, 25)
    initSession();
  }
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
}

/**
 * 替换url
 */
function findBaseUrl(){
  PANEL_SESSION.requests
}

/**
 * build text then append to root.
 * @param obj
 */
function buildCodeDom(obj) {
  if (isInBlackList(obj.url)) return
  if ((PANEL_SESSION.document != null) && isInWhiteList(obj.url)) {
    let outScriptText = null
    if (PANEL_SESSION.currentLang === "table") {
      outScriptText = buildFitTableScript(obj)
    } else {
      outScriptText = buildLangScript(obj)
    }
    let pre = PANEL_SESSION.document.createElement("pre");
    let code = PANEL_SESSION.document.createElement("code");


    code.className = "javascript";
    code.innerHTML = outScriptText;
    pre.append(code)
    pre.obj = obj
    return pre
  }
}

function buildButton(dom) {
  let syncButton = PANEL_SESSION.document.createElement("button");
  syncButton.onclick = () => {
    console.log("....")
  }
  syncButton.innerText = "+";
  syncButton.className = "sync-button";
  return syncButton
}

function appendAllToContent(domList) {
  if (domList.length) {
    domList.map(p => {
      domContent().append(buildButton(p))
      domContent().append(PANEL_SESSION.document.createElement("br"))
      domContent().append(p)
    })
  }
  domApiCount().innerHTML = PANEL_SESSION.requests.length;
}

/**
 * daynic append to Content
 */
function appendToApiPanel(obj) {
  limitSession();
  PANEL_SESSION.requests.push(obj);
  domApiCount().innerHTML = PANEL_SESSION.requests.length;
  domContent().append(buildButton(obj));
  domContent().append(PANEL_SESSION.document.createElement("br"))
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
      return "| Body | {{{ " + expchar + excp(JSON.stringify(JSON.parse(req.postData.text), 0, 4), expchar) + expchar + " }}}|" + expchar
    } else if (req.postData) {
      return "| Body | " + excp(req.postData.text) + " |" + expchar
    } else {
      return "| Body| {} |" + expchar
    }
  } else if (req.method.toLocaleLowerCase() === "get") {
    let out = ""
    for (let item of req.queryString) {
      out += "| Param | " + item.name + " | " + item.value + " |" + expchar
    }
    return out
  }
}


function buildFitTableScript(request) {
  var tpl = "";
  tpl += "| " + request.method.toUpperCase() + " | " + spUrl(request) + "|\n"
  tpl += fillBodyOrParamNotExt(request).replace("| set Body |", "| Body |")
  tpl += buildFitScriptResponse(request).replace("| check  | text Contain |", "| check text |")
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


window.panelOnShown = panelOnShown
initWithChrome(chrome)
