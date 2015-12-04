/* 
 * @Author: Jeremy De la casa
 */

var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var Request = require("sdk/request").Request;
var setInterval = require("sdk/timers").setInterval;
var notifications = require("sdk/notifications");

var channel = 'namelesscsgo';
var icon_128 = "./nameless-128.png";
var icon_64 = "./nameless-64.png"
var icon_32 = "./nameless-32.png"
var icon_16 = "./nameless-16.png"
var icon_black_64 = "./nameless-black-64.png"
var icon_black_32 = "./nameless-black-32.png"
var icon_black_16 = "./nameless-black-16.png"
var title = 'Yo';
var message = 'Nameless est en Live !';
var testStatus = false;

//Get status all 60sec
var ct = 60000; 

var interval;

/*
 * Create Loop Function
 */
function loadInterval(){ 

  interval = setInterval(function(){ 
    
    getLiveStatus(function(status){
      doSomething(status);
    });

  }, ct);

}

/*
 * Return True or False depending on the status
 */
function getLiveStatus(callback){ 

  var url = 'https://api.twitch.tv/kraken/streams/'
  var urlApiStream = url+channel;

  Request({
    url: urlApiStream,
    onComplete: function(response){
      response = response.json;

      if(response.stream != null){
        callback(true)
      }else{
        callback(false);
      }
    }
  }).get();

}

/*
 * Do Something depending of the status
 */
function doSomething(status){ 

  if(status){ //If Live

    if(!testStatus){ 
      
      button.state("window", {
        "icon" : {
          "16": icon_16,
          "32": icon_32,
          "64": icon_64
        }
      });

      notifications.notify({
        title: title,
        text: message,
        iconURL: icon_128,
        onClick: handleClick
      });

      testStatus = true;
    }

  }else{ //If Offline

    if(testStatus){

      button.state("window", {
        "icon" : {
          "16": icon_black_16,
          "32": icon_black_32,
          "64": icon_black_64
        }
      });

      testStatus = false;
    }

  }

}

/*
 * Load App
 */
getLiveStatus(function(status){
  doSomething(status);
});

loadInterval();

var button = buttons.ActionButton({
  id: "namelesslive_link",
  label: "Nameless Live",
  icon: {
    "16": icon_black_16,
    "32": icon_black_32,
    "64": icon_black_64
  },
  onClick: handleClick
});

function handleClick(state) {
  tabs.open("http://www.twitch.tv/"+channel);
}