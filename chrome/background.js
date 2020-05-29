/*
 * @Author: Jeremy De la casa
 */

var channel = "namelesscsgo";
var icon_19 = "nameless-19.png";
var icon_19_live = "nameless-live-19.png";
var icon_128 = "nameless-128.png";
var title = "Yo";
var message = "Nameless est en Live !";
var prevStatus = false;
var api = "https://api.twitch.tv/kraken/streams/88716970";

//Get status all 60sec
var ct = 60000;

var interval;

/*
 * Stop Loop Function
 */
function stopInterval() {
  if (interval) {
    clearInterval(interval);
  }
}

/*
 * Return True or False depending on the status
 */
function getLiveStatus(callback) {
  return new Promise(function (resolve, reject) {
    var urlApiStream = api;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", urlApiStream);
    xhr.setRequestHeader("Client-ID", "aj89e5g6fslvtsxn9psho8v9h18uxr");
    xhr.setRequestHeader("Accept", "application/vnd.twitchtv.v5+json");
    xhr.responseType = "json";

    xhr.onload = function () {
      var response = xhr.response;

      if (response.stream) {
        resolve(true);
      } else {
        resolve(false);
      }
    };

    xhr.onerror = function (error) {
      reject(error);
    };

    xhr.send();
  });
}

const launchExtension = function () {
  getLiveStatus()
    .then(
      function (status) {
        console.log({ status, prevStatus });
        if (status && !prevStatus) {
          chrome.browserAction.setIcon({ path: icon_19_live });
          chrome.notifications.create("isLive", {
            type: "basic",
            title: title,
            iconUrl: icon_128,
            message: message,
          });
          prevStatus = true;
        } else if (!status && prevStatus) {
          chrome.browserAction.setIcon({ path: icon_19 });
          chrome.notifications.clear("isLive");
          prevStatus = false;
        }
      },
      function (error) {
        console.log(error);
      }
    )
    .then(function () {
      stopInterval();
      interval = setInterval(launchExtension, ct);
    });
};

launchExtension();

/*
 * Listen browser Actions
 */

//If click on Icon
chrome.browserAction.onClicked.addListener(function (tabs) {
  chrome.tabs.create({
    url: "http://www.twitch.tv/" + channel,
  });
});

//If click on notification
chrome.notifications.onClicked.addListener(function (notificationId) {
  chrome.tabs.create({
    url: "http://www.twitch.tv/" + channel,
  });
});
