const widgets = require("widget");
const data = require('self').data;
const panel = require("panel");
const tabs = require("tabs");
const request = require("request");
const notifications = require("notifications");
const preferences = require("simple-prefs");

var popup = panel.Panel({
    contentURL: data.url("popup.html"),
    width:480,
    height:300,
});

// our bookie button
var widget = widgets.Widget({
    id: "bookie-link",
    label: "Bookie",
    contentURL: data.url("bookie/logo.16.png"),
    panel: popup
});

// when the panel is shown, populate the active tab title / url
popup.on("show", function(arg) {
    popup.port.emit("active", {
        description: tabs.activeTab.title,
        url: tabs.activeTab.url
    });
});

// show OS notifications
popup.port.on("notify", function(notification) {
    notifications.notify({
        title: notification.title,
        text: notification.text
    });
});

// all network requests need to go through addonscripts; 
// contentscripts can't make requests. Provide netrequest
// and netresponse events that the contentscript 
// can emit / listen to in order to get around this
popup.port.on("netrequest", function(opts) {
    console.log(opts.callbackId + ": request " + opts.url);

    // on response, fire off an event to the contentscript with the response data
    var onComplete = function(response) {
        console.log(opts.callbackId + ": response " + response.status + " " + response.text);
        var data = {
            status:response.status,
            statusText:response.statusText,
            responseText:response.text
        };
        popup.port.emit("netresponse", {
            callbackId: opts.callbackId,
            data:data
        });
    };

    var r = request.Request({
        url: opts.url,
        onComplete: onComplete,
        headers:opts.options.headers,
        content:opts.options.data
    });

    //send our request by invoking get() or post()
    r[opts.options.method.toLowerCase()]();
});


// when the user changes a preference, sent the preferences to 
// the contentscript so it can save it to localstorage
preferences.on("api_username", onPreferenceChanged);
preferences.on("api_url", onPreferenceChanged);
preferences.on("api_key", onPreferenceChanged);
function onPreferenceChanged(pref) {
    popup.port.emit("preferenceChange", {
        api_username: preferences.prefs['api_username'],
        api_url: preferences.prefs['api_url'],
        api_key: preferences.prefs['api_key']
    });
}


// misc helper debugging events. console.log currently doesn't work in panel content scripts
popup.port.on("debug", function(obj) {
    for(var i in obj) {
        console.log("DEBUG: " + i + ": " + obj[i].toString())
    }
});
popup.port.on("log", function(obj) {
    console.log("Logger: " + obj)
});
