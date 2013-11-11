var preferenceData = {};
console.log('preferences.js');
console.log(preferenceData);
var init = function(prefs, api) {
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
        // Update the preferences.
        console.log('updating preferences');
        console.log(prefs.prefs);
        preferenceData = prefs.prefs;
    }

    preferenceData = prefs.prefs;
    console.log('returning pref.js');
    console.log(preferenceData);
    return preferenceData;
};


exports.init = init;
