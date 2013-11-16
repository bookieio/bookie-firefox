var preferenceData = {};

console.log('preferences.js');
console.log(preferenceData);

var init = function(prefs, api, storage) {
    prefs.on("", onPrefChange);
    prefs.on('sync', onSyncBmarks);

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

    function onSyncBmarks() {
        console.log('SYNC IT');
        api.sync({
            success: function(resp) {
                resp.json.hash_list.forEach(function(key) {
                    storage.save(key, true);
                })
            },
            failure: function(resp) {
                console.log('sync fail');
                console.log(resp.json);
            }
        }, this);
    }

    preferenceData = prefs.prefs;
    console.log('returning pref.js');
    console.log(preferenceData);
    return preferenceData;
};


exports.init = init;
