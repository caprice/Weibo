$unit.ns('gm.ngi.weibo.carModeChannelPage');
gm.ngi.weibo.carModeChannelPage = function() {

  this.init = function() {

  };

  this.pageJump = function(page) {
    window.location.href = 'car_mode_home.html?channel=' + page;
  };

  this.jumpToNormal = function() {
    window.location.href = "default.html";
  };

  this.closeApp = function() {
    gm.ngi.weibo.app.logout();
    gm.system.closeApp(function() {
      
    });
  };
};

var carModeChannel;

initPage = function() {
  carModeChannel = new gm.ngi.weibo.carModeChannelPage();
  carModeChannel.init();
};