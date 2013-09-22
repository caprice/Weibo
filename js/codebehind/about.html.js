$unit.ns("gm.ngi.weibo.aboutPage");
gm.ngi.weibo.aboutPage = function() {
    this.init = function() {
        $("#lnkReturn").click(function() {
        	history.back();
        });
    };
};
initPage = function() {
    new gm.ngi.weibo.aboutPage().init();
};
