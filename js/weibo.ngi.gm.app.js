$unit.ns("gm.ngi.weibo.DataStorage");
/*
* 微博应用的本地数据存储
* GM使用GM文件系统做为存储介质
* 路径为approot/data/storage
*/
gm.ngi.weibo.DataStorage = function() {

    this.storage = new gm.ngi.FileStorage();

    // 数据存储键
    this.storageKeys = {

    	ApiSetting: "ngi.weibo.apisetting",		// 微博应用的AppId, AppSecret, TraceCode
    	Emotions: "ngi.weibo.emotions", 		// 表情字典
        Credential: "ngi.weibo.credential",		// 用户凭据
        UserOptions: "ngi.weibo.useroptions",	// 用户选项
        CurrentUser: "ngi.weibo.currentuser",	// 当前用户
        FriendGroups: "ngi.weibo.friendgroups",	// 当前用户-好友分组
        HomeStatuses: "ngi.weibo.homestatuses",	// 当前用户-最新微博，仅缓存最后一次下载的第一页
        MyStatuses: "ngi.weibo.mystatuses", 	// 当前用户-我的微博，仅缓存最后一次下载的第一页
        MyComments: "ngi.weibo.mycomments", 	// 当前用户-对我的评论，仅缓存最后一次下载的第一页
        MyMentions: "ngi.weibo.mymetions", 	// 当前用户-@我的微博，仅缓存最后一次下载的第一页
        MyNear: "ngi.weibo.mynear", 	// 当前用户-@我的微博，仅缓存最后一次下载的第一页
        CommentList: "ngi.weibo.commentlist", 	// 评论列表
        FriendstatusTemplate: "ngi.weibo.template.friendstatus",  //模板配置，好友微博。
        MentionstatusTemplate: "ngi.weibo.template.mentionstatus",  //模板配置，@我 微博。
        NearstatusTemplate: "ngi.weibo.template.nearstatus",  //模板配置，@周边微博。
        MyCommentsTemplate: "ngi.weibo.template.mycomments",  //模板配置，我收到的评论
        CommentListTemplate: "ngi.weibo.template.commentlist",  //模板配置，评论列表
        MyMarkUserList:"ngi.weibo.myMarkUserList"// 当前用户-最后@好友的缓存
    };

};

gm.ngi.weibo.DataStorage.prototype.writeObject = function(key, obj) {
    var value = JSON.stringify(obj);
    return this.storage.setItem(key, value);
};

gm.ngi.weibo.DataStorage.prototype.readObject = function(key) {
	// TODO: try catch
	var str = this.storage.getItem(key);
	if (str){
		writeLog("try parse JSON: " + key);
		var obj = null;
		try{
			obj = JSON.parse(str);
		} catch (err){
			writeError("JSON parse error: " + err.description);
			return null;
		}
		writeLog("JSON parsed: " + key);
		return obj;
	} else{
		return null;
	}
};

gm.ngi.weibo.DataStorage.prototype.removeObject = function(key) {
	this.storage.removeItem(key);
};

gm.ngi.weibo.DataStorage.prototype.getCredential = function() {
    var obj = this.readObject(this.storageKeys.Credential);
    return new gm.ngi.weibosdk.Credential(obj);
};

gm.ngi.weibo.DataStorage.prototype.setCredential = function(value) {
    return this.writeObject(this.storageKeys.Credential, value);
};

gm.ngi.weibo.DataStorage.prototype.getApiSetting = function() {
    var obj = this.readObject(this.storageKeys.ApiSetting);
    return obj;
};

gm.ngi.weibo.DataStorage.prototype.setApiSetting = function(value) {
    return this.writeObject(this.storageKeys.ApiSetting, value);
};

gm.ngi.weibo.DataStorage.prototype.getEmotions = function() {
    var obj = this.readObject(this.storageKeys.Emotions);
    return obj;
};

gm.ngi.weibo.DataStorage.prototype.setEmotions = function(value) {
    return this.writeObject(this.storageKeys.Emotions, value);
};

gm.ngi.weibo.DataStorage.prototype.getUserOptions = function(){
	var obj = this.readObject(this.storageKeys.UserOptions);
	return obj;
};

gm.ngi.weibo.DataStorage.prototype.setUserOptions = function(value) {
    return this.writeObject(this.storageKeys.UserOptions, value);
};

gm.ngi.weibo.DataStorage.prototype.getCurrentUser = function() {
    var obj = this.readObject(this.storageKeys.CurrentUser);
    return obj;
};

gm.ngi.weibo.DataStorage.prototype.setCurrentUser = function(value) {
    return this.writeObject(this.storageKeys.CurrentUser, value);
};

