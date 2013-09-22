initPage = function() {
	$(document).ready(function() {
		setInterval(function() {
			gm.ngi.weibo.app.navigateToCarChannelPage();
			clearInterval();
		}, 1000);
	});
};
