var data = require("sdk/self").data,
    widgets = require("sdk/widget"),
    tabs = require("sdk/tabs"),
    BookieApi = require('./api').BookieApi,
    panel = require('./panel'),
    preferences = require('./preferences'),

    api = BookieApi(prefs.prefs);

const BMARK_SUCCESS = 'bmark_success';
const BMARK_ERROR = 'bmark_error';
const BMARK_REMOVED = 'bmark_removed';
const BMARK_EXISTS = 'bmark_exists';


// Setup the preferences and watch for changes to set values.
// Hold a reference to the preferences for the ability to bind to it's events?
var prefs = preferences.init();

// @ToDo
// The panel needs to bind to the onPrefChange event. However, only if it's
// successful. It should publish a new event that the panel can listen to.
var bookie_panel = panel.init(preferences.prefs);

// The icon in the addon toolbar.
// @ToDo
// Move the widget to it's own module? It looks rather self contained though.

// @ToDo
// The widget needs to listen to the success event to get the
// widget.prot.emit() value from the contained save function.
var widget = widgets.Widget({
  id: "bookie-widget",
  label: "Create Bookie Bookmark",
  contentURL: data.url('widget_html.html'),
  contentScriptFile: data.url('widget_script.js'),
  panel: bookie_panel
});

