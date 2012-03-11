const widgets = require("widget");
const data = require('self').data;
const panel = require("panel");
const tabs = require("tabs");
const request = require("request");
const notifications = require("notifications");

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

// misc helper debugging events. console.log currently doesn't work in panel content scripts
popup.port.on("debug", function(obj) {
    for(var i in obj) {
        console.log("DEBUG: " + i + ": " + obj[i].toString())
    }
});
popup.port.on("log", function(obj) {
    console.log("Logger: " + obj)
});
