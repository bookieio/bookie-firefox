var saveButton = document.getElementById('save_button'),
    syncButton = document.getElementById('sync_button'),
    pingStatus = document.getElementById('options_msg'),
    syncStatus = document.getElementById('sync_msg');

saveButton.onclick = function(e) {
    e.preventDefault();
    pingStatus.className = "";
    pingStatus.textContent = "Checking...";
    var prefData = {};
    prefData['api_key'] = document.getElementById('api_key').value;
    prefData['api_username'] = document.getElementById('api_username').value;
    prefData['api_url'] = document.getElementById('api_url').value;
    prefData['cache_content'] = document.getElementById('cache_content').checked;

    self.port.emit('savePreferences', prefData);
};

syncButton.onclick = function() {
    self.port.emit('syncBookmarks');
    syncStatus.className = "";
    syncStatus.textContent = "Syncing...";
};

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
