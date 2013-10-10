var data = require("sdk/self").data,
    widgets = require("sdk/widget"),
    tabs = require("sdk/tabs"),
    prefs = require('sdk/simple-prefs');


prefs.on("", onPrefChange);
prefs.on('sync', function() {
    console.log('SYNC IT');
});

// TODO
// hook into /api/v1/{username}/ping to check settings
function onPrefChange(prefName) {
    console.log("The " + prefName + " preference changed.");
}

var addBookmarkPanel = require("sdk/panel").Panel({
    contentURL: data.url("popup.html"),
    contentScriptFile: data.url("popup.js")
});
// Send the content script a message called "show" when
// the panel is shown.
addBookmarkPanel.on("show", function() {
    addBookmarkPanel.port.emit("show", {
        'url': tabs.activeTab.url,
        'title': tabs.activeTab.title
    });
});

var widget = widgets.Widget({
  id: "bookie-widget",
  label: "Create Bookie Bookmark",
  contentURL: data.url('favicon.ico'),
  panel: addBookmarkPanel
});


