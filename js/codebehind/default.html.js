$unit.ns("gm.ngi.weibo.defaultPage");
var defaultJspPanelId = "listBox";

gm.ngi.weibo.defaultPage = function() {
	
	this.init = function() {

		console.log("tm load");
		var headStatus = new gm.ngi.control.HeadControl({
			parentControl : $("#bottomBox"),
			user : gm.ngi.weibo.app.currentUser
		});
		console.log("hs load");
		var leftStatus = new gm.ngi.control.LeftControl({
			parentControl : $("#leftBox"),
			focus:1
		});
		console.log("left load");
		var friendStatus = new gm.ngi.control.FriendStatusControl({
			parentControl : $("#content"),
			refreshControl:$("#lnkRefresh")
		});
		console.log("friend load");
		gm.ngi.weibo.app.Master.init([headStatus, leftStatus, friendStatus]);
		console.log("load controls completed");
		
		$("#lnkForword").click(function(){
			buttonFeedback(this);
			$player.onForwardClicked();
		});
		$("#lnkPlay").click(function(){
			buttonFeedback(this);
			$player.onPlayButtonClicked();
		});
		
	};

};

initPage = function(){
	
	new gm.ngi.weibo.defaultPage().init();
	$player.groupId = pageParams.id;

};

$player = {
		isPlaying: false,
		currentItemId: 0, 
		statuses: [],
		groupId: -1, 
		ttsHandle: -1,
		textHandler: new gm.ngi.weibo.TTSTextHandler() 
	};

$player.onForwardClicked = function(){
	$player.scrollToNextItem();
	if($player.isPlaying){
		// TODO
	}
};

$player.onPlayButtonClicked = function(){
	$player.loadStatuses();
	$player.showTTSText();
//	if ($player.isPlaying){
//		$player.stop();
//	}else{
//		$player.play();
//	}
};

$player.showTTSText = function() {
	var currentId = this.getCurrentItemId();
	var status = this.getStatus(currentId);
	var text = this.textHandler.splice(status);
	// var text =
	// '#每周读书#《中国创投20年》：创业板、越洋VC的中国布局、谁是第一家进入中国的VC、西都俱乐部与"抱团取暖”.......想了解中国创投史及发展现状的请点击：http://t.cn/zOajlmQ
	// 陈友忠、刘曼红、廖俊霞著。更多好书点击：http://t.cn/SUTmTX';
	var msgBox = new gm.ngi.Dialog.TTS({
		content : text
	}, {
		interval : 30000
	});
	msgBox.setClickEnable(1);
};

$player.play = function(){
	log("play");
	this.isPlaying = true;
	this.loadStatuses();
};

$player.stop = function(){
	log("stop");
	this.isPlaying = false;
};

$player.startTTS = function(text, callback){
	gm.voice.startTTS(onTTSCompleted, null, "tts started");
	
	function showText(){
		
	}
	function onTTSCompleted(){
		
	}
};

$player.stopTTS = function(){
	
};

/*
 * 取当前屏幕可见的第一条微博的Id
 */
$player.getCurrentItemId = function(d) {
	var api = $("#listBox").data("jsp");
	var contentPosition = api.getContentPositionY();

	var parntControl = d || $("#listBox");
	var items = parntControl.find(".oneInLine");
	var item = items[0];
	if (item) {
		if (contentPosition === 0) {
			return $(item).attr("itemid");
		}
		var j = items.length;
		for ( var i = 0; i < j; i++) {
			item = $(items[i]);
			if (item.position().top >= contentPosition) {
				return item.attr("itemid");
			}
		}
		return $(item).attr("itemid");
	}
	return -1;
};

/*
 * 取当前屏幕可见的第一条微博的下一条微博Id
 */
$player.getNextItemId = function(d){

	var currentID = this.getCurrentItemId(d);
	if (currentID < 0){return -1;}
	
	var item = $("#item_" + currentID);
	if (!item){return -1;}
	
	var nextItem = item.next();
	if (!nextItem || nextItem[0].tagName != item[0].tagName) {return -1;}

	return $(nextItem).attr("itemid");
};

/*
 * 如果有下一条微博，那么将其向上滚动成为第一条可见微博
 */
$player.scrollToNextItem = function(d){
	var nextId = this.getNextItemId(d);
	if (!nextId || nextId < 0) {return;}
	
	var nextItem = $("#item_" + nextId);
	var api = $("#listBox").data("jsp");
	api.scrollToElement(nextItem, true, true);
};

$player.loadStatuses = function(){
	var cacheKey;
	if (!this.groupId) {
		cacheKey = gm.ngi.weibo.dataStorage.storageKeys.HomeStatuses;
	}else{
		if (this.groupId == "-1"){
			cacheKey = gm.ngi.weibo.dataStorage.storageKeys.MyStatuses;
		}
		else{
			cacheKey = gm.ngi.weibo.dataStorage.storageKeys.HomeStatuses + "_" + id;
		}
	} 
		
	var cacheData = gm.ngi.weibo.dataStorage.readObject(cacheKey);
	if(cacheData){
		this.statuses = cacheData.statuses;
	}else{
		this.statuses = [];
	}
};

$player.getStatus = function(statusId){
	if (!this.statuses || this.statuses.length == 0){
		return null;
	}
	var i = 0;
	for (i=0; i<this.statuses.length; i++){
		if(this.statuses[i].id == statusId){
			return this.statuses[i];
		}
	}
	return null;
};