gm.ngi.weibo.DataStorage.prototype.getFriendGroups = function() {
    var obj = this.readObject(this.storageKeys.FriendGroups);
    return obj;
};

gm.ngi.weibo.DataStorage.prototype.setFriendGroups = function(value) {
    return this.writeObject(this.storageKeys.FriendGroups, value);
};

gm.ngi.weibo.DataStorage.prototype.getHomeStatuses = function() {
    var obj = this.readObject(this.storageKeys.HomeStatuses);
    return obj;
};

gm.ngi.weibo.DataStorage.prototype.setHomeStatuses = function(value) {
    return this.writeObject(this.storageKeys.HomeStatuses, value);
};

gm.ngi.weibo.DataStorage.prototype.getMyStatuses = function() {
    var obj = this.readObject(this.storageKeys.MyStatuses);
    return obj;
};

gm.ngi.weibo.DataStorage.prototype.setMyStatuses = function(value) {
    return this.writeObject(this.storageKeys.MyStatuses, value);
};

gm.ngi.weibo.DataStorage.prototype.setMyNear = function(value) {
    return this.writeObject(this.storageKeys.MyNear, value);
};

gm.ngi.weibo.DataStorage.prototype.getMyMentions = function() {
    var obj = this.readObject(this.storageKeys.MyMentions);
    return obj;
};

gm.ngi.weibo.DataStorage.prototype.setMyMentions = function(value) {
    return this.writeObject(this.storageKeys.MyMentions, value);
};

gm.ngi.weibo.DataStorage.prototype.getMyComments = function() {
    var obj = this.readObject(this.storageKeys.MyComments);
    return obj;
};

gm.ngi.weibo.DataStorage.prototype.setMyComments = function(value) {
    return this.writeObject(this.storageKeys.MyComments, value);
};

gm.ngi.weibo.DataStorage.prototype.getMyMark = function() {
    var obj = this.readObject(this.storageKeys.MyMarkUserList);
    return obj;
};

gm.ngi.weibo.DataStorage.prototype.setMyMark = function(value) {
    return this.writeObject(this.storageKeys.MyMarkUserList, value);
};
gm.ngi.weibo.dataStorage = new gm.ngi.weibo.DataStorage();

$unit.ns("gm.ngi.weibo.UserOptions");
gm.ngi.weibo.UserOptions = function() {

    // 用户通知的轮询间隔，默认为30秒
    this.notificationInterval = 30000;

    // 列表页每次下载的条数，默认为10条
    this.listPageSize = 20;
};

$unit.ns("gm.ngi.weibo.WeiboApplication");
/*
 * 微博应用主控类
 */
gm.ngi.weibo.WeiboApplication = function(){
	
	// 应用的页面地址定义
	this.pages = {
			home: "default.html",
			login: "login.html",
			monitor: "monitor.html",
			carchannel: "car_mode_channel.html"
	};
	
	this.userOptions = new gm.ngi.weibo.UserOptions();
	
	this.templatekeys = {};
	this.emotionList = null;
	this.markUserList = [];
	
	this.apiAsync = true;
	this.currentUser = null;
	this.notifyUnreadMessages = null;	// 未读消息通知
	
    this.tm = {};
    this.Master = new gm.ngi.MasterPage();
    initApiSetting.call(this);
    initData.call(this);
    initTemplateManager.call(this);
    initUserOptions.call(this);
    initMarkUser.call(this);
    
    function initApiSetting() {
        var setting = gm.ngi.weibo.dataStorage.getApiSetting();
        gm.ngi.weibosdk.api.appId = setting.appId;
        gm.ngi.weibosdk.api.appSecret = setting.appSecret;
        gm.ngi.weibosdk.api.traceCode = setting.traceCode;
        gm.ngi.weibosdk.api.credential = gm.ngi.weibo.dataStorage.getCredential();
    };

    function initData() {
        this.currentUser = gm.ngi.weibo.dataStorage.getCurrentUser();
    }

    function initUserOptions() {
        var op = gm.ngi.weibo.dataStorage.getUserOptions();
        if (op) {
            this.userOptions.notificationInterval = op.notificationInterval || this.userOptions.notificationInterval;
        }
    }

    function initTemplateManager() {
        this.tm = new gm.ngi.TemplateManager(gm.ngi.weibo.dataStorage);
        this.templateKeys = $.extend(null, this.templateKeys, this.tm.templatePaths);
        this.tm.init(this.templateKeys);
    }
    
    function initMarkUser()
    {
    	this.markUserList = gm.ngi.weibo.dataStorage.getMyMark();
    }

};

