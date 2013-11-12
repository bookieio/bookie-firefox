/*jshint moz:true*/

/**
    This script is used with the panel as it's contentscript and had access to
    the html in the panel.

*/

self.port.on("show", function (activeTab, userConfig) {
    console.log('SHOWN');

    // TODO
    // also want to pull the tabs content if the
    // appropriate user option is set
    console.log("url of active tab is " + activeTab.url);
    console.log("title of active tab is " + activeTab.title);

    document.getElementById('url').value = activeTab.url;
    document.getElementById('description').value = activeTab.title;

    document.getElementById('form').addEventListener('submit', function(event) {
        event.preventDefault();

        let f = event.target;
        self.port.emit('save_bmark', {
            'url': f.url.value,
            'description': f.description.value,
            'extended': f.extended,
            'tags': f.tag_filter.value
        });
    });

    // setup link to users bmark instance page
    document.getElementById('bookie_site').href = userConfig.bmark_url;
});

self.port.on('saved', function() {
    //window.close(); this is not allowed apparently
});

/**
 * If the ping request was successfull or unsuccessful, update the dom to
 * represent it.
 *
 * @event ping
 *
 */
self.port.on('ping', function(error_msg) {
    console.log('Ping Error Message');
    console.log(error_msg);

    var errors = document.querySelector('#errors');

    if (error_msg) {
        msg = "Attempted to ping the server but got an error: '" + error_msg;
        msg += "'<br />Please check your api url, username, and api_key settings";
        errors.innerHTML = msg;
        errors.className = '';
    } else {
        errors.innerHTML = '';
        errors.className = 'hidden';
    }
});
