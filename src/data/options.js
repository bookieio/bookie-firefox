self.port.emit("getPreferences");

var handle = function(element) {
    return document.getElementById(element);
};

var saveButton = handle('save_button'),
    syncButton = handle('sync_button'),
    pingStatus = handle('options_msg'),
    syncStatus = handle('sync_msg');

saveButton.onclick = function(e) {
    e.preventDefault();
    pingStatus.className = "";
    pingStatus.textContent = "Checking...";
    var prefData = {};
    prefData['api_key'] = handle('api_key').value;
    prefData['api_username'] = handle('api_username').value;
    prefData['api_url'] = handle('api_url').value;
    prefData['cache_content'] = handle('cache_content').checked;

    self.port.emit('savePreferences', prefData);
};

syncButton.onclick = function() {
    self.port.emit('syncBookmarks');
    syncStatus.className = "";
    syncStatus.textContent = "Syncing...";
};

self.port.on("prefData", function(prefData) {

    if (prefData.api_key) {
        handle("api_key").value = prefData.api_key;
    } else {
        handle("api_key").value = "XXXXXX";
    }

    if (prefData.api_url) {
        handle("api_url").value = prefData.api_url;
    } else {
        handle("api_url").value = "https://bookie.io/api/v1/";
    }

    if (prefData.api_username) {
        handle("api_username").value = prefData.api_username;
    }

    if (prefData.cache_content) {
        handle("cache_content").checked = prefData.cache_content;
    }
});

self.port.on("syncSuccess", function() {
    syncStatus.className = "success";
    syncStatus.textContent = "Your bookmarks have been successfully synced!";
});

self.port.on("syncFailure", function(response) {
    syncStatus.className = "error";
    syncStatus.textContent = "Your bookmarks failed to sync. Server replied : '" + response + "'";
});


self.port.on("pingSucceeded", function() {
    pingStatus.className = "success";
    pingStatus.textContent = "Your settings have been successfully updated. Happy bookmarking!";
});

self.port.on("pingFailed", function(json) {

    pingStatus.className = "error";
    var message = "";

    if (json) {
        message = "Please check your config. Server replied '" + json.message + "'";
    } else {
        message = "Unexpected response from server.";
    }

    pingStatus.textContent = message;
});
