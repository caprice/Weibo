$unit.ns('gm.ngi.weibo.carModeHomePage');

var carModeHome;
var channel = '';
var dataFetchType = 'normal';
var weiboDataList = [];
var refreshDataList = [];
var moreDataList = [];
var playPosition = 0;
var since_id = 0;
var max_id = 0;
var ttsID = 0;
var btnLog;
var pauseBtnClicked = false;
var duration = 1;
// ******************tts and asr*******************
var deviceId = '57349abd2390';
var ttsUrl = 'http://tts.hivoice.cn/tts/tts';
var asrUrl = 'http://api.hivoice.cn:80/USCService/WebApi';
var asrAppId = 'uf6tdl24igd5micxxdylhrhd5r7jd6dfzhji63ii';
var asrUserId = 'dancindream';
var dataType = 'audio/x-wav;codec=pcm;bit=16;rate=16000';
var audio;
var weiboText;
var loadingDialog;
var audioLoadingDialog;
var commandRecognizeLoadingDialog;

var speechRecSessionID;
var filePath;
var ttsStart = "";
// ******************tts and asr*******************

var playBtn = document.getElementById('play_btn');
var pauseBtn = document.getElementById('pause_btn');
var progressBarLine = document.getElementById('progress_bar_line');
var logDiv = document.getElementById('log_div');
var btnLog = document.getElementById('btn_log');
var time_display = document.getElementById('time_display');

