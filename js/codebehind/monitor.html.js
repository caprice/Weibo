
init = function(){
	gm = parent.window.gm;
	$ = parent.window.$;
	$(document).ready(function(){
	    syncEmotions();
	    syncUserData();
	    getUnreadMessages();
	    setInterval(getUnreadMessages,
				gm.ngi.weibo.app.userOptions.notificationInterval || 30000);
	});
};

/*
 * 同步用户个人信息及好友好组
 */
syncUserData = function(){
	var days = 1;
	var user = gm.ngi.weibo.dataStorage.getCurrentUser();
	if (!user || !user.lastSync || syncExpired(user.lastSync, days)){
		var api = new gm.ngi.weibosdk.Weibo();
		api.credential = gm.ngi.weibosdk.api.credential;
		
		api.iUser.apiComplete = function(ur){
			if (ur.succeeded){
				ur.data.lastSync = new Date();
				gm.ngi.weibo.dataStorage.setCurrentUser(ur.data);
			}
		};
		
		api.iRelation.apiComplete = function(ur){
			if (ur.succeeded){
				gm.ngi.weibo.dataStorage.setFriendGroups(ur.data);
			}
		};
		
		api.iUser.show(api.credential.userid);
		api.iRelation.groups();
	}
};

/*
 * 同步表情字典
 */
syncEmotions = function(){
	var days = 7;
	var emotions = gm.ngi.weibo.dataStorage.getEmotions();
	if (!emotions || !emotions.lastSync || syncExpired(emotions.lastSync, days)){
		var api = new gm.ngi.weibosdk.Weibo();
		api.credential = gm.ngi.weibosdk.api.credential;
		api.iStatus.apiComplete = function(ur){
			if (ur.succeeded){
				emotions = {
						lastSync:  new Date(),
						// 表情数据按phrase进行排序，以便二分搜索
						list: ur.data.sort(function(a, b){
							return a.phrase.localeCompare(b.phrase);
						})
				};
				gm.ngi.weibo.dataStorage.setEmotions(emotions);
			}
		};
		api.iStatus.emotions();
	}
};

getUnreadMessages = function(){
	var api = new gm.ngi.weibosdk.Weibo();
	api.credential = gm.ngi.weibosdk.api.credential;
	api.iUser.apiComplete = function(ur) {
		if (ur && ur.succeeded) {
			if (gm.ngi.weibo.app.notifyUnreadMessages){
				gm.ngi.weibo.app.notifyUnreadMessages(ur.data);
			}
		}
	};
	api.iUser.unread_count(api.credential.userid);
};

refreshToken = function(){
	
};

syncExpired = function(syncDate, days){
	if (!days){
		days = 1;
	}
	var date = new Date(syncDate);
	date.setDate(date.getDate() + new Number(days));
	return date < new Date();
};