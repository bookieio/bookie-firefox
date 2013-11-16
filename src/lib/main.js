var data = require("sdk/self").data,
    prefs = require('sdk/simple-prefs'),
    tabs = require("sdk/tabs"),
    widgets = require("sdk/widget"),
    BookieApi = require('./api').BookieApi,
    api = BookieApi(prefs.prefs);

// Util to hash a url into the hash_id used in Bookie.
var hash_url = require("./hash").hash_url;

// Storage to keep track of the bookmarks we've bookmarked before.
var storage = require('./storage').Storage();

// Setup the preferences and watch for changes to set values.
// Hold a reference to the preferences for the ability to bind to it's events?
var preferences = require('./preferences');
var preferenceData = preferences.init(prefs, api, storage);

// @ToDo
// The panel needs to bind to the onPrefChange event. However, only if it's
// successful. It should publish a new event that the panel can listen to.
var panel = require('./panel');
var bookie_panel = panel.init(preferenceData, api, storage);

// The icon in the addon toolbar.
// @ToDo
// Move the widget to it's own module? It looks rather self contained though.
// @ToDo
// The widget needs to listen to the success event to get the
// widget.port.emit() value from the contained save function.
var widget = widgets.Widget({
  id: "bookie-widget",
  label: "Create Bookie Bookmark",
  contentURL: data.url('widget_html.html'),
  contentScriptFile: data.url('widget_script.js'),
  panel: bookie_panel
});

// Make sure the panel notifies the widget that things have happened.
bookie_panel.bindWidget(widget);

// Whenever the tab changes, check if we should be showing the bookmark'd icon
// or the normal icon to the user.
tabs.on('activate', function(tab) {
    var hash_id = hash_url(tab.url);

    if (storage.get(hash_id)) {
        widget.port.emit('bmark_exists');
    } else {
        widget.port.emit('icon_reset');
    }
});
tabs.on('ready', function(tab) {
    var hash_id = hash_url(tab.url);

    if (storage.get(hash_id)) {
        widget.port.emit('bmark_exists');
    } else {
        widget.port.emit('icon_reset');
    }
});
