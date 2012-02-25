const widgets = require("widget");
const data = require('self').data;
const panel = require("panel");

var popup = panel.Panel({
    contentURL: data.url("popup.html"),
    width:480,
    height:300
});

var widget = widgets.Widget({
    id: "bookie-link",
    label: "Bookie",
    contentURL: data.url("bookie/logo.16.png"),
    panel: popup
});

