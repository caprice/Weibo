/*
* JavaScript file
*/

// 应用程序的根名称，必须与项目名称相同
var appID = "38366755";
var appRootName = "Weibo";
// 应用程序的根路径
var appRootUrl = "";
// 当前页面的文件名，如“default.html”
var pageName = "";
var pageParams = {};

var defaultJspPanelId = null;

// 库文件
var libs = [
            "GMLIB/io.js",
            "GMLIB/system.js",
            "GMLIB/voice.js",
            "GMLIB/ui.js",
            "GMLIB/info.js",
            "lib/jquery-1.7.1.js",
            "lib/mustache.js"
            ];

// 代码文件

var appCodes = [
                "js/xui-2.3.2.js",
                "js/chn_py_word_lib.js",
                "js/keyboard.js",
				"lib/ngi.gm.common.js",
				"lib/weibo.ngi.gm.sdk.js",
				"js/core.js",
				"js/weibo.ngi.gm.app.js",
				"js/controller/mygroup.js",
				"js/controller/head.js",
				"js/controller/left.js",
				"js/controller/basecontrol.js",
				"js/controller/friendstatus.js",
				"js/controller/mentionstatus.js",
				"js/controller/receivedcomment.js",
				"js/controller/commentlist.js",
			    "js/weibo.ngi.gm.tts.js",
			    "js/sprintf.js",
			    "js/GetBinaryFile.js",
	            "lib/jquery.mousewheel.js",
	            "lib/jquery.jscrollpane.min.js"
	];

/*
 * 初始化，页面应将body.onload指向此处
 */
function init() {

	parseAppInfo();

	var codeBehind = "js/codebehind/" + pageName + ".js";
	appCodes.push(codeBehind);

	batchLoad(libs, function() {
		sequenceLoad(appCodes, loaded);
	});

}

/*
 * 初始化完成后的回调 总是调用每个页面的initPage()方法。
 */
function loaded() {
	
	attachAppTray();
	
	LogStep("page init");
	
//	window.onerror = function(sMsg,sUrl,sLine){
//		var text = "error thrown: " 
//			+ sMsg + "\r\n"
//			+ sUrl + "(" + sLine + ")";
//			
//		LogStep(text);
//		alert("error occured, close the app and pack the data folder to developer.");
//	};

	if (typeof bypassCredentialCheck == "undefined" || !bypassCredentialCheck) {
		if (!gm.ngi.weibo.app.validateCredential()) {
			gm.ngi.weibo.app.navigateToLoginPage();
			return;
		}
	}

	if (typeof bypassMonitor == "undefined" || !bypassMonitor) {
		gm.ngi.weibo.app.addMonitor();
	}
	
	$(document).ready(function() {
		log("page ready");
		initPage();
		initJsp();
		var mTopBox = $("#topBox");
		if (mTopBox && mTopBox[0]) {
			var tmpClose = $("<div class=\"closeButton2\"></div>");
			tmpClose.appendTo(mTopBox);
			tmpClose.bind("click", function() {
				buttonFeedback(this);
				gm.ngi.msgbox.confirm("您确定关闭新浪天气通吗？",function(){
					gm.appmanager.closeApp();
					});
			});
		}
	});
}

/*
 * 解析应用程序信息：appRootName, pageName
 */
function parseAppInfo() {
	var href = window.location.href;
	var token = "/" + appRootName + "/";
	if (window.location.protocol == "file:"){
		token = "/" + appID + "/";
	}
	var index = href.indexOf(token) + token.length;
	appRootUrl = href.substr(0, index);

	var segments = window.location.pathname.split("/");
	pageName = segments.pop();

	parseQueryString();
}

function parseQueryString() {

    var e,
    a = /\+/g,  // Regex for replacing addition symbol with a space  
    r = /([^&=]+)=?([^&]*)/g,
    d = function(s) { return decodeURIComponent(s.replace(a, " ")); },
    q = window.location.search.substring(1);


	while (e = r.exec(q))
		pageParams[d(e[1])] = d(e[2]);

}

