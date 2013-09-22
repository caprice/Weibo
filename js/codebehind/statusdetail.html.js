$unit.ns("gm.ngi.weibo.statusDetailPage");
var defaultJspPanelId = "listBox";

gm.ngi.weibo.statusDetailPage = function() {
	var that = this;
	 this.dv = gm.ngi.msgbox.showLoad("加载中...");
	$("#lnkRego").click(function() {
		var id = pageParams.id;
		if (id && id > 0) {
			var url = "default.html";
			if (pageParams.reurl && pageParams.reurl != "undefined") {
				var postParam = {
					reurl : decodeURI(pageParams.reurl)
				};
				url = pageParams.reurl +(pageParams.reurl.indexOf("?")==-1?"?":"&") + $.param(postParam);
			}
			url = url + (url.indexOf("?")==-1?"?":"&") + "anchorItemId=" + id;
			location.href = url;
		}
	});
	this.clearData=function()
	{
		$("#dvName").html("");
		$("#dvContent").html("");
		$("#imgHead").attr("src", "images/nouser_icon.png");
		$("#dvReadNum").attr("href", "#");
		$("#dvReplyNum").attr("href","#");
		$("#lnkComment").attr("href", "#");
		$("#lnkTran").attr("href", "#");
		that.dv.close();
	};
	this.init = function() {
		var id = pageParams.id;
		if (id && id > 0) {
			this.bindDataToView(id);
			$("#lnkRefresh").click(function() {
				$("#dvContent").html("加载中...");
				that.bindDataToView(id);
			});
			$("#lnkComment").attr("href", "postcomment.html?id=" + id);
			$("#lnkTran").attr("href", "repost.html?id=" + id);
			//$("#dvReadNum").attr("href", "repost.html?id=" + id);
			//$("#dvReplyNum").attr("href","commentlist.html?isRefresh=1&id=" + id);
			var postParam = {
					id:id,
					reurl : location.href,
					reurl2:pageParams.reurl2					
				};
			$("#lnkComment").attr("href", "postcomment.html?"+$.param(postParam));
			$("#lnkTran").attr("href", "repost.html?" + $.param(postParam));
			$("#dvReadNum").click(function(){window.location = "repost.html?" +$.param(postParam);});
			$("#dvReplyNum").click(function(){window.location = "commentlist.html?isRefresh=1&" +$.param(postParam);});
		} else {
			location.href = "default.html";
		}
	};
	this.bindDataToView = function(id) {

		gm.ngi.weibosdk.api.iStatus.apiComplete = function(d) {
			if (d.succeeded) {
				var bindData = d.data; 
				gm.ngi.weibo.app.formatStatus(bindData);
				if (bindData) {
					var repost = bindData.formattedText;
					if (bindData.thumbnail_pic) {
						repost = repost + "<br/><img style='max-width=400px' onload='reInitJsp();' src='"
								+ bindData.bmiddle_pic + "'/>";
					}
					if (bindData.retweeted_status) {
						if (bindData.retweeted_status.deleted) {
							repost = repost + "<div class='replyBox'>"
									+ bindData.retweeted_status.text + "</div>";
						} else {
							repost = repost + "<div class='replyBox'>"
									+ bindData.retweeted_status.user.name + "："
									+ bindData.retweeted_status.formattedText;
							if (bindData.retweeted_status.thumbnail_pic) {
								repost = repost
										+ "<br/><img style='max-width=400px' onload='reInitJsp();' src='"
										+ bindData.retweeted_status.bmiddle_pic
										+ "'/>";
							}
							repost += "</div>";
						}
					}
					if(bindData.user)
					{
						$("#imgHead").attr("src",
							bindData.user.profile_image_url || "");
						var img=gm.ngi.weibo.utils.formatTypeV(bindData.user,bindData.user.verified,bindData.user.verified_type);
						var vcon="<span><img width='30' height='30' src='images/"+
						img+"' border='0'/></span>";
						if(!img)
							vcon="";
						$("#userMessageBox").append(vcon);
					
						$("#dvName").html(
								bindData.user.name
										+ "<span>"
										+ gm.ngi.weibo.utils
												.toFriendlyDate(new Date(
														bindData.created_at))
										+ "</span>");
						$("#dvContent").html(repost);
						$("#dvReadNum a").html(bindData.reposts_count);
						$("#dvReplyNum a").html(bindData.comments_count);
	
						var id = (bindData && bindData.id) ? bindData.id : "";
						var name = (bindData && bindData.user && bindData.user.name) ? bindData.user.name
								: "";
						var content = (bindData && bindData.text) ? bindData.text
								: "";
						if (id != "") {
							content = escape("//@" + name + ":" + content);
							content = (bindData && bindData.retweeted_status) ? content
									: "";
							var postParam = {
								id : id,
								content : content,
								reurl : location.href,
								reurl2:pageParams.reurl2
							};
							$("#lnkComment").attr("href", "postcomment.html?"+$.param(postParam));
								$("#lnkTran").attr("href", "repost.html?" + $.param(postParam));
								$("#dvReadNum").click(function(){window.location = "repost.html?" +$.param(postParam);});
								$("#dvReplyNum").click(function(){window.location = "commentlist.html?isRefresh=1&" +$.param(postParam);});
							}
							 that.dv.close();
					}
					else
					{
						that.clearData();
						$("#dvContent").html(repost);
					}
					reInitJsp();
					return;
				}
			}
			gm.ngi.weibosdk.api.iStatus.apiConnectionError = function(
					err) {
				that.clearData();
				gm.ngi.msgbox.show("哎呀，你的网络好像有点问题，请重试！");
			};
			gm.ngi.weibosdk.api.iStatus.apiServerError = function(
					err) {
				that.clearData();
				var error = "微博详情显示出错，错误代码："
						+ err.data.error_code;
				if (gm.ngi.weibosdk.ApiError[err.data.error_code]) {
					error = gm.ngi.weibosdk.ApiError[err.data.error_code];
				}
				gm.ngi.msgbox.show(error);
			};
		}
		gm.ngi.weibosdk.api.iStatus.show(id);
	};

};
initPage = function() {
	new gm.ngi.weibo.statusDetailPage().init();
};
