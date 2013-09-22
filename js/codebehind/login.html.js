initPage = function() {
	appendLog("页面初始化");
	// 测试经纬度
//	gm.ngi.weibo.app.getLocation(function(coords){
//		alert("经度：" + coords.longitude + " 续度：" + coords.latitude);
//	});
	var curShowDiv;//关闭键盘后显示的DIV
	var curTextCon;//指定的输入控件
	$("#customkeyboard").keyboard({
		clickCallback:function(){
			curShowDiv=undefined;
        	curTextCon=undefined;
        	var div1=$("#loginPag");
        	if(!div1.attr("style")||div1.attr("style").indexOf("display: none")==-1)
    		{
        		curShowDiv=div1;
        		curTextCon=$("#txt_content");
    		}
        	
        	if(curTextCon)
    		{
        		var text=curTextCon.val();
        		if(text&&$("#T1"))
    			{
        			$("#T1").val(text);
        			$("#T1").focus();
    			}
    		}
        	div1.hide();
		},
        doneCallback: function (d) {
        	if(curShowDiv)                	
        	{
            	curShowDiv.show();            	
        	}
            if(curTextCon)
        	{
            	curTextCon.val(d.target.input[0].value);
        	}
        },
        EmptyValueCallback: function () {
        	if(curShowDiv)                	
        	{
            	curShowDiv.show();            	
        	}
            if(curTextCon)
        	{
            	curTextCon.val("");
        	}
        },
        returnCallback: function () {
        	//用户点击键盘上"返回按钮"的回调函数
            if(curShowDiv)                	
        	{
            	curShowDiv.show();            	
        	}
            else
            {
            	curShowDiv=$("#loginPag");
            	curShowDiv.show();    
            }	
        }
    });
	/*
	keyboardInit({ 
        targetId: "#customkeyboard",//键盘DIV
        clickCallback:function(){//弹出键盘前的操作
        	curShowDiv=undefined;
        	curTextCon=undefined;
        	var div1=$("#loginPag");
        	if(!div1.attr("style")||div1.attr("style").indexOf("display: none")==-1)
    		{
        		curShowDiv=div1;
        		curTextCon=$("#txt_content");
    		}
        	
        	if(curTextCon)
    		{
        		var text=curTextCon.val();
        		if(text&&$("#T1"))
    			{
        			$("#T1").val(text);
        			$("#T1").focus();
    			}
    		}
        	div1.hide();
        },
        
        doneCallback: function (d) {//点击键盘确定键后的操作
            if(curShowDiv)                	
        	{
            	curShowDiv.show();            	
        	}
            if(curTextCon)
        	{
            	curTextCon.val(d.target.input[0].value);
        	}
        },
        EmptyValueCallback: function () {
            if(curShowDiv)                	
        	{
            	curShowDiv.show();            	
        	}
            if(curTextCon)
        	{
            	curTextCon.val(d.target.input[0].value);
        	}
        },
        returnCallback: function () {
            //用户点击键盘上"返回按钮"的回调函数
            if(curShowDiv)                	
        	{
            	curShowDiv.show();            	
        	}
            else
            {
            	curShowDiv=$("#loginPag");
            	curShowDiv.show();    
            }	
        }
    });
    */
	// 自动填充用户名和密码
	$(document).ready(function() {
		appendLog("document ready");
		if (gm.ngi.weibosdk.api.credential) {
			if (gm.ngi.weibosdk.api.credential.loginName) {
				$("#tbUid").val(gm.ngi.weibosdk.api.credential.loginName);
			}

			$("#tbPwd").val(gm.ngi.weibosdk.api.credential.password);
			appendLog("加载已登录用户");
		}
		appendLog("document ready ok");
		//$("#login").focus();
	});

	// 用户名提示
	$("#tbUid").blur(function() {
		curTextCon=$("#tbUid");
		if (this.value == "") {
			this.value = "邮箱/会员账号/手机号";
			this.style.color = '#C7C7C7';
		}
	});
	$("#tbPwd").blur(function() {
		curTextCon=$("#tbPwd");
	});
	$("#span_auto").click(function() {
		$("#setAutoLogin").click();
	});
	// 用户名提示
	$("#tbUid").click(function() {
		if (this.value == "邮箱/会员账号/手机号") {
			this.value = "";
		}
		this.style.color = '#000000';
	});
	var dl = {};
	gm.ngi.weibosdk.api.apiConnectionError = function(err) {
		dl && dl.setClickEnable(1);
		setStatusText("哎呀，你的网络好像有点问题，请重试！", dl);
		setTimeout(function() {
			dl.close();
		}, 3000);
		
	};
	gm.ngi.weibosdk.api.apiServerError = function(err) {
		dl && dl.setClickEnable(1);
		var error = "登录失败。错误代码：" + err.error_code;
		if (gm.ngi.weibosdk.ApiError[err.error_code]) {
			error = gm.ngi.weibosdk.ApiError[err.error_code];
		}
		setStatusText(error, dl);
		// gm.ngi.msgbox.show();
		setTimeout(function() {
			dl.close();
		}, 3000);
	};
	// 登录
	$("#login").click(function() {
		var uid = $unit.trim($("#tbUid").val()) || "";
		var pwd = $("#tbPwd").val() || "";
		var chk = $("#chkAuto").val() == 1;
		if (uid == "" || uid == "邮箱/会员账号/手机号") {

			toggleError($("#tbUid"));
			return;
		}
		if ($unit.trim(pwd) == "") {
			$("#tbPwd").val("");
			toggleError($("#tbPwd"));
			return;
		}
		appendLog("开始登录，调用login api");
		dl = gm.ngi.msgbox.showLoad("正在登录...");
		setStatusText("正在登录...", dl);
		gm.ngi.weibo.app.login(uid, pwd, chk, onLogin);
	});

	// 设置自动登录选项
	$("#setAutoLogin").click(function() {
		var auto = $("#chkAuto").val();
		if (auto == 1) {
			$("#chkAuto").val(0);
			this.className = "LoginNo";
		} else {
			$("#chkAuto").val(1);
			this.className = "LoginYes";
		}
	});
};

