/*
 * JavaScript file
 */

function init()
{
	window.onerror = function(sMsg,sUrl,sLine){
		var text = "error: " 
			+ sMsg + "\r\n"
			+ sUrl + "(" + sLine + ")";
		log(text);
	};
	
	$("#save").click(function(){
		gm.io.writeFile("jsload.log", $("#output").text());
	});
	
	$("#start").click(function(){
		clearLogs();
		$("#start").hide();
		log("start test: " + window.location.href)
		log("=====================================");
		
		log("protocol: " + window.location.protocol);
		log("host: " + window.location.host);
		log("pathname: " + window.location.pathname);
		
		log("===> parseAppInfo ...");
		parseAppInfo();
		log("succeeded.");
		
		log("===> parseAppInfo ...");
		parseQueryString();
		log("succeeded.");
		
		var codeBehind = "js/codebehind/" + pageName + ".js";
		appCodes.push(codeBehind);

		log("===> batch load scripts ...");
		batchLoad(libs, function() {
			log("===> sequence load scripts ...");
			sequenceLoad(appCodes, loaded);
		});
	});
}

function loaded() {
	log("=====================================");
	log("all scripts loaded.");
}

function log(line){
	var text = $("#output").text();
	text = text + line+ "\r\n" ;
	$("#output").text(text);
}

function clearLogs(){
	$("#output").text("");
}


var appRootName = "Weibo";
var appID = "37071197";

//应用程序的根路径
var appRootUrl = "";
//当前页面的文件名，如“default.html”
var pageName = "";
var pageParams = {};

//库文件
var libs = [
            "GMLIB/voice.js",
            "GMLIB/ui.js",
            "GMLIB/info.js",
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
	];

function parseAppInfo() {
	var href = window.location.href;
	var token =  "/" + appRootName + "/";
	if (window.location.protocol == "file:"){
		token = "/" + appID + "/";
	}
	var index = href.indexOf(token) + token.length;
	appRootUrl = href.substr(0, index);

	var segments = window.location.pathname.split("/");
	pageName = segments.pop();

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
		log("   " + js.src);
		document.getElementsByTagName("head")[0].appendChild(js);
	}
}

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
	log("   " + js.src);
	document.getElementsByTagName("head")[0].appendChild(js);
}
