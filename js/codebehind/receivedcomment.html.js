$unit.ns("gm.ngi.weibo.ReceivedCommentPage");
var defaultJspPanelId = "listBox";
gm.ngi.weibo.ReceivedCommentPage = function() {
    this.init = function() {
        //TODO:页面上控件的绑定
        var leftStatus = new gm.ngi.control.LeftControl({
            parentControl: $("#leftBox"),
            focus: 2
        });
        console.log("receivedCommentPage left load");
        var receivedComment = new gm.ngi.control.ReceivedCommentControl({
            parentControl: $("#content")
        });
        $("#bottonRefresh2").click(function() {
        	var url=location.href;
        	if(url.indexOf("isRefresh")==-1)
        	{
        		if(url.indexOf("?")==-1)
        			url=url+"?isRefresh=1";
        		else
        			url=url+"&isRefresh=1";
        	}
        	location.href=url;
        });
        gm.ngi.weibo.app.Master.init([leftStatus, receivedComment]);
        console.log(" receivedCommentPage load controls completed");
    };
};
initPage = function() {
new gm.ngi.weibo.ReceivedCommentPage().init();
};
