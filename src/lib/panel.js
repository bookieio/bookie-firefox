var data = require("sdk/self").data,
    tabs = require("sdk/tabs"),
    Panel = require("sdk/panel").Panel,
    BookieApi = require('./api').BookieApi,
    preferences = require('./preferences'),

    api = BookieApi(prefs.prefs);


export.init = function(prefs) {

    var addBookmarkPanel = Panel({
        contentURL: data.url("popup.html"),
        contentScriptFile: data.url("popup.js")
    });

    // Send the content script a message called "show" when
    // the panel is shown.
    addBookmarkPanel.on('show', function() {
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
