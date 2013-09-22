$unit.ns("gm.ngi.weibo.CommentListPage");
var defaultJspPanelId = "listBox";

gm.ngi.weibo.CommentListPage = function() {
    this.init = function() {
        //TODO:页面上控件的绑定
        console.log("CommentListPage left load");
        var commentList = new gm.ngi.control.CommentListControl({
            parentControl: $("#content")
        });

        gm.ngi.weibo.app.Master.init([commentList]);
        console.log(" CommentListPage load controls completed");
        $("#lnkReturn").click(function() {
        	var id=pageParams.id;
    		var reurl = pageParams.reurl;
			if(reurl)
			{
				location.href=reurl;
				return;
			}
			var time=new Date().getTime();
			location.href = "statusdetail.html?id="+id+"&isRefresh=1&time="+time;
        });
        $("#lnkPostComment").click(function() {
        	location.href = "postcomment.html?" + $.param(pageParams);
        	//location.href = "postcomment.html?id=" + pageParams.id;
        });
        //$("#").click(function() { });
    };
};
initPage = function() {
    new gm.ngi.weibo.CommentListPage().init();
};
