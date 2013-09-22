$unit.ns("gm.ngi.weibo.MyMessagePage");
gm.ngi.weibo.MyMessagePage = function() {
//	this.bindUnRead = function(d) {
//		$("#lnkMentions").html(d.mention_cmt + "条微博提到我，刷新看看");
//		$("#lnkComments").html(d.cmt + "条新评论，刷新看看");
//	};
	this.init = function() {

		// TODO:页面上控件的绑定
		var leftStatus = new gm.ngi.control.LeftControl({
			parentControl : $("#leftBox"),
			focus : -1
		});
		var headStatus = new gm.ngi.control.HeadControl({
			parentControl : $("#topBox"),
			user : gm.ngi.weibo.app.currentUser,
			onAutoRefresh : this.bindUnRead
		});
		gm.ngi.weibo.app.Master.init([ leftStatus, headStatus ]);

//		$("#lnkRefresh").click(function() {
//			this.bindUnRead();
//		});
	};

};
initPage = function() {
	new gm.ngi.weibo.MyMessagePage().init();
	$(document).ready(function(){
		gm.ngi.weibo.app.notifyUnreadMessages = function(data){
			$("#lnkCmt").html(data.cmt);
			$("#lnkMCmt").html(data.mention_status);
			$("#lnkMentions").html(data.mention_status + "条微博提到我，刷新看看");
			$("#lnkComments").html(data.cmt + "条新评论，刷新看看");
		};
	});
};
