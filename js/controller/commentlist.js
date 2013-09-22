/*
* 微博的评论列表
* Reference：util.js,mustache.js,
* Inherit  : gm.ngi.control.BaseListControl
* */
$unit.ns("gm.ngi.control.CommentListControl");
var defaultJspPanelId = "listBox";
gm.ngi.control.CommentListControl = function(config) {
	
	this.cacheName = gm.ngi.weibo.dataStorage.storageKeys.CommentList;
    var that = this;
	this.clearData=function()
	{
		that.closeLoad();
	};
    this.getFirstCommentList = function(pageArgs, callback) {
    	var isrefresh=pageParams&&pageParams.isRefresh&&pageParams.isRefresh=="1";
    	var data = gm.ngi.weibo.dataStorage.readObject(that.cacheName);
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
			if (that.pager.pageNo == 1 && data.comments.length > 0){
				that.pager.first = data.comments[0].id;
			}
			if(data.comments.length>0)
				that.config.noDataString="<li class=\"moreBox2\"><a href=\"javascript:;\" hidefocus=\"true\">没有更多内容.</a></li>";
            callback(data);
        } else {
			that.showLoad();
            that.getMoreCommentList(pageArgs, callback);
        }
    };
    this.getMoreCommentList = function(pageArgs, callback,goFromRefresh) {
    	gm.ngi.weibosdk.api.iComment.apiComplete = function(d) {
            if (d.succeeded) {
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
                    console.log(this.cacheName + " write to file.");
                    gm.ngi.weibo.dataStorage.writeObject(that.cacheName, bindData);
                }
    			if (that.pager.pageNo == 1 && bindData.comments.length > 0){
    				that.pager.first = bindData.comments[0].id;
    			}
    			if(bindData.comments.length>0)
    				that.config.noDataString="<li class=\"moreBox2\"><a href=\"javascript:;\" hidefocus=\"true\">没有更多内容.</a></li>";
                callback(bindData);
            } else {
                console.log("getFriendStatus was error.");
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
			var error = "加载评论列表出错，错误代码："
					+ err.data.error_code;
			if (gm.ngi.weibosdk.ApiError[err.data.error_code]) {
				error = gm.ngi.weibosdk.ApiError[err.data.error_code];
			}
			gm.ngi.msgbox.show(error);
		};
		gm.ngi.weibosdk.api.iComment.show(pageParams.id,pageArgs);
    };
    this.refreshCommentList = function(pageArgs, callback)
	{
		that.getMoreCommentList(pageArgs, callback,1);
	};
    this.itemClick = function(item) {
    };
    var commentConfig = {
    		templateName: "commentlist", // 模板名称
            template : gm.ngi.weibo.app.templateKeys.CommentListTemplate,
            delegateFirst : this.getFirstCommentList,
    		delegateMore : this.getMoreCommentList,
    		delegateRefresh: this.refreshCommentList,
            onItemClick: this.itemClick,
            cacheName: gm.ngi.weibo.dataStorage.storageKeys.CommentList,
            loadMoreString:"<li id=\"lnkMore\" class=\"moreBox2\"><a href=\"javascript:;\" hidefocus=\"true\">更多...</a></li>",
            noDataString : "<li class=\"moreBox2\"><a href=\"javascript:;\" hidefocus=\"true\">还没有评论.</a></li>",
            moreControl : "#lnkMore"
    };
    commentConfig = $.extend(null, config, commentConfig);
    this.init(commentConfig);
};

gm.ngi.control.CommentListControl.prototype = new gm.ngi.control.BaseListControl();