gm.ngi.weibo.carModeHomePage = function() {
  var pageArgs = {
    page : 1,
    count : 20,
    since_id : 0,
    max_id : 0
  };
  
  var groupMap = {
    science : '3550623775922822',
    sports : '3550623616513524',
    news : '3550623394179181',
    business : '3550623532399732',
    recreation : '3550623716976204'
  };
  
  this.init = function() {
    var channelParam = window.location.search;
    console.log(channelParam);
    var params = channelParam.split('=');
    channel = params[1];
    this.loadData(channel);
  };
  
  this.loadData = function(channel) {
    audio = null;
    weiboText = null;
    document.getElementById("channel_icon").src = "images/carmode/icon_"
        + channel + ".png";
    this.getWeiboData();
  };
  
  this.closeApp = function() {
    gm.ngi.weibo.app.logout();
    gm.system.closeApp(function() {
      
    });
  };
  
  parseWeibo = function(weibo) {
    var toRead = '';
    var user = weibo.user;
    if (user) {
      toRead += (user.screen_name ? user.screen_name : user.name) + ',发表微博：';
    }
    // parse http url to whitespace
    var pattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var tmpText = weibo.text;
    var flag = tmpText.indexOf('http') >= 0;
    if (flag) {
      tmpText = tmpText.replace(pattern, ' ');
    }
    toRead += tmpText;
    console.log('parse text:' + toRead);
    return toRead;
  };
  
  var startTTS = function(args) {
    if (args) {
      args = ttsStart + args;
    }
    startHttpTTS_Y(args);
  };
  
  playNextWeibo = function() {
    weiboText = null;
    playPosition++;
    if (playPosition >= weiboDataList.length - 1) {
      console.log('已经是最后一条微博了');
      playPosition = weiboDataList.length - 1;
      moreData();
      return;
    } else {
      audio.pause();
      audio = null;
    }
    playWeibo();
  };
  
  var playMP3 = function(url) {
    
    audio = document.createElement('audio');
    audio.setAttribute('src', url);
    audio.addEventListener('loadstart', function(arg) {
      console.log('load start');
    });
    audio.addEventListener('loadeddata', function(arg) {
      console.log('loaded data');
      audioLoadingDialog.close();
      audio.play();
      startAnimation();
    });
    audio
        .addEventListener(
            'timeupdate',
            function(arg) {
              if (progressBarLine && progressBarLine.style) {
                progressBarLine.style.width = parseInt(500 * (audio['currentTime'] / audio['duration']))
                    + 'px';
                time_display.innerHTML = audio['currentTime'].toFixed(2) + '/'
                    + audio['duration'].toFixed(2);
              }
            });
    audio.addEventListener('pause', function(arg) {
      logDiv.innerHTML += 'audio paused ,pauseBtnClicked:' + pauseBtnClicked
          + '<br>';
      if (!pauseBtnClicked) {
        console.log('play end');
        stopAnimation();
        playNextWeibo();
      }
    });
    audio.load();
  };
  
  var startHttpTTS_K = function(text) {
    if (null != audio && audio.played) {
      audio.play();
      return;
    }
    var url = "http://180.168.173.133:80/NGIServer/ttsUpload";
    var method = "POST";
    var iflyClient = new XMLHttpRequest();
    iflyClient.onload = function(e) {
      if (this.status == 200) {
        console.log("request iflytek tts success");
        logDiv.innerHTML += "request iflytek tts success <br>";
        var responseText = iflyClient['responseText'];
        var response = eval("(" + responseText + ")");
        var playUrl = response['responseUrl'];
        console.log("playUrl:" + playUrl);
        playMP3(playUrl);
      } else {
        console.log("request iflytek tts failure");
        logDiv.innerHTML += "request iflytek tts failure <br>";
      }
    };
    iflyClient.open(method, url, true);
    iflyClient.setRequestHeader("Content-type",
        "application/x-www-form-urlencoded");
    iflyClient.send('ttsContent=' + text);
  };
  
  var startHttpTTS_Y = function(text) {
	    if (null != audio && audio.played) {
	      audio.play();
	      return;
	    }
	    // add twenty spaces for test
	    if (text) {
	      text = ttsStart + text;
	    }
	    console.log('text weibo:' + text);
	    var url = sprintf('%s?appkey=%s&userid=%s&id=%s', ttsUrl, asrAppId,
	        asrUserId, deviceId);
	    var enStr = sprintf('&type=0&speed=1.0&message=%s',
	        encodeURIComponent(text));
	    url = url + enStr;
	    console.log('url:' + url);
	    playMP3(url);
	  };
  
  startPlay = function(playText) {
    startTTS(playText);
  };
  
  stopPlay = function() {
    audio.pause();
  };
  
  showPauseBtn = function() {
    pauseBtnClicked = false;
    startAnimation();
    pauseBtn.style.display = 'inline';
    playBtn.style.display = 'none';
  };
  
  showPlayButton = function() {
    pauseBtnClicked = true;
    stopAnimation();
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'inline';
  };
  
  playWeibo = function() {
    logDiv.innerHTML += 'playPosition:' + playPosition + '<br>';
    console.log('playPosition:' + playPosition);
    showPauseBtn();
    if (audio && playPosition == 0) {
      startPlay(weiboText);
      return;
    }
    if (!weiboText) {
      audioLoadingDialog = gm.ngi.msgbox.showLoad("音频加载中...");
      weiboText = parseWeibo(weiboDataList[playPosition]);
    }
    startPlay(weiboText);
  };
  
  clearData = function() {
    refreshDataList.length = 0;
    moreDataList.length = 0;
  };
  
  checkData = function(data) {
    if (data) {
      if (data.total_number <= 0) {
        alert('没有数据');
      } else {
        clearData();
        if ('normal' == dataFetchType) {
          weiboDataList = data.statuses;
          playPosition = 0;
        } else if ('refresh' == dataFetchType) {
          refreshDataList = data.statuses;
          console.log('refreshDataList.size:' + refreshDataList.length);
          if (refreshDataList.length > 0) {
            refreshDataList = refreshDataList.reverse();
            for ( var item in refreshDataList) {
              weiboDataList.unshift(refreshDataList[item]);
            }
            playPosition = 0;
          }
        } else if ('more' == dataFetchType) {
          moreDataList = data.statuses;
          if (moreDataList.length > 0) {
            moreDataList = moreDataList.slice(1, moreDataList.length - 1);
            console.log('moreDataList.size:' + moreDataList.length);
            playPosition = weiboDataList.length;
            for ( var item in moreDataList) {
              weiboDataList.push(moreDataList[item]);
            }
          }
        }
        console.log('dataFetchType:' + dataFetchType + ',weiboDataList.size:'
            + weiboDataList.length);
        playWeibo();
      }
    }
  };
  
  doRequest = function(pageArgs, groupId) {
    console.log('channel:' + channel + ',groupId:' + groupId);
    if (groupId) {
      gm.ngi.weibosdk.api.iStatus.group_timeline(pageArgs, groupId);
    } else {
      gm.ngi.weibosdk.api.iStatus.friends_timeline(pageArgs);
    }
  };
  
  this.getWeiboData = function() {
    loadingDialog = gm.ngi.msgbox.showLoad("数据加载中...");
    console.log('since_id:' + since_id + ',max_id:' + max_id);
    pageArgs.since_id = since_id;
    pageArgs.max_id = max_id;
    if (!(channel in groupMap)) {
      doRequest(pageArgs);
    } else {
      doRequest(pageArgs, groupMap[channel]);
    }
    gm.ngi.weibosdk.api.iStatus.apiComplete = function(d) {
      if (d.succeeded) {
        loadingDialog.close();
        checkData(d.data);
      }
    };
  };
  
  refreshData = function() {
    if (weiboDataList && weiboDataList.length > 0) {
      dataFetchType = 'refresh';
      since_id = weiboDataList[0].id;
      max_id = 0;
      console.log(dataFetchType + ',' + since_id + ',' + max_id);
      carModeHome.getWeiboData();
    }
  };
  
  moreData = function() {
    if (weiboDataList && weiboDataList.length > 0) {
      dataFetchType = 'more';
      since_id = 0;
      max_id = weiboDataList[weiboDataList.length - 1].id;
      carModeHome.getWeiboData();
    }
  };
  
  this.doPause = function() {
    showPlayButton();
    stopPlay();
  };
  
  this.voiceActive = function() {
    playStartSound();
    this.doPause();
  };
  
  this.helpActive = function() {
    alert('active help');
  };
  
  this.channelActive = function() {
    window.location.href = 'car_mode_channel.html';
  };
  
  this.jumpToNormal = function() {
    window.location.href = "default.html";
  };
  
  playPreviousWeibo = function() {
    weiboText = null;
    playPosition--;
    if (playPosition < 0) {
      console.log('已经是第一条微博了');
      playPosition = 0;
      return;
    } else {
      audio.pause();
      audio = null;
    }
    playWeibo();
  };
  
  this.doPrevious = function() {
    playPreviousWeibo();
  };
  
  this.doPlay = function() {
    showPauseBtn();
    playWeibo();
  };
  
  this.doNext = function() {
    playNextWeibo();
  };
};

