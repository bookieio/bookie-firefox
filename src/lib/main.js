var data = require("sdk/self").data,
    widgets = require("sdk/widget"),
    tabs = require("sdk/tabs"),
    prefs = require('sdk/simple-prefs'),
    Request = require("sdk/request").Request,
    Api = require('./api').Api,

    api = Api(prefs.prefs);


prefs.on("", onPrefChange);
prefs.on('sync', function() {
    // TODO /:username/extension/sync
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
addBookmarkPanel.on('show', function() {
    addBookmarkPanel.port.emit('show', {
        'url': tabs.activeTab.url,
        'title': tabs.activeTab.title
    });
});

// Handle saving a new bookmark.
addBookmarkPanel.port.on('save_bmark', function (bmark) {
    api.post(
        prefs.prefs.api_username + '/bmark',
        bmark,
        function(res) {
            console.log(res.text);

            let result = res.json;
            if (result.bmark.bid) {
                console.log('IT WORKED');
                addBookmarkPanel.destroy();

                addBookmarkPanel.port.emit('saved');
            };
        }
    );
});

// The icon in the addon toolbar.
var widget = widgets.Widget({
  id: "bookie-widget",
  label: "Create Bookie Bookmark",
  contentURL: data.url('favicon.ico'),
  panel: addBookmarkPanel
});

