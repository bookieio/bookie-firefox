var prefs = require('sdk/simple-prefs'),
    BookieApi = require('./api').BookieApi,
    api = BookieApi(prefs.prefs);


var init = function() {
    prefs.on("", onPrefChange);
    prefs.on('sync', function() {
        // TODO /:username/extension/sync
        console.log('SYNC IT');
    });

    // TODO
    // hook into /api/v1/{username}/ping to check settings
    function onPrefChange(prefName) {
        api.ping({
            success:  function(response) {
                console.log("The " + prefName + " preference changed.");
            },
            failure: function(response) {
                console.log(
                    "The ping command failed. " +
                    "Please check your api url, username, and api_key. " +
                    prefName + " was just changed and didn't help.");
            }
        }, this);
    }

    return prefs.prefs;
};


exports.init = init;
