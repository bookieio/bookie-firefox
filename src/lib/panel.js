/*jshint moz:true*/
var data = require("sdk/self").data,
    tabs = require("sdk/tabs"),
    Panel = require("sdk/panel").Panel;


const BMARK_SUCCESS = 'bmark_success';
const BMARK_ERROR = 'bmark_error';
const BMARK_REMOVED = 'bmark_removed';
const BMARK_EXISTS = 'bmark_exists';



exports.init = function(prefs, api) {
    console.log('panel init');
    console.log(prefs);
    console.log(api);

    var addBookmarkPanel = Panel({
        contentURL: data.url("popup.html"),
        contentScriptFile: data.url("popup.js"),
        width: 600
    });
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

        addBookmarkPanel.port.emit(
            'show',
            {
                'url': tabs.activeTab.url,
                'title': tabs.activeTab.title
            },
            {
                'bmark_url': user_url + prefs.api_username
            }
        );
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
                    if (result.bmark.bid) {
                        console.log('IT WORKED');
                        addBookmarkPanel.destroy();

                        addBookmarkPanel.port.emit('saved');
                        widget.port.emit(BMARK_SUCCESS);
                    }
                }
            }, this
        );
    });

    return addBookmarkPanel;
};