gm.ngi.weibo.WeiboApplication.prototype.navigate = function(url) {
    window.location.href = url;
};

gm.ngi.weibo.WeiboApplication.prototype.navigateToCarChannelPage = function() {
    this.navigate(this.pages.carchannel);
};

gm.ngi.weibo.WeiboApplication.prototype.navigateToHomePage = function() {
    this.navigate(this.pages.home);
};

gm.ngi.weibo.WeiboApplication.prototype.navigateToLoginPage = function() {
    this.navigate(this.pages.login);
};

gm.ngi.weibo.WeiboApplication.prototype.addMonitor = function(){
	var frame = document.createElement("iframe");
	frame.src = this.pages.monitor;
	frame.width = "0px";
	frame.height = "0px";
	frame.style.borderWidth = "0px";
	frame.style.display = "none";
	document.getElementsByTagName("body")[0].appendChild(frame);
};

/*
* 验证用户凭据
* autoAction: true则自动登录，false则不做任何动作
*/
gm.ngi.weibo.WeiboApplication.prototype.validateCredential = function() {
    if (!gm.ngi.weibosdk.api.credential) {
        return false;
    }

    if (gm.ngi.weibosdk.api.credential.expired()) {
        if (gm.ngi.weibosdk.api.credential.loginName && gm.ngi.weibosdk.api.credential.password) {
        }
        return false;
    }

    return true;
};
/*
 * 取当前屏幕可见的第一条微博的Id
 * 
 * */
gm.ngi.weibo.WeiboApplication.prototype.getActiveItemId = function(d) {
	var parntControl = d || $("#listBox");
	var scroll = parntControl.scrollTop();
	var items = parntControl.find(".oneInLine");
	var item = items[0];
	if (item) {
		if (scroll === 0) {
			return $(item).attr("itemid");
		}
		var j = items.length;
		for ( var i = 0; i < j; i++) {
			item = $(items[i]);
			if (item.position().top >= 0) {
				return item.attr("itemid");
			}
		}
		return $(item).attr("itemid");
	}
	return -1;
};

gm.ngi.weibo.WeiboApplication.prototype.scrollToNextItem = function(d){
	var itemId = this.getActiveItemId(d);
	if (itemId < 0){return;}
	
	var item = document.getElementById("item_" + itemId);
	if (!item) return;
	
	var nextItem = item.nextElementSibling;
	if (!nextItem || nextItem.tagName != item.tagName) return;
	
	nextItem.scrollIntoView();
};

/*
* 登录
*/
gm.ngi.weibo.WeiboApplication.prototype.login = function(loginName, password, autoLogon, callback) {

    gm.ngi.weibosdk.api.login(loginName, password, afterLogin);

    function afterLogin(result, error) {
        if (result) {
            if (!autoLogon) {
                gm.ngi.weibosdk.api.credential.password = null;
            }
            gm.ngi.weibo.dataStorage.setCredential(gm.ngi.weibosdk.api.credential);
        }
        if (callback) {
            callback(result, error);
        }
    }
};

/*
* 退出
*/
gm.ngi.weibo.WeiboApplication.prototype.logout = function() {
    var credential = gm.ngi.weibo.dataStorage.getCredential();
    var loginName = credential.loginName;

    credential = new gm.ngi.weibosdk.Credential();
    credential.loginName = loginName;

    var groups = gm.ngi.weibo.dataStorage.getFriendGroups();
    if (groups){
    	for (var i=0; i<groups.length; i++){
    		var key = gm.ngi.weibo.dataStorage.storageKeys.HomeStatuses + "_" + groups[i].idstr;
    		gm.ngi.weibo.dataStorage.removeObject(key);
    	}
    }
    
    gm.ngi.weibo.dataStorage.setCredential(credential);
    gm.ngi.weibo.dataStorage.setCurrentUser(null);
    gm.ngi.weibo.dataStorage.setFriendGroups(null);
    gm.ngi.weibo.dataStorage.setHomeStatuses(null);
    gm.ngi.weibo.dataStorage.setMyComments(null);
    gm.ngi.weibo.dataStorage.setMyMentions(null);
    gm.ngi.weibo.dataStorage.setMyStatuses(null);
    gm.ngi.weibo.dataStorage.setUserOptions(null);
    gm.ngi.weibo.dataStorage.setMyMark(null);
    gm.ngi.weibo.dataStorage.setMyNear(null);
    this.navigateToLoginPage();
};

