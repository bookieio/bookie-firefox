const widgets = require("widget");
const data = require('self').data;
const panel = require("panel");
const tabs = require("tabs");

var popup = panel.Panel({
    contentURL: data.url("popup.html"),
    //contentScript: "self.port.emit('show', 'panel is showing');",
    width:480,
    height:300,
    //onShow: function() {
    //}
});

popup.port.on("show", function(arg) {
        popup.port.emit("active", tabs.activeTab.title);
        console.log("sent active tab " + tabs.activeTab.title);
})

var widget = widgets.Widget({
    id: "bookie-link",
    label: "Bookie",
    contentURL: data.url("bookie/logo.16.png"),
    panel: popup
});

console.log("init complete");