function setStatusText(s, d) {
	$("#statusbar").text(s);
	if (d) {
		d.setContent(s);
	}
}
function toggleError(d) {

	setTimeout(function() {
		d.css({
			backgroundColor : "#fdd"
		});
	}, 250);
	setTimeout(function() {
		d.css({
			backgroundColor : "#fff"
		});
	}, 500);
	setTimeout(function() {
		d.css({
			backgroundColor : "#fdd"
		});
	}, 750);
	setTimeout(function() {
		d.css({
			backgroundColor : "#fff"
		});
	}, 1000);
}
// 登录后事件
function onLogin(result, error) {
	appendLog("login api调用完成，开始结果分析");
	if (result) {
		appendLog("调用成功，同步资料");
		setStatusText("登录已完成，正在同步个人资料...");
		// 刷新用户信息
		appendLog("同步用户信息");
		gm.ngi.weibo.app.refreshCurrentUser(onRefreshCurrentUser);
		// 刷新用户的好友分组
		appendLog("同步好友分组");
		gm.ngi.weibo.app.refreshFriendGroups(onRefreshFriendGroups);
	} else {
		appendLog("调用失败 "+JSON.stringify(error));
		setStatusText(JSON.stringify(error));
	}
}

var userDone = false;
function onRefreshCurrentUser(hr) {
	userDone = true;
	checkJobDone();
}

var groupsDone = false;
function onRefreshFriendGroups(hr) {
	groupsDone = true;
	checkJobDone();
}

function checkJobDone() {
	if (userDone && groupsDone) {
		setStatusText("同步已完成，正在返回首页...");
		gm.ngi.weibo.app.navigateToCarChannelPage();
	}
};