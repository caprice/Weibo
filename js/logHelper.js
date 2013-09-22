window.onerror = function(msg, url, line) {
	appendLog("ERROR: " + msg + "\n" + url + ":" + line);
	return true;
}

function checkTime(i)
{
    if (i<10) 
    {i="0" + i}
    return i
}
function appendLog(text){
	var today=new Date();
    var y=today.getFullYear();
    var M=today.getMonth();
    var d=today.getDay();
    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
    M=checkTime(M);
    d=checkTime(d);
    m=checkTime(m);
    s=checkTime(s);
    var str=y+"-"+M+"-"+d+" "+h+":"+m+":"+s;
    
	var content = readFile("loginLog.txt");
	content = content + "\r\n======\r\n" + str+"  "+text;
	saveFile("loginLog.txt", content);
}

function saveFile(path, content){
	content = escape(content);
	var result = gm.io.writeFile(path, content);
	return result;
}

function readFile(path){
	var result = gm.io.readFile(path);
	if (typeof(result) == "number"){
		result = null;
	}else{
		result = unescape(result);
	}
	return result;
}