initPage = function() {
  carModeHome = new gm.ngi.weibo.carModeHomePage();
  console.log('carModeHome:' + carModeHome);
  carModeHome.init();
};

function startSpeechSession() {
  speechRecSessionID = gm.voice.startSpeechRecSession(function() {
    logDiv.innerHTML += 'Success: startSpeechRecSession. <br>';
    console.log('Success: startSpeechRecSession.');
  }, function() {
    logDiv.innerHTML += 'Failure: startSpeechRecSession. <br>';
    console.log('Failure: startSpeechRecSession.');
  });
}

/*
 * function startSpeechSession() { console.log('create new speechRecSessionID');
 * speechRecSessionID = gm.voice.startSpeechRecSession(function() {
 * console.log('Success: startSpeechRecSession.'); }, function() {
 * console.log('Failure: startSpeechRecSession.'); });
 * console.log('speechRecSessionID:' + speechRecSessionID); }
 */

function startRecording() {
  gm.voice.startRecording(function(responseObj) {
    playSuccessSound();
    logDiv.innerHTML += ('Success: startRecording,' + responseObj + '. <br>');
    var index = responseObj.indexOf('data');
    if (index >= 0) {
      filePath = responseObj.substring(index);
    } else {
      filePath = 'data/' + responseObj;
    }
    setTimeout(uploadFile, 200);
    logDiv.innerHTML += ('filePath:' + filePath + '. <br>');
    console.log('Success: startRecording.');
  }, function() {
    logDiv.innerHTML += 'Failure: startRecording. <br>';
    console.log('Failure: startRecording.');
  }, {
    intro : 0,
    // intro : "please input your voice",
    silenceDetection : true,
    silenceLength : 1000,
    maxRecordingWindow : 5000,
    noiseSuppression : 0
  });
}

/*
 * function startRecording() { gm.voice.startRecording(function(responseObj) {
 * playSuccessSound(); var index = responseObj.indexOf('data'); if (index >= 0) {
 * filePath = responseObj.substring(index); } else { filePath = 'data/' +
 * responseObj; } setTimeout(uploadFile, 200); console.log('Success:
 * startRecording.'); }, function() { console.log('Failure: startRecording.'); }, {
 * silenceDetection : true, silenceLength : 1000, maxRecordingWindow : 5000,
 * noiseSuppression : 0 }); }
 */

function playSuccessSound() {
  var tmpAudio = document.createElement('audio');
  tmpAudio.setAttribute('src', 'success.wav');
  tmpAudio.play();
}

function stopSpeechSession() {
  console.log('stopSpeechSession:' + speechRecSessionID);
  gm.voice.stopSpeechRecSession(speechRecSessionID);
}


function stopRecording() {
  gm.voice.stopRecording(
    function(dataPath) {
      logDiv.innerHTML += ('Success: stopRecording. Path: ' + dataPath + '<br>');
      console.log('Success: stopRecording. Path: ' + dataPath);
    },
    function() {
      logDiv.innerHTML += 'Failure: stopRecording. <br>';
      console.log('Failure: stopRecording.');
    }, speechRecSessionID
);
  stopSpeechSession();
}


