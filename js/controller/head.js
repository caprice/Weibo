/*
 * 头部控件
 * Reference：util.js,mustache.js
 * */

$unit.ns("gm.ngi.control.HeadControl");
gm.ngi.control.HeadControl = function(config) {

	this.config = config;
	var that = this;
	//this.template = gm.ngi.weibo.app.templateKeys.HeadTemplate;
	this.data = {
		user : config.user,
		conmentNum : 0,
		mentionNum : 0
	};
	this.config.cmtControl = "#lnkCmt";
	this.config.mCmtControl = "#lnkMCmt";
	this.config.uNameControl = $("#lnkUserName");
	this.config.liNameControl=$("#liUserName");
	this.config.lnkarrowControl =$("#lnkarrow");
	this.config.soundControl = "#lnkSound";
	this.config.refreshControl = "#lnkRefresh";
	
	if (pageParams.id) {
		if (pageParams.id === "-1") {
			this.config.uNameControl.html("我的微博");
		} else if (pageParams.id === "-2") {
			this.config.uNameControl.html("周边微博");

		} else {
			this.config.uNameControl.html(decodeURIComponent(pageParams.n));
		}
	} else {
		this.config.uNameControl.html(this.data.user.name);
	}
	//this.config.parentControl.html("");
	//this.config.parentControl.html(this.template);
	this.config.mygroup = new gm.ngi.Dialog.MyGroup({
		userName : config.user.name
	});
	this.config.mygroup.init();
	// this.reflushHandler = $unit.bind(this.reflushUnread, this);
	/* 实现加载第一页，以便 Mater调用 */
	this.loadFirst = function() {
		var that = this;
		this.config.cmtControl = $(this.config.cmtControl);
		this.config.mCmtControl = $(this.config.mCmtControl);
		//this.config.uNameControl = $(this.config.uNameControl);
		this.config.soundControl = $(this.config.soundControl);
		this.config.refreshControl = $(this.config.refreshControl);
		this.config.cmtControl.html("0");
		this.config.mCmtControl.html("0");
		//this.config.mTopBox = $(this.config.mTopBox);
		//this.config.mTopBox.html("");
		
		
		this.bindToTemplate();
//		this.loopTime = setInterval(this.reflushUnread,
//				gm.ngi.weibo.app.userOptions.notificationInterval || 5000);
		this.config.soundControl.click(function() {

		});
		this.config.refreshControl.click(function() {
			that.bindToTemplate();
			if (that.config.onRefreshClick) {
				that.config.onRefreshClick();
			}
		});
		var liclick=function(){
			var spn = that.config.lnkarrowControl;
			if (spn.attr("src").indexOf("11.png")>-1) {
				spn.attr("src", "images/6.png");
				that.config.mygroup.close();
			} else {
				spn.attr("src", "images/11.png");
				that.config.mygroup.show();
			}
		};
		this.config.uNameControl.click(liclick);
		this.config.lnkarrowControl.click(liclick);
	};
	/* 绑定到模板 */
	this.bindToTemplate = function(callback) {
		var that = this;
		gm.ngi.weibosdk.api.iUser.apiComplete = function(d) {
			if (d && d.succeeded) {
//				that.config.cmtControl.html(d.data.cmt);
//				that.config.mCmtControl.html(d.data.mention_cmt);
				if (callback) {

					callback();
				}
				if (that.config.onAutoRefresh) {
					that.config.onAutoRefresh(d.data);
				}
			}
		};
		gm.ngi.weibosdk.api.iUser.unread_count(this.config.user.id);
	};
	/* 刷新未读数 */
	this.reflushUnread = function() {
		that.bindToTemplate.call(that);
	};
	this.toogleSound = function() {
		// that.config.soundControl.
	};
};