/*
* 从服务端刷新用户数据
*/
gm.ngi.weibo.WeiboApplication.prototype.refreshCurrentUser = function(callback) {
    gm.ngi.weibosdk.api.iUser.apiComplete = function(ur) {
        if (ur.succeeded) {
            gm.ngi.weibo.dataStorage.setCurrentUser(ur.data);
        }
        if (callback) {
            callback(ur.succeeded);
        }
    };
    gm.ngi.weibosdk.api.iUser.apiAsync = this.apiAsync;
    gm.ngi.weibosdk.api.iUser.show(gm.ngi.weibosdk.api.credential.userid);

};

/*
* 从服务端同步用户的好友分组
*/
gm.ngi.weibo.WeiboApplication.prototype.refreshFriendGroups = function(callback) {
    gm.ngi.weibosdk.api.iRelation.apiComplete = function(ur) {
        if (ur.succeeded) {
            gm.ngi.weibo.dataStorage.setFriendGroups(ur.data.lists);
        }
        if (callback) {
            callback(ur.succeeded);
        }
    };
    gm.ngi.weibosdk.api.iRelation.apiAsync = this.apiAsync;
    gm.ngi.weibosdk.api.iRelation.groups();
};

gm.ngi.weibo.WeiboApplication.prototype.getTemplate = function(key) {


};


gm.ngi.weibo.WeiboApplication.prototype.getEmotionList = function(){
	// Singleton emotion list, to avoid load from storage repeatedly 
	if (!this.emotionList){
		var emotions = gm.ngi.weibo.dataStorage.getEmotions();
		if (emotions){
			this.emotionList = emotions.list;
		}
		else{
			this.emotionList = [];
		}
	}
	return this.emotionList;
};

gm.ngi.weibo.WeiboApplication.prototype.formatComment = function(comment){
	if (!comment.formattedText){
		comment.formattedText = this.processEmotions(comment.text);
	}

	if (comment.status){
		this.formatStatus(comment.status);
	}
};

gm.ngi.weibo.WeiboApplication.prototype.formatComments = function(comments){
	for (index in comments){
		this.formatComment(comments[index]);
	}
};

gm.ngi.weibo.WeiboApplication.prototype.formatStatus = function(status){
	
	// 友好日期
	status.friendlyDate = processDate(status.created_at);
	
	// 表情处理
	if (!status.formattedText){
		status.formattedText = this.processEmotions(status.text);
	}
	if (status.retweeted_status && !status.retweeted_status.formattedText){
		status.retweeted_status.formattedText = this.processEmotions(status.retweeted_status.text);
	}	
	if(status.source){
		status.source = status.source.replace(/<[/]?[\w\W]*?>/ig,"");
	}
	if(status.distance){
		if(String(status.distance).indexOf("米")>-1){
			return;
		}
		if(status.distance/1000>=1){
			status.distance = status.distance/1000 + "千米";
			}
		else{
			status.distance = status.distance +"米";
		}
	}
	if (!status.formattedText){
		status.formattedText = status.text;
	}
	
	function processDate(date){
		
	}
	
};

gm.ngi.weibo.WeiboApplication.prototype.formatStatuses = function(statuses){
	for (index in statuses){
		this.formatStatus(statuses[index]);
	}
};

gm.ngi.weibo.WeiboApplication.prototype.processEmotions = function(text){
	var emotions = this.getEmotionList();
	if (!emotions || emotions.length == 0)
		return text;
	
	var regex = /\[[^\]]+\]/gi;
	return text.replace(regex, function(word){
		var index = BinarySearch(emotions, function(item){
			return word.localeCompare(item.phrase);
		});
		if (index >= 0){
			return "<img src='" + emotions[index].url + "' />";
		}else{
			return word;
		}
	});
	
	// 二分查找
	// TODO: 整合到公共库，未来简繁转换时，对字库的查找也会用到
	function BinarySearch(srcArray, compare) {
		var low = 0;
		var high = srcArray.length - 1;
		while (low <= high) {
			var middle = (low + high) / 2;
			middle = Math.floor(middle);
			var compareResult = compare(srcArray[middle]);
			if (compareResult == 0) {
				return middle;
			} else if (compareResult < 0) {
				high = middle - 1;
			} else {
				low = middle + 1;
			}
		}
		return -1;
	}
};

gm.ngi.weibo.WeiboApplication.prototype.getLocation = function(callback){
	gm.info.getCurrentPosition(function(pos){
		var divider = 3600 * 1000;
		var lat = pos.coords.latitude / divider;
		var lng = pos.coords.longitude / divider;
		var coords = {latitude:lat, longitude:lng};
		if (callback){
			callback(coords);
		}
	}, function(args) {
		if (callback){
			return null;
		}
	}, {});
}

gm.ngi.weibo.app = new gm.ngi.weibo.WeiboApplication();