/*
 * 批量加载脚本文件
 */
function batchLoad(scripts, callback) {

	var count = 0;
	var length = scripts.length;

	for (index in scripts) {
		var js = document.createElement("script");
		js.type = "text/javascript";
		js.charset = "UTF-8";
		js.onload = function() {
			count++;
			if (count == length) {
				if (callback) {
					callback();
				}
			}
		};
		js.src = appRootUrl + scripts[index];
		document.getElementsByTagName("head")[0].appendChild(js);
	}
}

/*
 * 顺序加载脚本文件
 */
function sequenceLoad(scripts, callback) {

	var path = scripts.shift();
	if (!path) {
		if (callback) {
			callback();
		}
		return;
	}

	var js = document.createElement("script");
	js.type = "text/javascript";
	js.charset = "UTF-8";
	js.onload = function() {
		sequenceLoad(scripts, callback);
	};
	js.src = appRootUrl + path;
	document.getElementsByTagName("head")[0].appendChild(js);
}

var $Debug = true;
var $Logs = new Array();

function log(text) {
	if (!$Debug) {
		return;
	}
	var item = {
		id : $Logs.length + 1,
		text : text,
		time : (new Date()).getTime(),
		elapsed : 0
	};
	var last = $Logs.length == 0 ? null : $Logs[$Logs.length - 1];
	if (last) {
		item.elapsed = item.time - last.time;
	} else {
		console.log("------------------" + window.location
				+ "------------------");
	}
	$Logs.push(item);
	console.log(window.location.pathname + "(" + item.id + "): " + item.text
			+ " (time: " + item.time + ", elapsed: " + item.elapsed + "ms)");
}

/* jspPane */

function initJsp(id){
	if (!id){
		if (!defaultJspPanelId){
			return;
		}
		else{
			id = defaultJspPanelId;
		}
	}

	var target = $("#" + id);
	target.jScrollPane({
		'showArrows': true,
		'maintainPosition': true,
		verticalDragMinHeight:50,
		verticalDragMaxHeight:100
	});
}

function reInitJsp(id){
	if (!id){
		if (!defaultJspPanelId){
			return;
		}
		else{
			id = defaultJspPanelId;
		}
	}
	
	var target = $("#" + id);
	var api = target.data("jsp")
	if (api){
		api.reinitialise();	
	}
}
function buttonFeedback(htmlElem, downOpacity){
	if (!downOpacity){
		downOpacity = 0.3;
	}
	
	var downStyle = {marginLeft:"+=2px", marginTop:"+=2px", width:"-=2px", opacity:downOpacity};
	var upStyle = {marginLeft:"-=2px", marginTop:"-=2px", width:"+=2px", opacity:"1.0"};
	
	$(htmlElem).animate(downStyle, "normal", "linear").animate(upStyle, "slow", "linear");
}
/*
 * 挂接顶层application tray的onclick事件，使之点击后消失
 * 在splash页面中调用
 */
function attachAppTray(){
	if (!$Debug) {
		return;
	}
	var topFrame = window.parent.window;
	var appTray = topFrame.document.getElementById("app_window_top_row");
	if (appTray && !appTray.onclick){
		appTray.onclick = function(){
			this.style.visibility = "hidden";
		};
	}
}

// TODO: 删除
function LogStep(s){
	
	var path = "logFile.txt";
	
	var text = "";
	if (pageName != "splash.html"){
		text = gm.io.readFile(path);
		if (typeof(text) == "number"){
			text = "";
		}		
	}
 	
	var date = new Date();
	var line = "==================\r\n" 
		+ pageName + " -- " 
		+ date.toGMTString() + "\r\n" 
		+ s + "\r\n";
	text = text + line;
	
	gm.io.writeFile(path, text);
}


