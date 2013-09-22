$unit.ns("gm.ngi.weibo.postPage");
gm.ngi.weibo.postPage = function() {
	var that=this;
    this.init = function() {
   	 	var dv;
    	var currentLocation={};
    	var tempLocation={};
    	$("#page2").hide();
    	$("#page3").hide();
    	
    	initJsp("listBox2");
    	initJsp("listBox3");
    	
    	var curShowDiv;//关闭键盘后显示的DIV
    	var curTextCon;//指定的输入控件
    	$("#customkeyboard").keyboard({
    		clickCallback:function(){
    			curShowDiv=undefined;
            	curTextCon=undefined;
            	var div1=$("#page1");
            	var div2=$("#page2");
            	var div3=$("#page3");
            	if(!div1.attr("style")||div1.attr("style").indexOf("display: none")==-1)
        		{
            		curShowDiv=div1;
            		curTextCon=$("#txt_content");
        		}
            	if(!div2.attr("style")||div2.attr("style").indexOf("display: none")==-1)
        		{
            		curShowDiv=div2;
        		}            		
            	if(!div3.attr("style")||div3.attr("style").indexOf("display: none")==-1)
            	{
            		curShowDiv=div3;
            		curTextCon=$("#txtSearch");
            	}
            	
            	if(curTextCon)
        		{
            		var text=curTextCon.val();
            		if(text&&$("#T1"))
        			{
            			$("#T1").val(text);
            			$("#T1").focus();
        			}
        		}
            	div1.hide();
            	div2.hide();
            	div3.hide();
    		},
            doneCallback: function (d) {
            	if(curShowDiv)                	
            	{
                	curShowDiv.show();            	
            	}
                else
                {
                	curShowDiv=$("#page1");
                	curShowDiv.show();  
                }
                if(curTextCon)
            	{
                	curTextCon.val(d.target.input[0].value);
                	curTextCon.keyup();
            	}
            },
            EmptyValueCallback: function () {
            	if(curShowDiv)                	
            	{
                	curShowDiv.show();            	
            	}
                else
                {
                	curShowDiv=$("#page1");
                	curShowDiv.show();  
                }
                if(curTextCon)
            	{
                	curTextCon.val("");
                	curTextCon.keyup();
            	}
            },
            returnCallback: function () {
            	//用户点击键盘上"返回按钮"的回调函数
                if(curShowDiv)                	
            	{
                	curShowDiv.show();            	
            	}
                else
                {
                	curShowDiv=$("#page1");
                	curShowDiv.show();  
                }
            }
        });
    	/*
    	keyboardInit({ 
            targetId: "#customkeyboard",//键盘DIV
            clickCallback:function(){//弹出键盘前的操作
            	curShowDiv=undefined;
            	curTextCon=undefined;
            	var div1=$("#page1");
            	var div2=$("#page2");
            	var div3=$("#page3");
            	if(!div1.attr("style")||div1.attr("style").indexOf("display: none")==-1)
        		{
            		curShowDiv=div1;
            		curTextCon=$("#txt_content");
        		}
            	if(!div2.attr("style")||div2.attr("style").indexOf("display: none")==-1)
        		{
            		curShowDiv=div2;
        		}            		
            	if(!div3.attr("style")||div3.attr("style").indexOf("display: none")==-1)
            	{
            		curShowDiv=div3;
            		curTextCon=$("#txtSearch");
            	}
            	
            	if(curTextCon)
        		{
            		var text=curTextCon.val();
            		if(text&&$("#T1"))
        			{
            			$("#T1").val(text);
            			$("#T1").focus();
        			}
        		}
            	div1.hide();
            	div2.hide();
            	div3.hide();
            },
            
            doneCallback: function (d) {//点击键盘确定键后的操作
                if(curShowDiv)                	
            	{
                	curShowDiv.show();            	
            	}
                else
                {
                	curShowDiv=$("#page1");
                	curShowDiv.show();  
                }
                if(curTextCon)
            	{
                	curTextCon.val(d.target.input[0].value);
                	curTextCon.keyup();
            	}
            },
            EmptyValueCallback: function () {
                if(curShowDiv)                	
            	{
                	curShowDiv.show();            	
            	}
                else
                {
                	curShowDiv=$("#page1");
                	curShowDiv.show();  
                }
                if(curTextCon)
            	{
                	curTextCon.val(d.target.input[0].value);
                	curTextCon.keyup();
            	}
            },
            returnCallback: function () {
                //用户点击键盘上"返回按钮"的回调函数
                if(curShowDiv)                	
            	{
                	curShowDiv.show();            	
            	}
                else
                {
                	curShowDiv=$("#page1");
                	curShowDiv.show();  
                }
            }
        });
        */
    	$("#btn_quit").click(function(){
			var time=new Date().getTime();
			location.href = "default.html?isRefresh=1&time="+time;
    	});
    	$("#btn_quit a").click(function(){
    		$("#btn_quit").click();
    	});
    	$("#btn_send").click(function(){
    		var inputBox = $("#alertMsg1");   
    		var textBox=$("#txt_content"); 
    		var max = 140; /*******设置文本区域可输入的最大字数****/
    		var content=textBox.val();
    		var length=gm.ngi.weibo.utils.getTextLength(content);
    		if(length==0)
    			inputBox.html("<span id='used'>请输入微博内容！</span>");
    		else if(length > max)
    		{
    			
    		}
    		else
    		{	
    			gm.ngi.weibosdk.api.iGeo.apiComplete=function(ahr){
    				if(ahr.succeeded&&ahr.data.id)
					{
						var time=new Date().getTime();
						location.href = "default.html?isRefresh=1&time="+time;
					}
    				else
    				{
    					var error = "发布微博出错，错误代码："
							+ ahr.data.error_code;
						if (gm.ngi.weibosdk.ApiError[ahr.data.error_code]) {
							error = gm.ngi.weibosdk.ApiError[ahr.data.error_code];
						}
						gm.ngi.msgbox.show(error);
    				}
    			};
    			gm.ngi.weibosdk.api.iGeo.apiConnectionError = function(
						err) {
					gm.ngi.msgbox.show("哎呀，你的网络好像有点问题，请重试！");
				};
				gm.ngi.weibosdk.api.iGeo.apiServerError = function(
						err) {
					var error = "发布微博出错，错误代码："
							+ err.data.error_code;
					if (gm.ngi.weibosdk.ApiError[err.data.error_code]) {
						error = gm.ngi.weibosdk.ApiError[err.data.error_code];
					}
					gm.ngi.msgbox.show(error);
				};
				
    			gm.ngi.weibosdk.api.iStatus.apiComplete=function(ahr){
    				if(ahr.succeeded)
    					{
    						var time=new Date().getTime();
    						location.href = "default.html?isRefresh=1&time="+time;
    					}
    			};
    			gm.ngi.weibosdk.api.iStatus.apiConnectionError = function(
						err) {
					gm.ngi.msgbox.show("哎呀，你的网络好像有点问题，请重试！");
				};
				gm.ngi.weibosdk.api.iStatus.apiServerError = function(
						err) {
					var error = "发布微博出错，错误代码："
							+ err.data.error_code;
					if (gm.ngi.weibosdk.ApiError[err.data.error_code]) {
						error = gm.ngi.weibosdk.ApiError[err.data.error_code];
					}
					gm.ngi.msgbox.show(error);
				};
				if(that.currentLocation&&that.currentLocation.name)
				{
					gm.ngi.weibosdk.api.iGeo.add_checkin(that.currentLocation.id,content);
				}
				else
				{
					gm.ngi.weibosdk.api.iStatus.update(content);
				}
    		}    		
    	});
    	$("#txt_content").keyup(function(){
    		var inputBox = $("#alertMsg1");   		
    		var max = 140; /*******设置文本区域可输入的最大字数****/
    		var textBox=$("#txt_content"); 
    		var content=textBox.val();
    		var length=gm.ngi.weibo.utils.getTextLength(content);
    		if (length > max)
    		{
    			var con = content.substring(0,max);
    			inputBox.html("已经输入超过<span id='used'>"+(length-max)+"</span>个字");	
    		}
    		else
    			inputBox.html("还可以输入<span id='used'>"+(max-length)+"</span>个字");
    	});
    	$("#btn_quit1").click(function(){
    		$("#page1").show();
    		$("#page2").hide();
    		$("#page3").hide();
    		$("#mainTopDescTitle").innerHTML="";
    		if(that.currentLocation&&that.currentLocation.name)
			{
        		$("#mainTopDescTitle").html(that.currentLocation.name);
			}
    	});
    	$("#btn_quit2").click(function(){
    		$("#page1").show();
    		$("#page2").hide();
    		$("#page3").hide();
    	});
    	$("#btn_refresh1").click(function(){
    		$("#mainTopDesc").click();
    	});
    	$("#mainTopDesc").click(function(){
    		buttonFeedback(this);
			if(that.dv)
			{that.dv.close();}
			that.dv = gm.ngi.msgbox.showLoad("加载中...");
    		$("#page1").hide();
    		$("#page2").show();
    		$("#page3").hide();
    		gm.ngi.weibosdk.api.iGeo.apiComplete=function(ahr){
    			if(that.dv)
    			{that.dv.close();}
				if(ahr.succeeded)
				{
					var data=ahr.data;
					var geo=data.geo;
					$("#ul_locationlist").html("");
					if(data&&data.pois&&data.pois.length>0)
					{
						var newItem = "";
						var maxCount=10;
						for(var p in data.pois)
						{
							var li=data.pois[p];
							if(currentLocation&&currentLocation.name==li.title)
								newItem +=("<li id='li_locationlist_"+li.poiid+"' cnname='"+li.title+"' poi='lat,"+li.lat+",lon,"+li.lon+"' class='listTitle' style='cursor:pointer'>"+li.title+"<span></span></li>");
							else
								newItem +=("<li id='li_locationlist_"+li.poiid+"' cnname='"+li.title+"' poi='lat,"+li.lat+",lon,"+li.lon+"' class='listTitle' style='cursor:pointer'>"+li.title+"</li>");
							maxCount=maxCount-1;
							if(maxCount==0)
								break;
						}
						newItem = $(newItem);
						newItem.appendTo($("#ul_locationlist"));
							
						newItem.bind("click", function() {
							li_location_click($(this));
							});
					}
					else
					{						
						var newItem =("<li cnname='a' poi='lat,0,lon,0' class='listTitle'>当前位置坐标查无相关信息！</li>");
						newItem = $(newItem);
						newItem.appendTo($("#ul_locationlist"));
					}	
				}
				reInitJsp("listBox3");
			};
			gm.ngi.weibosdk.api.iGeo.apiConnectionError = function(
					err) {
				if(that.dv)
    			{that.dv.close();}
				gm.ngi.msgbox.show("哎呀，你的网络好像有点问题，请重试！");
			};
			gm.ngi.weibosdk.api.iGeo.apiServerError = function(
					err) {
				if(that.dv)
    			{that.dv.close();}
				var error = "发布微博出错，错误代码："
						+ err.data.error_code;
				if (gm.ngi.weibosdk.ApiError[err.data.error_code]) {
					error = gm.ngi.weibosdk.ApiError[err.data.error_code];
				}
				gm.ngi.msgbox.show(error);
			};
			gm.ngi.weibo.app.getLocation(function(coords){
				//gm.ngi.weibosdk.api.iGeo.pois(116.30999,39.98);
				gm.ngi.weibosdk.api.iGeo.pois(coords.longitude,coords.latitude);
			});
    	});
    	$("#mainTopI").click(function(){
    		buttonFeedback(this);
    		$("#page1").hide();
    		$("#page2").hide();
    		$("#page3").show();
    		$("#ulUserContainer").html("");
    		loadDefaultMark.call(this);
    	});
    	$("#spnClear").click(function(){
    		if($.trim($("#txtSearch").val())!=""){
    			$("#txtSearch").val("");
    			$("#ulUserContainer").html("");
    			loadDefaultMark.call(this);
    		}
    	})
    	$("#txtSearch").bind("blur",function(){
    		if($(this).prop("placeholder")=="")
    			{
    				$("#txtSearch").prop("placeholder","在联系人中搜索...");
    			}
    	});
    	$("#txtSearch").keyup(function(){
    		var q = $.trim($(this).val());
    		if(q){
    			var maxCount=10;
    			gm.ngi.weibosdk.api.iUser.apiComplete=function(ahr){
    				if(ahr.succeeded&&ahr.data)
    				{
    					if(ahr.data.length>0)
    					{
    						$("#ulUserContainer").html("");
    						var newItem = "";
    						
    						var tmpHtml = "";
    						$.each(ahr.data,function(i,b){
    							tmpHtml +="<li class=\"listTitle\">"+b.nickname+"</li>";
    						});
    						//newItem = $(newItem);
    						//newItem.appendTo($("#ul_locationlist"));
    						var newItems = $(tmpHtml);
    						newItems.appendTo($("#ulUserContainer"));
    						newItems.bind("click", function() {
    								var name=$(this).html();
    								if(gm.ngi.weibo.app.markUserList&&$.inArray(name,gm.ngi.weibo.app.markUserList)==-1){
    									gm.ngi.weibo.app.markUserList.unshift(name);
    									//$.merge(gm.ngi.weibo.app.markUserList, [name]);
    									//$.unique(gm.ngi.weibo.app.markUserList);
    									if(gm.ngi.weibo.app.markUserList.length>=maxCount){
    										gm.ngi.weibo.app.markUserList = gm.ngi.weibo.app.markUserList.slice(0, maxCount);
    									}
    								}
    								else {
    									gm.ngi.weibo.app.markUserList = [name];
    								}
    								//alert(gm.ngi.weibo.app.markUserList[0]);
    								gm.ngi.weibo.dataStorage.setMyMark(gm.ngi.weibo.app.markUserList);
    								selectedMarkClick($(this));
    							});
    					}
    				}
    				reInitJsp("listBox2");
    			};
    			gm.ngi.weibosdk.api.iUser.apiConnectionError = function(
    					err) {
    				gm.ngi.msgbox.show("哎呀，你的网络好像有点问题，请重试！");
    			};
    			gm.ngi.weibosdk.api.iUser.apiServerError = function(
    					err) {
    				var error = "获取关注好友出错，错误代码："
    						+ err.data.error_code;
    				if (gm.ngi.weibosdk.ApiError[err.data.error_code]) {
    					error = gm.ngi.weibosdk.ApiError[err.data.error_code];
    				}
    				gm.ngi.msgbox.show(error);
    			};
    			gm.ngi.weibosdk.api.iUser.suggestUsers(q,maxCount);
    		}
    	});
    };
    function li_location_click(item){

    	var id=item.attr("id");
    	var name=item.attr("cnname");
    	var poi=item.attr("poi");
		id=id.substring(id.lastIndexOf("_")+1);
		tempLocation={
				id:id,
				name:name,
				poi:poi
		};
		var list=$("#ul_locationlist").children(".listTitle");
		if(list&&list.length>0)
		{
			for(var p in list)
			{
				if(!list[p]||!list[p].innerHTML)
					continue;
				list[p].innerHTML=list[p].innerHTML.replace("<span></span>","");
				if(list[p].innerHTML==name)
				{
					list[p].innerHTML=list[p].innerHTML+"<span></span>";
				}
			}
		}
		that.currentLocation=tempLocation;
		$("#btn_quit1").click();
    };
    function loadDefaultMark(){
    	var nowList = gm.ngi.weibo.app.markUserList;
		if (nowList && nowList.length > 0) {
			var tmpHtml = "";
			$.each(nowList,function(i,b){
				tmpHtml+="<li class=\"listTitle\">" +b+"</li>";
			})
			if(tmpHtml!=""){
				var newItems = $(tmpHtml);
				newItems.appendTo($("#ulUserContainer"));
				newItems.bind("click", function() {
					selectedMarkClick($(this));
				});
				newItems.appendTo($("#ulUserContainer"));
			}
		}
		
		gm.ngi.weibosdk.api.iRelation.apiComplete=function(ahr){
			if(ahr.succeeded&&ahr.data)
			{
				$("#li_next_cursor").remove();
				var tmpHtml = "";
				$.each(ahr.data.users,function(i,b){
					tmpHtml+="<li class=\"listTitle\">" +b.name+"</li>";
				})
				if(ahr.data.next_cursor!=0)
				{tmpHtml+="<li id=\"li_next_cursor\" class=\"listTitle\" next_cursor="+ahr.data.next_cursor+" class=\"moreBox22\">更多好友>></li>";}
				if(tmpHtml!=""){
					var newItems = $(tmpHtml);
					newItems.appendTo($("#ulUserContainer"));
					newItems.bind("click", function() {
						selectedMarkClick($(this));
					});
					newItems.appendTo($("#ulUserContainer"));
				}
			}
			reInitJsp("listBox2");
		};
		gm.ngi.weibosdk.api.iRelation.apiConnectionError = function(
				err) {
			gm.ngi.msgbox.show("哎呀，你的网络好像有点问题，请重试！");
		};
		gm.ngi.weibosdk.api.iRelation.apiServerError = function(
				err) {
			var error = "获取关注好友出错，错误代码："
					+ err.data.error_code;
			if (gm.ngi.weibosdk.ApiError[err.data.error_code]) {
				error = gm.ngi.weibosdk.ApiError[err.data.error_code];
			}
			gm.ngi.msgbox.show(error);
		};
		var user = gm.ngi.weibo.dataStorage.getCurrentUser();
		var pageArgs={uid:user.id,count :20,cursor:0,trim_status:0};
		gm.ngi.weibosdk.api.iRelation.friends(pageArgs);
    }
    function selectedMarkClick(n){
    	var next=n.attr("next_cursor");
    	if(!next)
    	{
    		n=n.html();
	    	$("#txt_content").val($("#txt_content").val()+"@" + n +" ");
	    	$("#txt_content").keyup();
			$("#txt_content").focus();
			$("#page1").show();
			$("#page2").hide();
			$("#page3").hide();
    	}
    	else
    	{
    		var user = gm.ngi.weibo.dataStorage.getCurrentUser();
    		var pageArgs={uid:user.id,count :20,cursor:next,trim_status:0};
    		gm.ngi.weibosdk.api.iRelation.friends(pageArgs);
    	}	
    }
};
initPage = function() {
    new gm.ngi.weibo.postPage().init();
};
