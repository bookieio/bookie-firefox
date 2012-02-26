const widgets = require("widget");
const data = require('self').data;
const panel = require("panel");
const tabs = require("tabs");
const notifications = require("notifications");

var popup = panel.Panel({
    contentURL: data.url("popup.html"),
    width:480,
    height:300,
});

popup.on("show", function(arg) {
    popup.port.emit("active", {
        description: tabs.activeTab.title,
        url: tabs.activeTab.url
    });
    console.log("sent active tab title: " + tabs.activeTab.title);
});

popup.port.on("notify", function(notification) {
    console.log("Notification: " + notification.text);
    notifications.notify({
        title: notification.title,
        text: notification.text
    });
});

var widget = widgets.Widget({
    id: "bookie-link",
    label: "Bookie",
    contentURL: data.url("bookie/logo.16.png"),
    panel: popup
});
