/*jshint moz:true*/

/**
    This script is used with the panel as it's contentscript and had access to
    the html in the panel.

*/

/**
 * Given a set of bmark data, update the form UI with the information.
 *
 * @event bmark-data
 * @param {Object} data The bmark data such as hash_id, url, title, etc.
 *
 */
self.port.on('bmark_data', function (data) {
    console.log('bmark_data');
    console.log(data);
    var del = document.getElementById('delete');
    if (data.hash_id) {
        document.getElementById('hash_id').value = data.hash_id;

        // Show the delete button as an option.
        del.className = del.className.replace('hidden', '');
    } else {
        var isHidden = del.className.indexOf('hidden') !== -1;
        if (!isHidden) {
            del.className = del.className + " hidden";
        }
    }

    if (data.tags) {
        var tag_str = "";
        data.tags.forEach(function (tag) {
            tag_str += tag.name + ' ';
        });
        document.getElementById('tag_filter').value = tag_str;
    }

    if (data.description) {
        document.getElementById('description').value = data.description;
    }

    if (data.extended) {
        document.getElementById('extended').value = data.extended;
    }
});


/**
 * When the widget is clicked on, the panel is shown and this contentscript is
 * loaded to deal with panel related DOM manipulation.
 *
 * @event show
 * @param {Object} userConfig Some user specific data such as the user's
 * bookie url.
 *
 */

self.port.on("show", function (userConfig) {
    console.log('SHOWN');

    var form = document.getElementById('form');
    form.addEventListener('submit', function(ev) {
        ev.preventDefault();

        let f = ev.target;
        self.port.emit('save_bmark', {
            'url': f.url.value,
            'description': f.description.value,
            'extended': f.extended,
            'tags': f.tag_filter.value
        });
    });


    var del = document.getElementById('delete');
    del.addEventListener('click', function(ev) {
        // Grab the hash_id of the url in order to remove it.
        var hash_id = document.getElementById("hash_id");
        console.log('hash id field');
        console.log(hash_id.value);
        self.port.emit('del_bmark', {
            hash_id: hash_id.value
        });
    });

    // setup link to users bmark instance page
    document.getElementById('bookie_site').href = userConfig.bmark_url;
});


self.port.on('saved', function() {
    //window.close(); this is not allowed apparently
    //@ToDo store the hash of the saved bookmark into the localstorage or some
    //storage to track we have bookmarked this beore?
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
