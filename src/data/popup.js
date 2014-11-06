/*jshint moz:true*/

/**
 * This script is used with the panel as it's contentscript and had access to
 * the html in the panel.
 */

/**
 * Given a set of bmark data, update the form UI with the information.
 *
 * @event bmark-data
 * @param {Object} data The bmark data such as hash_id, url, title, etc.
 *
 */
self.port.on('bmark_data', function (data, tag_suggestions) {
    console.log("Bmark object");
    console.log(data);
    console.log("Tag Suggestions array");
    console.log(tag_suggestions);

    var isHidden,
        del = document.getElementById('delete'),
        tagList = [];

    // If it's a new bookmark it'll have a url from the tab data.
    if (data.url) {
        document.getElementById('url').value = data.url;
    }

    if (data.description) {
        document.getElementById('description').value = data.description;
    }

    if (data.extended) {
        document.getElementById('extended').value = data.extended;
    }

    // If it's an existing bmark we'll have a hash_id to id this bmark.
    if (data.hash_id) {
        del.className = del.className.replace('hidden', '');
    } else {
        isHidden = del.className.indexOf('hidden') !== -1;
        if (!isHidden) {
            del.className = del.className + " hidden";
        }
    }
    document.getElementById('hash_id').value = data.hash_id;

    // This bmark is being edited, so populate the tag input box.
    if (data.tags) {
        var tag_str = "";
        data.tags.forEach(function(tag) {
            tag_str += tag.name + ' ';
        });
        document.getElementById('tag_filter').value = tag_str;
    }

    var suggested = document.getElementById("suggested_tags");
    var latest = document.getElementById("latest_tags");

    // Reset the latest tag box before we update it.
    latest.innerHTML = '';

    // When you navigate to a different tab, make sure to delete
    // the tag suggestions for the tab where the panel was
    // previously used. Hide the element and defer the unhide
    // until the tagList object has some tags in it.
    isHidden = suggested.className.indexOf('hidden') !== -1;
    if (!isHidden) {
        suggested.className = suggested.className + " hidden";
        isHidden = true;
    }

    // If there are tag suggestions, push them to the list of available
    // tags used in the form.
    if (tag_suggestions) {
        tag_suggestions.forEach(function(tag) {
            tagList.push(tag);
        });
    }

    // Update the suggested tags field now
    tagList.forEach(function(tag) {
        latest.innerHTML += '<a href="" class="prev_tag">' + tag + '</a>';
    });

    // Show the suggested tags field, if there are elements in the tagList.
    if (tagList.length) {
        // Show by removing the hidden css class.
        suggested.className = suggested.className.replace('hidden', '');
        isHidden = false;
    } else {
        isHidden = suggested.className.indexOf('hidden') !== -1;
        if (!isHidden) {
            suggested.className = suggested.className + " hidden";
            isHidden = true;
        }
    }

    if (data.is_private) {
        document.getElementById('is_private').checked = data.is_private;
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
        console.log('on submit');
        console.log(f);
        var url = document.getElementById('url');
        console.log('url:' + url.value);

        console.log(f.url.value);
        console.log(f.tag_filter.value);
        console.log('CONTENT in api call');
        console.log(f.content.value.substring(0, 100));
        var bmark_data = {
            'url': f.url.value,
            'description': f.description.value,
            'extended': f.extended.value,
            'tags': f.tag_filter.value,
            'inserted_by': f.inserted_by.value,
            'is_private': f.is_private.checked
        };

        console.log('Cache Content?');
        if (userConfig.cache_content && userConfig.cache_content !== 'false') {
            console.log('Sending page content with api request to save');
            bmark_data.content = f.content.value;
        }

        self.port.emit('save_bmark', bmark_data);
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
    var bmark_link = document.getElementById('bookie_site');
    bmark_link.href = userConfig.bmark_url;
    bmark_link.addEventListener('click', function(ev) {
        self.port.emit('hide_popup');
    });

    // Give focus to the tag element to start entering and saving.
    document.getElementById('tag_filter').focus();

    var latest = document.getElementById("latest_tags");

    // Detach any old event for suggested tags and re-attach.
    console.log("SuggestedTagClick1");
    // According go MDN dupe events are discarded.
    latest.addEventListener("click", function(ev) {
        ev.preventDefault();
        var target = ev.target;
        if (target.nodeName.toLowerCase() === 'a') {

            var tag_filter = document.getElementById('tag_filter');
            // Only add the tag if it's not already there.
            var tag_exists = new RegExp('^' + target.innerHTML + ' ');
            var tag_exists2 = new RegExp(' ' + target.innerHTML + ' ');

            if (!tag_exists.exec(tag_filter.value) && !tag_exists2.exec(tag_filter.value)) {
                tag_filter.value = tag_filter.value + target.innerHTML + ' ';
                tag_filter.setAttribute('value', tag_filter.value);
            }

            latest.removeChild(target);
        }
        return;
    });
});

self.port.on('saved', function() {
    //window.close(); this is not allowed apparently
    //@ToDo store the hash of the saved bookmark into the localstorage or some
    //storage to track we have bookmarked this before?
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
        var msg = "Attempted to ping the server but got an error: '" + error_msg;
        msg += "'<br />Please check your api url, username, and api_key settings";
        errors.innerHTML = msg;
        errors.className = '';
    } else {
        errors.innerHTML = '';
        errors.className = 'hidden';
    }
});

self.port.on('saveError', function(error_msg) {
    var errors = document.querySelector('#errors');

    if (error_msg) {
        var msg = "Attempted to save the bookmark but got an error: '" + error_msg;
        errors.innerHTML = msg;
        errors.className = '';
    } else {
        errors.innerHTML = '';
        errors.className = 'hidden';
    }
});

self.port.on('panelHtml', function(html) {
    console.log('on panelHtml');
    console.log(html.substring(0, 100));
    document.getElementById('content').value = html;
});
