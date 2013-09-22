/*
 * 分组菜单栏列表
 * 此页面包含两部分菜单栏:上半部分固定,下半部分由服务器数据构成：
 * 	outer:含好友微博,和我的微博
 * 	inner:含自定义的分组微博
 * */
$unit.ns("gm.ngi.Dialog.MyGroup");
gm.ngi.Dialog.MyGroup = function(option) {
	this.setting = {
//		outer : '<span class="columnList" id="dvMyGroups" style="display:none"><a href="default.html">{1}</a><a href="default.html?id=-1&n=%E6%88%91%E7%9A%84%E5%BE%AE%E5%8D%9A&reurl=default.html%3Fid%3D-1%26n%3D%25E6%2588%2591%25E7%259A%2584%25E5%25BE%25AE%25E5%258D%259A">我的微博</a><a href="default.html?id=-2&n=%E5%91%A8%E8%BE%B9%E5%BE%AE%E5%8D%9A&reurl=default.html%3Fid%3D-2%26n%3D%25E5%2591%25A8%25E8%25BE%25B9%25E5%25BE%25AE%25E5%258D%259A">周边微博</a>{0}</span>',
		outer :'<ul id="userGroup"><li href="default.html">{1}</li><li href="default.html?id=-1&n=%E6%88%91%E7%9A%84%E5%BE%AE%E5%8D%9A&reurl=default.html%3Fid%3D-1%26n%3D%25E6%2588%2591%25E7%259A%2584%25E5%25BE%25AE%25E5%258D%259A">我的微博</li><li href="default.html?id=-2&n=%E5%91%A8%E8%BE%B9%E5%BE%AE%E5%8D%9A&reurl=default.html%3Fid%3D-2%26n%3D%25E5%2591%25A8%25E8%25BE%25B9%25E5%25BE%25AE%25E5%258D%259A">周边微博</li>{0}</ul>',
		top : '',
		inner : '<li href="{1}">{0}</li>'
	};
	this.show = function() {
		if(this.container)
			{
				this.container.show("fast", function(){reInitJsp("leftList");});
			}
	};
	this.close = function() {
		if(this.container)
		{
			this.container.hide("fast");
		}
	};
	this.container = $("#leftList");
	var that = this;
	this.sdkCompleted = function(d) {
		if (d && d.succeeded && d.data) {
			that.callback(d.data);
		}
	};
	this.callback = function(data)
	{
		var str = "";
		for ( var i = 0; i < data.lists.length; i++) {
			var postParam = {id: data.lists[i].idstr, n: data.lists[i].name,reurl:"default.html?id="+data.lists[i].idstr+"&n="+encodeURIComponent(data.lists[i].name)};
			var url="default.html?" + $.param(postParam);
			str += $unit.format(that.setting.inner, data.lists[i].name,url);
		}
		that.setting.outer = $unit.format(that.setting.outer, str,option.userName);
		that.panel = $(that.setting.outer);
		if (data.lists.length >= 6) {
			//出现滚动条
//			that.panel.filter("#dvMyGroups").css({
//				'height' : '360px','overflow-y':'scroll'
//			});
		}
		that.container.append(that.panel);
		that.panel.find("li").click(function(){
			var item = $(this);
			location.href = item.attr("href");
		});
		initJsp("leftList");
	};
	this.init = function(option) {
		var groups= gm.ngi.weibo.dataStorage.getFriendGroups();
		if(groups&&groups.lists&&groups.lists.length>0)
			that.callback(groups);
		else
		{
			gm.ngi.weibosdk.api.iRelation.apiComplete = this.sdkCompleted;
			gm.ngi.weibosdk.api.iRelation.groups();
		}
	};

};