/*function stopRecording() {
  gm.voice.stopRecording(function(dataPath) {
    console.log('Success: stopRecording. Path: ' + dataPath);
  }, function() {
    console.log('Failure: stopRecording.');
  }, speechRecSessionID);
  stopSpeechSession();
}*/

function uploadFile() {
  commandRecognizeLoadingDialog = gm.ngi.msgbox.showLoad("语音指令识别中...");
  var href = window.location.href;
  var appRootUrl = href.substr(0, href.lastIndexOf("index"));
  var file = appRootUrl + filePath;
  GetBinaryFile(file, fnCallback);
}

function srParseString(args) {
  var finalResult = args.replace(/<\/s>/g, ",");
  finalResult = finalResult.replace(/<s>/g, "");
  console.log('finalResult:' + finalResult);
  return finalResult;
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  var val = "";
  for ( var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = (str.charCodeAt(i)) & 0xFF;
  }
  return buf;
}

function playStartSound() {
  startSpeechSession();
  var tmpAudio = document.createElement('audio');
  tmpAudio.setAttribute('src', 'voicestart.wav');
  tmpAudio.play();
  setTimeout(startRecording, 1000);
}

function fnCallback(objBinaryFile) {
  if (objBinaryFile) {
    var data = str2ab(objBinaryFile['Content']);
    var audioLength = objBinaryFile['ContentLength'];
    var method = 'POST';
    var url = sprintf('%s?appkey=%s&userid=%s&id=%s', asrUrl, asrAppId,
        asrUserId, deviceId);
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        commandRecognizeLoadingDialog.close();
        stopRecording();
        var result = http.responseText;
        result = srParseString(result);
        voiceCommandRecognize(result);
        console.log('result:' + result);
      } else {
        console.log('识别中，请稍后:' + http.statusText + '.<br>');
      }
    };
    http.open(method, url, true);
    http.setRequestHeader("Content-type", dataType);
    http.setRequestHeader("Content-length", audioLength);
    http.setRequestHeader("Accept-Language", "zh_CN");
    http.setRequestHeader("Accept-Topic", "general");
    http.send(data);
  } else {
    console.log('识别中，请稍后.<br>');
  }
}

function voiceCommandRecognize(result) {
  if (!result)
    return;
  if (result.indexOf('下一条') >= 0) {
    carModeHome.doNext();
  } else if (result.indexOf('上一条') >= 0) {
    carModeHome.doPrevious();
  } else if (result.indexOf('全部') >= 0) {
    carModeHome.loadData('all');
  } else if (result.indexOf('热门') >= 0) {
    carModeHome.loadData('hot');
  } else if (result.indexOf('朋友') >= 0) {
    carModeHome.loadData('friend');
  } else if (result.indexOf('科技') >= 0) {
    carModeHome.loadData('science');
  } else if (result.indexOf('体育') >= 0) {
    carModeHome.loadData('sports');
  } else if (result.indexOf('周边') >= 0) {
    carModeHome.loadData('nearby');
  } else if (result.indexOf('新闻') >= 0) {
    carModeHome.loadData('news');
  } else if (result.indexOf('商业') >= 0) {
    carModeHome.loadData('business');
  } else if (result.indexOf('娱乐') >= 0) {
    carModeHome.loadData('recreation');
  } else {
    carModeHome.doPlay();
  }
}

function logControl() {
  if (logDiv.style.display == 'none') {
    btnLog.innerText = 'Hide Log';
    logDiv.style.display = 'block';
  } else {
    btnLog.innerText = 'Show Log';
    logDiv.style.display = 'none';
  }
}

function moveElement(elementID, interval) {
  var distance = 0;
  var elem = document.getElementById(elementID);
  elem.movement = setInterval(function() {
    distance += 10;
    if (distance >= 400) {
      distance = 0;
    }
    elem.style.left = distance + "px";
  }, interval);
}
function startAnimation() {
  play_wave1.style.display = "block";
  play_wave2.style.display = "block";
  play_wave3.style.display = "block";
  moveElement("play_wave1", 15);
  moveElement("play_wave2", 20);
  moveElement("play_wave3", 30);
}

function stopAnimation() {
  play_wave1.style.left = "0px";
  play_wave2.style.left = "0px";
  play_wave3.style.left = "0px";
  play_wave1.style.display = "none";
  play_wave2.style.display = "none";
  play_wave3.style.display = "none";
  if (play_wave1.movement) {
    clearInterval(play_wave1.movement);
  }
  if (play_wave2.movement) {
    clearInterval(play_wave2.movement);
  }
  if (play_wave3.movement) {
    clearInterval(play_wave3.movement);
  }
}