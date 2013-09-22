/*
模板管理器
 */

$unit.ns("gm.ngi.TemplateManager");
gm.ngi.TemplateManager = function(d) {

	this.templatePaths = {
		FriendstatusTemplate : "template/friendstatus.html",
		MentionstatusTemplate: "template/mentionstatus.html",
		MyCommentsTemplate: "template/receivedcomment.html",
        CommentListTemplate: "template/commentlist.html", //模板配置，评论列表
        NearstatusTemplate:"template/nearstatus.html"
	};
	/*
	 * 初始化模板
	 */
	this.init = function(m, completed) {
		for ( var temp in this.templatePaths) {
			var l = this.get(temp);
			if (m) {
				m[temp] = l;
			}
		}
		;
		if (completed)
			completed.call(null);
	};
	/*
	 * 加载模板
	 */
	this.loadTemplate = function(url) {
		var result = "";
		$.ajax({
			url : url,
			async : false,
			success : function(d) {
				result = d;
			},
			type : "GET"
		});
		return result;
	};
	/*
	 * 按初始化的key,返回模板，避免二次请求。 key:为模板名，如：LeftTemplate。
	 * k为文件名，如："ngi.weibo.template.left"
	 */
	this.get = function(key, callback) {
		var k = d.storageKeys[key];
		var m = d.storage.getItem(k);
		if (m && m != "false") {
			console.log(key + " was read by storage");
			return m;
		} else {
			m = this.loadTemplate(this.templatePaths[key]);
			d.storage.setItem(k, m);
			callback && callback(m);
			return m;
		}

	};
};

$unit.ns("gm.ngi.MasterPage");
/*
 * 母版布局加载器 lst: basecontrol[]，一组实现loadFirst方法的控件类，如friendstatus 加载器依次加载、渲染各个控件
 */
gm.ngi.MasterPage = function() {
	this.init = function(lst) {
		var i = 0;
		while (lst[i]) {
			(function(b) {
				setTimeout(function() {
					b.loadFirst();
				}, 10);
			})(lst[i]);
			i++;
		}
	};
};