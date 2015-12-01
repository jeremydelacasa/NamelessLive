/* 
 * @Author: Jeremy De la casa
 */

var channel = 'namelesscsgo';
var icon_19 = 'nameless-19.png';
var icon_19_live = 'nameless-live-19.png';
var icon_128 = "nameless-128.png";
var title = 'Yo';
var message = 'Nameless est en Live !';

//Get status all 60sec
var ct = 60000; 

var interval;

/*
 * Create Loop Function
 */
function loadInterval(ct){ 

  interval = setInterval(function(){ 
    
    getLiveStatus(function(status){
      doSomething(status);
    });

  }, ct);

}

/*
 * Stop Loop Function
 */
function stopInterval() { 
  clearInterval(interval);
}

/*
 * Return True or False depending on the status
 */
function getLiveStatus(callback){ 

  var url = 'https://api.twitch.tv/kraken/streams/'

  var urlApiStream = url+channel;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', urlApiStream);
  xhr.responseType = 'json';

  xhr.onload = function() {

    var response = xhr.response;

    if(response.stream != null){
      callback(true)
    }else{
      callback(false);
    }

  }

  xhr.send();

}

/*
 * Do Something depending of the status
 */
function doSomething(status){ 

  if(status == true){ //If Live

    chrome.browserAction.setIcon({path: icon_19_live});
    chrome.notifications.create('isLive',{type:'basic', title:title, iconUrl: icon_128, message:message});

  }else{ //If Offline

    chrome.browserAction.setIcon({path: icon_19});
    chrome.notifications.clear('isLive');
    stopInterval();

    ct = 60000;
    loadInterval(ct);
  }

}

/*
 * Load App
 */
getLiveStatus(function(status){
  doSomething(status);
});

loadInterval(ct);

/*
 * Listen browser Actions
 */

//If click on Icon
chrome.browserAction.onClicked.addListener(function(tabs){ 
  chrome.tabs.create({
    url: 'http://www.twitch.tv/'+channel
  });
});

//If click on notification
chrome.notifications.onClicked.addListener(function(notificationId){ 
  chrome.tabs.create({
    url: 'http://www.twitch.tv/'+channel
  });
});

//If click on notification close button
chrome.notifications.onClosed.addListener(function(notificationId, byUser){
  stopInterval();

  ct = 300000;
  loadInterval(ct);
});