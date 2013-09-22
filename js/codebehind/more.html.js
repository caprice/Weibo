$unit.ns("gm.ngi.weibo.MorePage");
gm.ngi.weibo.MorePage = function() {

    this.init = function() {
        $("#lnkLoginOut").click(function() {
            gm.ngi.weibo.app.logout();
        });
        //TODO:页面上控件的绑定
        var leftStatus = new gm.ngi.control.LeftControl({
            parentControl: $("#leftBox"),
            focus: 3
        });
        gm.ngi.weibo.app.Master.init([leftStatus]);

    };
};
initPage = function() {
    new gm.ngi.weibo.MorePage().init();
};
