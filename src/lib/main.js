const widgets = require("widget");
const data = require('self').data;
const panel = require("panel");
const tabs = require("tabs");

var popup = panel.Panel({
    contentURL: data.url("popup.html"),
    width:480,
    height:300,
});

popup.on("show", function(arg) {
    popup.port.emit("active", tabs.activeTab.title);
    console.log("sent active tab title");
})

var widget = widgets.Widget({
    id: "bookie-link",
    label: "Bookie",
    contentURL: data.url("bookie/logo.16.png"),
    panel: popup
});

console.log("init complete");
