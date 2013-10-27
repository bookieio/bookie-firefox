self.port.on("show", function (activeTab) {
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

});

self.port.on('saved', function() {
    //window.close(); this is not allowed apparently
});
