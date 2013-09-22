$unit.ns("gm.ngi.weibo.postPage");
gm.ngi.weibo.postPage = function() {
    this.init = function() {
    	var curShowDiv;//关闭键盘后显示的DIV
    	var curTextCon;//指定的输入控件
    	$("#customkeyboard").keyboard({
    		clickCallback:function(){
    			curShowDiv=undefined;
            	curTextCon=undefined;
            	var div1=$("#page1");
            	if(!div1.attr("style")||div1.attr("style").indexOf("display: none")==-1)
        		{
            		curShowDiv=div1;
            		curTextCon=$("#txt_content");
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
            	if(!div1.attr("style")||div1.attr("style").indexOf("display: none")==-1)
        		{
            		curShowDiv=div1;
            		curTextCon=$("#txt_content");
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
    	var checkLength=function()
    	{
    		var inputBox = $("#alertMsg");   		
    		var max = 140; /*******设置文本区域可输入的最大字数****/
    		var textBox=$("#txt_content"); 
    		var content=textBox.val();
    		var length=gm.ngi.weibo.utils.getTextLength(content);
    		if (length > max)
    		{
    			inputBox.html("已经输入超过<span id='used'>"+(length-max)+"</span>个字");	
    		}
    		else
    			inputBox.html("还可以输入<span id='used'>"+(max-length)+"</span>个字");
    	};
    	
    	$("#txt_content").val(unescape(pageParams.content));
    	if($("#txt_content").val()!="")
    	{
    		//$("#txt_content").focus();
    		checkLength();
    	}
    	$("#btn_quit").click(function(){
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
    	$("#btn_send").click(function(){
    		var id=pageParams.id; 
    		var textBox=$("#txt_content"); 
    		var max = 140; /*******设置文本区域可输入的最大字数****/
    		var content=textBox.val();
    		var length=gm.ngi.weibo.utils.getTextLength(content);
    		if(length > max)
    		{
    			
    		}
    		else
    		{	
    			gm.ngi.weibosdk.api.iStatus.apiComplete=function(ahr){
    				if(ahr.succeeded)
    					{
    						var data=ahr.data;
    						var id=pageParams.id;
    			    		var reurl = pageParams.reurl;
    						if(reurl)
    						{
    							location.href=reurl;
    							return;
    						}
    						var time=new Date().getTime();
    						location.href = "statusdetail.html?id="+id+"&isRefresh=1&time="+time;
    						//location.href = "default.html?isRefresh=1&time="+time;
    					}
    				else
    					{
    						//alert(ahr.errorMessage);
    					}
    			};
    			gm.ngi.weibosdk.api.iStatus.apiConnectionError = function(
						err) {
					gm.ngi.msgbox.show("哎呀，你的网络好像有点问题，请重试！");
				};
				gm.ngi.weibosdk.api.iStatus.apiServerError = function(
						err) {
					var error = "转发微博出错，错误代码："
							+ err.data.error_code;
					if (gm.ngi.weibosdk.ApiError[err.data.error_code]) {
						error = gm.ngi.weibosdk.ApiError[err.data.error_code];
					}
					gm.ngi.msgbox.show(error);
				};
    			if(length==0)
    				gm.ngi.weibosdk.api.iStatus.repost(id,content,0);
    			else
    				gm.ngi.weibosdk.api.iStatus.repost(id,content,1);
    		}    		
    	});
    	$("#txt_content").keyup(checkLength);
    	//$("#txt_content").focus();
    };
};
initPage = function() {
    new gm.ngi.weibo.postPage().init();
};
