/*
 * 微博列表父控件
 * Reference：util.js,mustache.js
 * */
$unit.ns("gm.ngi.control.BaseListControl");
gm.ngi.control.BaseListControl = function() {
	/* 列表的配置信息 */
	this.setting = {
		pageSize : gm.ngi.weibo.app.userOptions.listPageSize,
		parentControl : {},
		loading:0
	};
	/* 列表的分页控件 */
	this.pager = new Pager();
	this.pager.pageSize = this.setting.pageSize;
    
	/* 列表的分页初始化 */
	this.init = function(config) {
		this.config = $.extend(null, this.setting, config);
		this.args = $
				.extend(null, this.pager.nextPageParam(), this.config.args);
		var that = this;
		this.getTemplate();
		if (this.config.refreshControl) {
			this.config.refreshControl.click(function() {
				buttonFeedback(this);
				that.refresh();
			});
		}
		this.sdkCompleted = function(d) {
			that.closeLoad();
			if (d) {
				that.data = d; // 将API获取的值，赋予子类对象的data属性，用于加载模板使用
				that.bindToTemplate(); // 绑定模板
			} else {

				console.log("sdkCompleted`s data is null");
				// this.config.parentControl.html("没有更新的微博了");
			}
		};
	};
	this.showLoad = function(){
		this.config.loading =  gm.ngi.msgbox.showLoad("加载中...");
	};
	this.closeLoad = function(){
		this.config.loading && this.config.loading.close();
	};
	/* 实现加载第一页数据，以便MasterPage调用 */
	this.loadFirst = function() {
		this.config.parentControl.html("");
		this.config.delegateFirst(this.args, this.sdkCompleted);
	};
	/* 加载更多数据 */
	this.loadMore = function() {//
		this.showLoad();
		this.args = $.extend(null, this.args, this.pager.nextPageParam());
		this.config.delegateMore(this.args, this.sdkCompleted);
	};
	/* 刷新页面,默认初始化第一页数据 */
	this.refresh = function() {
		this.showLoad();
		this.pager = new Pager();
		this.pager.pageSize = this.setting.pageSize;
		//this.config.parentControl.html("");
		this.config.delegateRefresh(this.pager.nextPageParam(),
				this.sdkCompleted);
	};
	/* 绑定模板 */
	this.bindToTemplate = function() {
		if (this.config.moreControl[0] !== "#") {
			this.config.moreControl.remove();
		}
		var newsItems = Mustache.render(this.template, this.data);
		// this.config.parentControl.append();
		var that = this;

		newsItems = $(newsItems);

		newsItems.css({
			opacity : 0.1
		});
		newsItems.appendTo(this.config.parentControl);

		var firstItem = newsItems[0];

		if(this.config.anchorItemId){
			var anchorItem = document.getElementById(this.config.anchorItemId);
			if(anchorItem){
				anchorItem.scrollIntoView();
				log("anchorItem: " + this.config.anchorItemId);
			}
		}
		else{
			if(firstItem)
			{
				firstItem.scrollIntoView();
			}
		}
		newsItems.animate({
			opacity : 1
		}, 1000);
		if (newsItems[0]) {
			newsItems.die("click");
			newsItems.click(function() {
				that.config.onItemClick($(this));
			});
		}
		var moreItem = this.config.loadMoreString;
		if (firstItem&&moreItem) {
			moreItem = this.config.loadMoreString;
			moreItem = $(moreItem);
			moreItem.appendTo(this.config.parentControl);
			moreItem.bind("click", function() {
				that.loadMore.call(that);
			});
			this.config.moreControl = moreItem;
		}
		var noDataItem = this.config.noDataString;
		if(!firstItem&&noDataItem)
			{
				noDataItem = this.config.noDataString;
				noDataItem = $(noDataItem);
				noDataItem.appendTo(this.config.parentControl);
				this.config.moreControl = noDataItem;
			}
		reInitJsp();
	};
	/* 根据模板名,从模板配置器中加载指定模板 */
	this.getTemplate = function() {
		this.template = this.config.template || "";
		if (this.template == "") {
			this.template = gm.ngi.weibo.app.tm.get(this.config.templateName);
			if (this.template == "") {
				console.log("get template fail.");
			}
		}
	};
};