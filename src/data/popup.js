self.port.on("show", function (activeTab) {
    console.log('SHOWN');

    // TODO
    // also want to pull the tabs content if the
    // appropriate user option is set
    console.log("url of active tab is " + activeTab.url);
    console.log("title of active tab is " + activeTab.title);

    document.getElementById('url').value = activeTab.url;
    document.getElementById('description').value = activeTab.title;
});
