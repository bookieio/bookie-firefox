/*jshint moz:true*/
var data = require("sdk/self").data,
    tabs = require("sdk/tabs"),
    Panel = require("sdk/panel").Panel,
    hash_url = require("./hash").hash_url;


const BMARK_SUCCESS = 'bmark_success';
const BMARK_ERROR = 'bmark_error';
const BMARK_REMOVED = 'bmark_removed';
const BMARK_EXISTS = 'bmark_exists';
const BMARK_RESET = 'icon_reset';


exports.init = function(prefs, api, storage) {
    console.log('panel init');
    console.log(prefs);
    console.log(api);

    var addBookmarkPanel = Panel({
        contentURL: data.url("popup.html"),
        contentScriptFile: data.url("popup.js"),
        width: 600,
        height: 300
    });

    // Watch the tab for activate and show the + icon if the url has been
    // bookmarked.
    // @TODO
    addBookmarkPanel.bindWidget = function(widget) {
      this._widget = widget;
    };

    /**
     * Make ping request to check configuration settings on panel show.
     *
     * @method ping_check_prefs
     *
     */
    var ping_check_pref = function(prefs, api) {
        api.ping({
            success: function(response) {
                console.log('successful ping');
                var isError = response.json.error;

                if (isError) {
                    msg = response.json.error;
                } else {
                    msg = null;
                }
                addBookmarkPanel.port.emit('ping', msg);
            },
            failure: function(response) {
                console.log('failure ping');
                console.log(response);
                console.log(response.responseText);
                addBookmarkPanel.port.emit('ping', 'Error making ping request.');
            }
        }, this);

    };

    var fetch_bmark = function(api, hash_id) {
        // don't waste a call if this is a blank new tab
        // hash '4fa72d735a519e' == url 'about:newtab'
        if (hash_id !== '4fa72d735a519e') {
            api.bmark(hash_id, {
                success: function(response) {
                    console.log(response.status);
                    if (response.status == 200) {
                        console.log('fetch bmark success');
                        addBookmarkPanel.port.emit('bmark_data',
                                               response.json.bmark);
                    } else {
                        console.log('fetch bmark latest');
                        console.log(response.json);
                        addBookmarkPanel.port.emit('bmark_data',
                                                   {},
                                                   response.json.last);
                    }

                },
                failure: function(response) {
                    console.log('fetch bmark failure');
                    console.log(response.json);

                    addBookmarkPanel.port.emit('bmark_data',
                                               {},
                                               response.json.last);
                }
            }, this);
        }
    };



    // @ToDo
    // On show we can do the work to check if the user has bookmarked this
    // page before and load the content. This needs to go through the api to
    // get the current bookmark data or load the default content.

    // Send the content script a message called "show" when
    // the panel is shown.
    addBookmarkPanel.on('show', function() {
        console.log('panel show');
        console.log(prefs);
        console.log(tabs.activeTab);

        let user_url = prefs.api_url.replace(/api\/v1\/?/, '');

       // Make the ping to check prefs for the user.
       ping_check_pref(prefs, api);

       // TODO
       // also want to pull the tabs content if the
       // appropriate user option is set
       console.log("url of active tab is " + tabs.activeTab.url);
       console.log("title of active tab is " + tabs.activeTab.title);

       addBookmarkPanel.port.emit('show', {
           'bmark_url': user_url + prefs.api_username
       });

       // TODO
       // also want to pull the tabs content if the
       // appropriate user option is set
       addBookmarkPanel.port.emit('bmark_data', {
           tags: [],
           hash_id: '',
           extended: '',
           description: tabs.activeTab.title,
           url: tabs.activeTab.url
       });

       // Now let's see if the user has bookmarked this before.
       console.log('hashing url');
       var hash_id = hash_url(tabs.activeTab.url);
       console.log(hash_id);
       fetch_bmark(api, hash_id);
    });

    // Handle saving a new bookmark.
    addBookmarkPanel.port.on('save_bmark', function (bmark) {
        console.log('save bookmark');
        console.log(prefs);
        api.save(
            bmark, {
                success: function(res) {
                    console.log(res.text);

                    let result = res.json;
                    console.log(result);
                    console.log(result.bmark);
                    console.log(result.bmark.bid);
                    if (result.bmark.bid) {
                        console.log('IT WORKED');
                        storage.save(result.bmark.hash_id, true);

                        // Notify the world that we've saved the bookmark.
                        if (addBookmarkPanel._widget) {
                            console.log('NOTIFY WIDGET');
                            addBookmarkPanel._widget.port.emit(BMARK_EXISTS);
                        }

                        addBookmarkPanel.hide();
                    }
                }
            }, this
        );
    });

    /**
     * Send a request to the server to remove the bookmark from the system.
     *
     * @event del_bmark
     * @param {String} hash_id
     *
     */
    addBookmarkPanel.port.on('del_bmark', function(data) {
        console.log('del bmark');
        console.log(data);
        api.remove(data.hash_id, {
            success: function (response) {
                console.log(response.json);
                // Notify the world that we've removed the bookmark.
                if (addBookmarkPanel._widget) {
                    console.log('NOTIFY WIDGET');
                    addBookmarkPanel._widget.port.emit(BMARK_REMOVED);
                    // Clear the data on this bookmark.
                    storage.save(data.hash_id, undefined);
                }
                addBookmarkPanel.hide();
            },
            failure: function(response) {
                console.log('NOTIFY WIDGET FAILURE');
                addBookmarkPanel._widget.port.emit(BMARK_ERROR);
                addBookmarkPanel.hide();
                console.log(response.json.error);
            }
        });
    });

    return addBookmarkPanel;
};
