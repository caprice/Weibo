/*
* @我 微博列表控件
* Reference：util.js,mustache.js,
* Inherit  : gm.ngi.control.BaseListControl
* */
$unit.ns("gm.ngi.control.MentionStatusControl");
var defaultJspPanelId = "listBox";
gm.ngi.control.MentionStatusControl = function(config) {

	this.cacheName = gm.ngi.weibo.dataStorage.storageKeys.MyMentions;
    var that = this;
	this.clearData=function()
	{
		that.closeLoad();
	};
	this.resetCount=function()
	{
		var params={type:"mention_status"};
		gm.ngi.weibosdk.api.iStatus.set_count(params);
	};
	this.isrefresh = function() {
		return pageParams.isRefresh && pageParams.isRefresh == "1";
	};
    this.getFirstMentionStatus = function(pageArgs, callback) {
		var refresh=that.isrefresh();
    	var data = gm.ngi.weibo.dataStorage.readObject(that.cacheName);
        if (!refresh&&data && data != "false" && data.statuses) {
            console.log(this.cacheName + " get data from cache file.");
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
            that.getMoreMentionStatus(pageArgs, callback);
        }
	};
	
	this.getMoreMentionStatus = function(pageArgs, callback,goFromRefresh) {
		gm.ngi.weibosdk.api.iStatus.apiComplete = function(d) {
            if (d.succeeded&&d.data&&d.data.statuses&&d.data.statuses.length>0) {
				if(goFromRefresh)
				{
					that.config.parentControl.html("");
				}		
                var bindData = d.data; // 将API获取的值，赋予子类对象的data属性，用于加载模板使用
                gm.ngi.weibo.app.formatStatuses(bindData.statuses);
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
                if (pageArgs.page < 2) {
                    console.log(this.cacheName + " write to file.");
                    gm.ngi.weibo.dataStorage.writeObject(that.cacheName, bindData);
                }
                callback(bindData);
                that.resetCount();
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
        gm.ngi.weibosdk.api.iStatus.mentions(pageArgs);
	};
	this.refreshMentionStatus = function(pageArgs, callback)
	{
		that.getMoreMentionStatus(pageArgs, callback,1);
	};
    this.itemClick = function(item) {
    	var postParam = {id: item.attr("itemid"), reurl: "mentionstatus.html"};
		var url="statusdetail.html?" + $.param(postParam);
        location.href =url;// "statusdetail.html?id=" + item.attr("itemid");
    };
    var mentionConfig = {
        templateName: "mentionstatus", // 模板名称
        template : gm.ngi.weibo.app.templateKeys.MentionstatusTemplate,
        delegateFirst : this.getFirstMentionStatus,
		delegateMore : this.getMoreMentionStatus,
		delegateRefresh: this.refreshMentionStatus,
        onItemClick: this.itemClick,
        cacheName: gm.ngi.weibo.dataStorage.storageKeys.MyMentions,
        loadMoreString:"<li id=\"lnkMore\" class=\"moreBox\"><a href=\"javascript:;\" hidefocus=\"true\">更多...</a></li>",
        moreControl : "#lnkMore"
    };
    mentionConfig = $.extend(null, config, mentionConfig);
    this.init(mentionConfig);
};

gm.ngi.control.MentionStatusControl.prototype = new gm.ngi.control.BaseListControl();