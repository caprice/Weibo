/*
 * 好友微博列表控件
 * Reference：util.js,mustache.js,
 * Inherit  : gm.ngi.control.BaseListControl
 * 
 * 此页面可接收两个参数：
 * 	id：标明好友分组的ID，如为-1，则是所有好友微博
 * 	isrefresh：如1则忽略缓存，强制从服务器请求数据，否则则优先使用缓存
 * */
$unit.ns("gm.ngi.control.FriendStatusControl");

gm.ngi.control.FriendStatusControl = function(config) {
	this.cacheName = gm.ngi.weibo.dataStorage.storageKeys.HomeStatuses;
	this.getCacheName = function() {
		var id = pageParams.id;
		if (!id) {// 默认首页
			return gm.ngi.weibo.dataStorage.storageKeys.HomeStatuses;
		}
		switch (id) {
		case "-1":// 我的微博
			return gm.ngi.weibo.dataStorage.storageKeys.MyStatuses;
		case "-2":// 周边微博
			return gm.ngi.weibo.dataStorage.storageKeys.MyNear;
		default:// 分组微博，不需要缓存
			//return null;
			return gm.ngi.weibo.dataStorage.storageKeys.HomeStatuses + "_" + id;
		}
	};
	this.isrefresh = function() {
		return pageParams.isRefresh && pageParams.isRefresh == "1";
	};
	var that = this;
	this.clearData=function()
	{
		that.closeLoad();
	};
	this.getFirstFriendStatus = function(pageArgs, callback) {
		var cacheName=that.getCacheName();
		var isrefresh=that.isrefresh();
		var data=null;
		this.anchorItemId = null;
		if(cacheName&&!isrefresh){
			data = gm.ngi.weibo.dataStorage.readObject(cacheName);
			if (data && data.page&&data.statuses&&data.statuses.length>0){
				that.pager.pageNo = data.page;
				that.pager.first = data.statuses[0].id;
				if (pageParams.anchorItemId){
					this.anchorItemId = "item_" + pageParams.anchorItemId;
				}
			}
		}
		if (!isrefresh && data && data != "false" && data.statuses&& data.statuses.length>0) {
			data.datefomart = function() {
				return gm.ngi.weibo.utils.toFriendlyDate(new Date(
						this.created_at));
			};
			data.formatV=function(){
				if(this.user)
				{
					return gm.ngi.weibo.utils.formatTypeV(this.user,this.user.verified,this.user.verified_type);
				}				
				return null;
			};
			data.formatHeadImg=function(){
				if(this.user)
					return this.user.profile_image_url
				return "images/nouser_icon.png";
			};
			gm.ngi.weibo.app.formatStatuses(data.statuses);
			callback(data);
		} else {
			that.showLoad();
			that.getMoreFriendStatus(pageArgs, callback);
		}
	};
	this.getMoreFriendStatus = function(pageArgs, callback,goFromRefresh) {
		this.anchorItemId = null;
		gm.ngi.weibosdk.api.iStatus.apiComplete = function(d) {
			if (d.succeeded) {
				if(goFromRefresh)
				{
					that.config.parentControl.html("");
				}		
				var bindData = d.data; // 将API获取的值，赋予子类对象的data属性，用于加载模板使用
				bindData.datefomart = function() {
					return gm.ngi.weibo.utils.toFriendlyDate(new Date(
							this.created_at));
				}; // 格式化相应的发布日期
				bindData.formatV=function(){
					if(this.user)
					{
						return gm.ngi.weibo.utils.formatTypeV(this.user,this.user.verified,this.user.verified_type);
					}				
					return null;
				};
				bindData.formatHeadImg=function(){
					if(this.user)
						return this.user.profile_image_url
					return "images/nouser_icon.png";
				};
				if (that.pager.pageNo == 1 && bindData.statuses && bindData.statuses.length > 0){
					that.pager.first = bindData.statuses[0].id;
				}

				gm.ngi.weibo.app.formatStatuses(bindData.statuses);
				callback(bindData);

				// 缓存
				var cacheName=that.getCacheName();
				if (cacheName){
					console.log(this.cacheName + " write to file.");
					var objToCache = bindData;
					objToCache.page = pageArgs.page;
					if (pageArgs.page > 1){
						var cachedObj = gm.ngi.weibo.dataStorage.readObject(cacheName);
						objToCache.statuses = cachedObj.statuses.concat(objToCache.statuses);
					}
					gm.ngi.weibo.dataStorage.writeObject(cacheName, objToCache);
				}
			} else {
				console.log("getFriendStatus was error.");
			}
		};
		gm.ngi.weibosdk.api.iStatus.apiConnectionError = function(
				err) {
			that.clearData();
			gm.ngi.msgbox.show("哎呀，你的网络好像有点问题，请重试！");
		};
		gm.ngi.weibosdk.api.iStatus.apiServerError = function(
				err) {
			that.clearData();
			var error = "加载微博列表出错，错误代码："
					+ err.data.error_code;
			if (gm.ngi.weibosdk.ApiError[err.data.error_code]) {
				error = gm.ngi.weibosdk.ApiError[err.data.error_code];
			}
			gm.ngi.msgbox.show(error);
		};
		var id = pageParams.id;
		if (!id) {// 默认首页
			gm.ngi.weibosdk.api.iStatus.friends_timeline(pageArgs);
		}
		else{
			switch (id) {
			case "-1":// 我的微博
				gm.ngi.weibosdk.api.iStatus.user_timeline(gm.ngi.weibo.app.currentUser.id,pageArgs,0);
				break;
			case "-2":// 周边微博
				gm.ngi.weibo.app.getLocation(function(c){
					// coords 为空则表示取坐标失败
					if (c) {
						var param1 = $.extend(null, pageArgs, {
							lat : c.latitude,
							long : c.longitude
						});
						gm.ngi.weibosdk.api.iStatus.nearby_timeline(param1);
					} else {
						that.clearData();
						gm.ngi.msgbox.show("获取地理位置失败");
					}
				});
				
				break;
			default:// 分组微博，不需要缓存
				gm.ngi.weibosdk.api.iStatus.group_timeline(pageArgs,id);
				break;
			}
		}
	};
	this.refreshFriendStatus = function(pageArgs, callback)
	{
		this.anchorItemId = null;
		that.getMoreFriendStatus(pageArgs, callback,1);
	};
	this.itemClick = function(item) {
		var reurl=pageParams.reurl;		
		var postParam = {id:item.attr("itemid"),reurl:reurl,reurl2:reurl};
		if(!reurl)
			{
				postParam = {id:item.attr("itemid")};
			}
		var url="statusdetail.html?" + $.param(postParam);
		//location.href = "statusdetail.html?id=" + item.attr("itemid");
		location.href = url;
	};
	var friendConfig = {
		template : gm.ngi.weibo.app.templateKeys.FriendstatusTemplate,
		delegateFirst : this.getFirstFriendStatus,
		delegateMore : this.getMoreFriendStatus,
		delegateRefresh : this.refreshFriendStatus,
		onItemClick : this.itemClick,
		loadMoreString : "<li id=\"lnkMore\" class=\"moreBox\"><a href=\"javascript:;\" hidefocus=\"true\">更多...</a></li>",
		noDataString : "<li class=\"moreBox\"><a href=\"javascript:;\" hidefocus=\"true\">没有可以显示的微博.</a></li>",
		moreControl : "#lnkMore"
	};
	friendConfig = $.extend(null, config, friendConfig);
	this.init(friendConfig);
};

gm.ngi.control.FriendStatusControl.prototype = new gm.ngi.control.BaseListControl();