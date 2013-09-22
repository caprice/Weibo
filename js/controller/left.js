/*
 * 左边导航控件
 * Reference：util.js,mustache.js
 * */

$unit.ns("gm.ngi.control.LeftControl");
gm.ngi.control.LeftControl = function(config)// 实现控件基类的继承
{
	this.config = config;
	// this.template = gm.ngi.weibo.app.templateKeys.LeftTemplate;
	// this.config.parentControl.html(this.template);
	this.liItems = this.config.parentControl.find("li");

	// this.liClassA = [ "leftIndex_A", "leftMessage_A", "leftMore_A" ];
	this.liClassB = [ "leftIndex_B", "leftMessage_B", "leftMore_B" ];
	this.config.focus = this.config.focus || 0;

	for ( var i = 0; i < this.liItems.length; i++) {
		// this.liItems[i].className = this.liClassA[i];
		if (this.config.focus > 0 && i == (this.config.focus - 1)) {
			continue;
		}
		$(this.liItems[i]).bind("mouseover", function() {
			var cn = String(this.className);
			cn = cn.substr(0, cn.indexOf("_"));
			this.className = cn + "_B";
		});
		$(this.liItems[i]).bind("mouseout", function() {
			var cn = String(this.className);
			cn = cn.substr(0, cn.indexOf("_"));
			this.className = cn + "_A";
		});
	}

	/* 实现加载第一页数据，以便MasterPage调用 */
	this.loadFirst = function() {
		//if (this.config.focus > 0) {
			//this.liItems[this.config.focus - 1].className = this.liClassB[this.config.focus - 1];
		//}
		gm.ngi.weibo.app.notifyUnreadMessages = function(data){
			gm.ngi.weibo.app.notifyUnreadMessages = function(data){
				var tmp = data.cmt + data.mention_status;
				if (tmp > 0) {
					$("#lnkCmtall a").html(tmp);
					if (data.cmt > 0) {
						$("#lnkcmt a").html(data.cmt);
						$("#lnkcmt").show();

					} else {
						$("#lnkcmt").hide();

					}
					if (data.mention_status > 0) {
						$("#lnkmt a").html(data.mention_status);
						$("#lnkmt").show();
					} else {
						$("#lnkmt").hide();

					}
					$("#lnkCmtall a").html(tmp);
					$("#lnkCmtall").show();

				} else {
					$("#lnkcmt").hide();
					$("#lnkmt").hide();
					$("#lnkCmtall").hide();
					$("#lnkCmtall a").html("0");
				}
				// $("#lnkMCmt").html(data.mention_status);
			};
		};
	};
};