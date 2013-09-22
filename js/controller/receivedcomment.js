/*
* 我收到的评论
* Reference：util.js,mustache.js,
* Inherit  : gm.ngi.control.BaseListControl
* */
$unit.ns("gm.ngi.control.ReceivedCommentControl");

gm.ngi.control.ReceivedCommentControl = function(config) {

	this.cacheName = gm.ngi.weibo.dataStorage.storageKeys.MyComments;
    var that = this;
	this.clearData=function()
	{
		that.closeLoad();
	};
	this.resetCount=function()
	{
		var params={type:"cmt"};
		gm.ngi.weibosdk.api.iStatus.set_count(params);
	};
	this.isrefresh = function() {
		return pageParams.isRefresh && pageParams.isRefresh == "1";
	};
    this.getFirstReceivedComment = function(pageArgs, callback) {
    	var data = gm.ngi.weibo.dataStorage.readObject(that.cacheName);
		var isrefresh=that.isrefresh();
        if (!isrefresh&&data && data != "false" && data.comments) {
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
			if(data.comments.length>0)
				that.config.noDataString="<li class=\"moreBox2\"><a href=\"javascript:;\" hidefocus=\"true\">没有更多内容.</a></li>";
            callback(data);
        } else {
			that.showLoad();
            that.getMoreReceivedComment(pageArgs, callback);
        }
	};
    this.getMoreReceivedComment = function(pageArgs, callback,goFromRefresh) {
		gm.ngi.weibosdk.api.iComment.apiComplete = function(d) {
            if (d.succeeded&&d.data&&d.data.comments) {
				if(goFromRefresh)
				{
					that.config.parentControl.html("");
				}		
                var bindData = d.data; // 将API获取的值，赋予子类对象的data属性，用于加载模板使用
                gm.ngi.weibo.app.formatComments(bindData.comments);
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
                    console.log(that.cacheName + " write to file.");
                    gm.ngi.weibo.dataStorage.writeObject(that.cacheName, bindData);
                }
                if(bindData.comments.length>0)
    				that.config.noDataString="<li class=\"moreBox2\"><a href=\"javascript:;\" hidefocus=\"true\">没有更多内容.</a></li>";
                callback(bindData);
                that.resetCount();
            } else {
                console.log("getMoreReceivedComment was error.");
            }
        };
        gm.ngi.weibosdk.api.iComment.apiConnectionError = function(
				err) {
			that.clearData();
			gm.ngi.msgbox.show("哎呀，你的网络好像有点问题，请重试！");
		};
		gm.ngi.weibosdk.api.iComment.apiServerError = function(
				err) {
			that.clearData();
			var error = "加载评论信息出错，错误代码："
					+ err.data.error_code;
			if (gm.ngi.weibosdk.ApiError[err.data.error_code]) {
				error = gm.ngi.weibosdk.ApiError[err.data.error_code];
			}
			gm.ngi.msgbox.show(error);
		};
        gm.ngi.weibosdk.api.iComment.to_me(pageArgs);
	};
	this.refreshReceivedComment = function(pageArgs, callback)
	{
		that.getMoreReceivedComment(pageArgs, callback,1);
	};
    this.itemClick = function(item) {
        
    };
    var receivedConfig = {
        template: gm.ngi.weibo.app.templateKeys.MyCommentsTemplate,
        delegateFirst: this.getFirstReceivedComment,
        delegateMore: this.getMoreReceivedComment,
		delegateRefresh: this.refreshReceivedComment,
        onItemClick: this.itemClick,
        cacheName: gm.ngi.weibo.dataStorage.storageKeys.MyComments,
        loadMoreString: "<li id=\"lnkMore\" class=\"moreBox\"><a href=\"javascript:;\" hidefocus=\"true\">更多...</a></li>",
        noDataString : "<li class=\"moreBox\"><a href=\"javascript:;\" hidefocus=\"true\">还没有评论.</a></li>",
        moreControl: "#lnkMore"
    };
    receivedConfig = $.extend(null, config, receivedConfig);
    this.init(receivedConfig);
};

gm.ngi.control.ReceivedCommentControl.prototype = new gm.ngi.control.BaseListControl();